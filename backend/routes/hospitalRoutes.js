import express from 'express';
// import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';
import { registerHospitalController } from '../controllers/hospitalController.js';

// router
const router = express.Router();

// routes
router.post('/register', upload.single('profileImage'), registerHospitalController);

export default router;