import z from 'zod';
import express from 'express';
import { upload } from '../middlewares/multerMiddleware.js';
import { hospitalRegisterController, hospitalLoginController, hospitalUpdateController } from '../controllers/hospitalController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { hospitalAuthMiddleware } from '../middlewares/hospitalAuthMiddleware.js';


// Zod schema for hospital validation
const hospitalSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
    profileImage: z.string().url("Invalid URL format for profile image").optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters").optional(),
    location: z.object({
        city: z.string().min(1, "City is required").optional(),
        district: z.string().min(1, "District is required").optional(),
        state: z.string().min(1, "State is required").optional(),
        zipCode: z.string().min(1, "ZipCode is required").max(10, "ZipCode must be less than 10 characters").optional(),
    }).optional(),
    phoneNumber: z.array(
        z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits")
    ).min(1, "At least one phone number is required").optional(),
    doctorsId: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid doctor ID format")).optional(),
    bedsId: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid bed ID format")).optional(),
});

// router
const router = express.Router();

// routes
router.post('/register', validateSchema(hospitalSchema), upload.single('profileImage'), hospitalRegisterController);
router.post('/login', validateSchema(hospitalSchema), hospitalLoginController);
router.patch('/update-account', upload.single('profileImage'), validateSchema(hospitalSchema), hospitalAuthMiddleware, hospitalUpdateController);

export default router;