import express from "express";
import { User } from "../../models/User.js";

const routerAdmin = express.Router();

// ดึงผู้ใช้
routerAdmin.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().select("_id fullName email tel roomNumber role createdOn");
    res.status(200).json({
      error: false,
      message: "Users fetched successfully!",
      users,
    });
  } catch (err) {
    next(err);
  }
});

// edit role
routerAdmin.put("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true, select: "_id fullName email tel roomNumber role createdOn" }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});


export default routerAdmin;
