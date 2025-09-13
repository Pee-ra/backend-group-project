import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


export const authUser = (requireRole = null) => {
    return async (req , res, next) => { 
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            error: true,
            message: "Token is required!",
        });
    }
    
    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded_token.userId).select("_id email role");
        if (!user) {
        return res.status(401).json({ error: true, message: "User not found" });
        }

        req.user = {_id: decoded_token.userId, role: decoded_token.role}; 

        if (requireRole && req.user.role !== requireRole) {
            return res.status(403).json({
                error: true,
                message: "You don't have permission to access this resource!",
            });
        }

        next(); //ส่งไป middleware ต่อ 
    } catch (err) {
        const isExpired = err.name === "TokenExpiredError";

        res.status(401).json({
            error: true,
            code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
            message: isExpired ? "Token is expired!, please login again" : "Invalid token!",
        });
    }
 }
}

