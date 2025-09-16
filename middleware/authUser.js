// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authUser = (requireRole = null) => {
  return async (req, res, next) => {
    try {
      // 1) ดึง token จาก header/cookie แบบกันพลาด
      const authHeader = req.headers.authorization || "";
      const bearer = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      const token =
        (typeof req.cookies?.accessToken === "string" && req.cookies.accessToken) ||
        (typeof req.cookies?.jwt === "string" && req.cookies.jwt) ||
        (typeof bearer === "string" && bearer) ||
        null;

      if (!token) {
        return res.status(401).json({ error: true, message: "Token is required!" });
      }

      // 2) verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // รองรับ payload ที่ใช้ userId หรือ id
      const userId = decoded?.userId || decoded?.id;
      if (!userId) {
        return res.status(401).json({ error: true, message: "Invalid token payload" });
      }

      // 3) โหลด user จาก DB (ดึง field เท่าที่จำเป็น)
      const user = await User.findById(userId).select("_id fullName email role");
      if (!user) {
        return res.status(401).json({ error: true, message: "User not found" });
      }

      // 4) Normalize _id เป็น string เพื่อเทียบกับ req.params.id ได้ตรง ๆ
      req.user = {
        _id: String(user._id),         // ✅ แปลงเป็น string
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };

      // (ทางเลือก) แนบ decoded เผื่อใช้งาน/ดีบัก
      req.auth = { token, decoded };

      // 5) ตรวจสิทธิ์ตาม requireRole (ถ้าใส่มา)
      if (requireRole) {
        const roles = Array.isArray(requireRole) ? requireRole : [requireRole];

        // ถ้าต้องการให้ admin ผ่านทุก role ให้คอมเมนต์บรรทัดถัดไปออก
        const ok = roles.includes(req.user.role);
        // หรือถ้าจะให้ admin ผ่านหมด ใช้:
        // const ok = req.user.role === "admin" || roles.includes(req.user.role);

        if (!ok) {
          return res.status(403).json({
            error: true,
            message: "You don't have permission to access this resource!",
          });
        }
      }

      next();
    } catch (err) {
      const isExpired = err?.name === "TokenExpiredError";
      return res.status(401).json({
        error: true,
        code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
        message: isExpired ? "Token is expired!, please login again" : "Invalid token!",
      });
    }
  };
};
