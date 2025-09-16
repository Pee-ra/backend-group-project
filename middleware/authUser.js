// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authUser = (requireRole = null) => {
  return async (req, res, next) => {
    try {
      const bearer = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

      const token =
        req.cookies?.accessToken ||   // ชื่อคุกกี้มาตรฐานที่เราจะใช้
        req.cookies?.jwt ||           // เผื่อที่อื่นยังตั้งชื่อ jwt
        bearer;

      if (!token) {
        return res.status(401).json({ error: true, message: "Token is required!" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id; // รองรับทั้งสองคีย์
      if (!userId) {
        return res.status(401).json({ error: true, message: "Invalid token payload" });
      }

      const user = await User.findById(userId).select("_id fullName email role");
      if (!user) {
        return res.status(401).json({ error: true, message: "User not found" });
      }

      req.user = { _id: user._id, fullName: user.fullName, email: user.email, role: user.role };

      if (requireRole) {
        const ok = Array.isArray(requireRole)
          ? requireRole.includes(req.user.role)
          : req.user.role === requireRole;
        if (!ok) return res.status(403).json({ error: true, message: "You don't have permission to access this resource!" });
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
