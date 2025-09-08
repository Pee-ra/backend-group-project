import express from "express";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();


// Signup a new user
router.post("/register", async (req, res, next) => {
  const { fullName, email, password , tel, roomNumber } = req.body;

  if (!fullName || !email || !password || !tel || !roomNumber) {
    return res.status(400).json({
      error: true,
      message: "All fields are required!",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "Email already in use!",
      });
    }

    const user = await User.create({ fullName, email, password, tel, roomNumber });

    res
      .status(201)
      .json({ error: false, user, message: "User registered successfully!" });
  } catch (err) {
    next(err);
  }
});



//Login a user
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "email and password are requried",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);  //เช็ค password ที่ส่งมา กับ password ที่เก็บไว้ใน db
    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials!",
      });
    }

    //Generate JWT (token) 1 hour
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProd = process.env.NODE_ENV === "production"; //ตัวแปร environment บนrender เช็คว่าตั้งไว้เปน production หรือไม่
    res.cookie("accessToken", token, {  //เก็บ token ไว้ใน cookie ชื่อcookieว่า accessToken
      httpOnly: true,  //ส่งcookieไปกับ http reqเท่านั้น
      secure: isProd,  //บังคับให้ใช้ https
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, //1 hour cookie
    });

    res.status(200).json({
      error: false,
      message: "Login successful!",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        tel: user.tel,
        roomNumber: user.roomNumber
      },
    });
  } catch (err) {
    next(err);
  }
});

//verify user
// Verify token
router.get("/verify", async (req, res, next) => {
  // const token = req.headers.authorization.split(" ")[1]; //ไปหา token ใน header หน้าตา Authorization: Bearer <JWT_TOKEN>
  const bearer = req.headers.authorization?.split(" ")[1];
  const token = req.cookies?.accessToken || bearer;

  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Token is required!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await User.findById(decoded.userId).select("_id fullName email tel roomNumber");
    res.status(200).json({
      error: false,
      userId: decoded.userId,
      message: "Token is valid ✅",
      user: user,
    });
  } catch (err) {
    next(err);
  }
});

// Logout
// At User Browser
router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("accessToken", {
  httpOnly: true,
  secure: true,  // dev
  sameSite: "lax",
  path: "/",
});
  res.status(200).json({ message: "Logged out successfully 👋" });
});

router.put("/users/:id", async (req, res, next) =>{
  const userId = req.params.id; //ดึง id ของuser จาก urlมาเก็บใน userId
  console.log(userId);
  const { fullName, email, tel, roomNumber } = req.body; //ใช้ข้อมูลจาก frontend ที่พิมพ์ใหม่แล้วใส่ลงด้านล่าง

  try {
    const user = await User.findById(userId); //หาใน db ด้วย id มีตรงไหม
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found!" });
    }
    user.fullName = fullName;
    user.email = email;
    user.tel = tel;
    user.roomNumber = roomNumber;
    await user.save();
    console.log(user);
    res.status(200).json({ error: false, message: "User updated successfully!" });
  } catch (err) {
    next(err);
  }
})

export default router;