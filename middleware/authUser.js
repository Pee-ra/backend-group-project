import jwt from "jsonwebtoken";


export const authUser = async (req , res, next) => { 
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            error: true,
            message: "Token is required!",
        });
    }
    
    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {_id: decoded_token.userId};

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


