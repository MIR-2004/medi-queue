import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import z from 'zod';

// User register controller
const registerController = asyncHandler(async (req, res) => {
    try {
        const registerSchema = z.object({
            name: z.string().min(1, 'Name is required'),
            email: z.string().email('Invalid email address'),
            password: z.string().min(6, 'Password must be at least 6 characters long')
        })

        const { name, email, password } = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists!! Please login'
            })
        }

        const newUser = await User.create({ name, email, password })
        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user data'
            })
        }

        const user = await User.findById(newUser._id).select('-password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user data'
            });
        }

        const token = newUser.token();
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Error in generating token'
            });
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user,
            token: token
        })
    } catch (error) {

        console.error("Error in user registration: ", error);
        res.status(500).json({
            success: false,
            message: `Error in user registeration ${error.message}`
        });
    }
})

// User login controller
const loginController = asyncHandler(async (req, res) => {
    try {
        const loginSchema = z.object({
            email: z.string().email('Invalid email address'),
            password: z.string().min(6, 'Password must be at least 6 characters long')
        });

        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = user.token();
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Error in generating token'
            })
        }

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: user,
            token: token
        })
    } catch (error) {

        console.error("Error in user login: ", error);
        res.status(500).json({
            success: false,
            message: `Error in user login ${error.message}`
        });
    }
})

// User update profile controller
const updateUserController = asyncHandler(async (req, res) => {
    try {
        const updateBody = z.object({
            name: z.string().min(3).max(30).optional(),
            password: z.string().min(6).max(30).optional(),
        })

        const { name, password } = updateBody.parse(req.body);

        const updatedData = {
            ...(name && { name }),
            ...(password && { password })
        }

        const user = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true }).select('-password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        })
    } catch (error) {

        console.error("Error in user details update: ", error);
        res.status(500).json({
            success: false,
            message: `Error in user details update ${error.message}`
        });
    }
})

export { registerController, loginController, updateUserController }