import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized Request'
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        const user = await User.findById(decodedToken?.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Access Token'
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in Auth Middleware: ", error);
        res.status(401).json({
            success: false,
            message: 'Invalid Access Token'
        })
    }
}
