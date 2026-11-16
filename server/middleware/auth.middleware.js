import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Get token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please log in."
            });
        }

        // 2. Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find user from token ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please log in again."
            });
        }

        if (!user.isActive || !user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Account is not authorized."
            });
        }

        // 4. Attach user to request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};