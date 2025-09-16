import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/errorHandler.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token, not authorized" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user)  {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
