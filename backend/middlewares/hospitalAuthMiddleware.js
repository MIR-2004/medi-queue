import jwt from "jsonwebtoken"
import { Hospital } from "../models/hospitalModel.js";

// user auth middleware
const hospitalAuthMiddleware = async (req, res, next) => {
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

        const hospital = await Hospital.findById(decodedToken?.id);
        if (!hospital) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Access Token'
            })
        }

        req.hospital = hospital;
        next();
    } catch (error) {
        console.error("Error in Auth Middleware: ", error);
        res.status(401).json({
            success: false,
            message: 'Invalid Access Token'
        })
    }
}

export { hospitalAuthMiddleware }