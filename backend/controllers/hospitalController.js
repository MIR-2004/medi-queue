import { Hospital } from "../models/hospitalModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import z from "zod";

// hospital register controller
const registerHospitalController = asyncHandler(async (req, res) => {
    try {
        const hospitalSchema = z.object({
            name: z.string().nonempty(),
            description: z.string().nonempty(),
            profileImage: z.string().nonempty(),
            location: z.object({
                city: z.string().nonempty(),
                district: z.string().nonempty(),
                state: z.string().nonempty(),
                zipCode: z.string().nonempty(),
            }),
            phoneNumber: z.array(z.string()).nonempty(),
            email: z.string().email(),
            doctorsId: z.array(z.string()).optional(),
            bedsId: z.array(z.string()).optional()
        });

        const parsedData = hospitalSchema.parse(req.body);

        if (!req.file) {
            return res.status(400).json({
                message: 'Profile image is required.'
            });
        }
        parsedData.profileImage = req.file;

        const existingHospital = await Hospital.findOne({
            $or: [
                { name: parsedData.name },
                { email: parsedData.email }
            ]
        });
        if (existingHospital) {
            return res.status(400).json({
                message: 'A hospital with this name or email already exists.'
            });
        }

        const newHospital = await Hospital.create(parsedData);
        if (!newHospital) {
            return res.status(400).json({
                message: 'Invalid hospital data.'
            });
        }

        res.status(201).json({
            message: 'Hospital registered successfully',
            hospital: newHospital
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }

        console.error("Error in hsopital regirstation: ", error);
        res.status(500).json({
            success: false,
            message: `Error in hospital regirstation ${error.message}`
        });
    }
})

export { registerHospitalController }