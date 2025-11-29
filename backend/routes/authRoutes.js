import express from 'express';
const router = express.Router();

// Import your new controller functions
import {
  signupUser,
  loginUser,
  logoutUser,
} from '../controllers/authController.js';

// @route   POST /api/v1/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupUser); // <-- Uncommented and linked

// @route   POST /api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser); // <-- Uncommented and linked

// @route   POST /api/v1/auth/logout
// @desc    Logout user & clear cookie
// @access  Public
router.post('/logout', logoutUser); // <-- Uncommented and linked

export default router;