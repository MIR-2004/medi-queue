import { Hospital } from "../models/hospitalModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// hospital register controller
const registerHospitalController = asyncHandler(async (req, res) => {
    try {
        const { name, description, email, password, city, district, state, zipCode, phoneNumber } = req.body;

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

        const newHospital = new Hospital({
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

        res.status(201).json({
            message: 'Hospital registered successfully',
            hospital: newHospital
        });

    } catch (error) {
        console.error("Error in hsopital regirstation: ", error);
        res.status(500).json({
            success: false,
            message: `Error in hospital registration ${error.message}`
        });
    }
})

export { registerHospitalController }