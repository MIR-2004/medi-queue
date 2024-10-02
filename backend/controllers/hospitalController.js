import { Hospital } from "../models/hospitalModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

// hospital register controller
const hospitalRegisterController = asyncHandler(async (req, res) => {
    try {
        const { name, description, email, password, city, district, state, zipCode, phoneNumber } = req.body;
        if ([name, description, email, password, city, district, state, zipCode, phoneNumber].some((fields) => fields?.trim() === "")) {
            res.send("Please fill all the fields")
        }

        let profileImagePath = '';
        if (req.file) {
            profileImagePath = req.file.filename;
        } else {
            return res.status(400).json({
                message: 'Profile image is required.'
            });
        }

        const existingHospital = await Hospital.findOne({
            $or: [
                { name: name },
                { email: email }
            ]
        });
        if (existingHospital) {
            return res.status(400).json({
                message: 'A hospital with this name or email already exists.'
            });
        }

        const newHospital = await Hospital.create({
            name,
            description,
            profileImage: profileImagePath,
            email,
            password,
            location: {
                city,
                district,
                state,
                zipCode
            },
            phoneNumber
        });
        if (!newHospital) {
            return res.status(400).json({
                message: 'Invalid hospital data.'
            });
        }

        const token = newHospital.token();
        if (!token) {
            return res.status(400).json({
                message: 'Error in generating token.'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Hospital registered successfully',
            hospital: newHospital,
            token: token
        });

    } catch (error) {
        console.error("Error in hsopital regirstation: ", error);
        res.status(500).json({
            success: false,
            message: `Error in hospital registration ${error.message}`
        });
    }
})

// hospital login controller
const hospitalLoginController = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if ([email, password].some((fields) => fields?.trim() === "")) {
            res.send("Please fill all the fields")
        }

        const hospital = await Hospital.findOne({ email }).select("+password");
        if (!hospital) {
            res.send("Hospital not found!")
        }

        const isPasswordCorrect = await hospital.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = hospital.token();
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Error in generating token'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Hospital logged in successfully',
            data: hospital,
            token: token
        })

    } catch (error) {
        console.error("Error in hsopital Login: ", error);
        res.status(500).json({
            success: false,
            message: `Error in hospital Login ${error.message}`
        });
    }
})

// hospital update profile controller
const hospitalUpdateController = asyncHandler(async (req, res) => {
    try {
        const { name, description, password, city, district, state, zipCode, phoneNumber, profileImage } = req.body;

        console.log(req.file)

        const updateSchema = {
            ...(name && { name }),
            ...(description && { description }),
            ...(password && { password: await bcrypt.hash(password, 10) }),
            ...(city && { city }),
            ...(district && { district }),
            ...(state && { state }),
            ...(zipCode && { zipCode }),
            ...(phoneNumber && { phoneNumber }),
            ...(req.file && { profileImage: req.file.filename })
        }

        const hospital = await Hospital.findByIdAndUpdate(req.hospital._id, updateSchema, { new: true }).select('-password');
        if (!hospital) {
            return res.status(400).json({
                success: false,
                message: 'Invalid hospital data'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Hospital updated successfully',
            data: hospital
        });
    } catch (error) {
        console.error("Error in hospital update: ", error);
        res.status(500).json({
            success: false,
            message: `Error in hospital update ${error.message}`
        });
    }
})

export { hospitalRegisterController, hospitalLoginController, hospitalUpdateController }