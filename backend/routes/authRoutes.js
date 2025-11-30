import express from 'express';
import { validate } from '../middlewares/validationMiddleware.js'; // <-- Import
import { signupUser, loginUser, logoutUser, googleLogin } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', validate('signup'), signupUser);
router.post('/login', validate('login'), loginUser);
router.post('/logout', logoutUser); // <-- Uncommented and linked
router.post('/google', googleLogin); // <--- Add this route

export default router;