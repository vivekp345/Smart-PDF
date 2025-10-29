import express from 'express';
const router = express.Router();

// We will import the controller functions as we create them
// import { signupUser, loginUser, logoutUser } from '../controllers/authController.js';

// @route   POST /api/v1/auth/signup
// @desc    Register a new user
// @access  Public
// router.post('/signup', signupUser);

// @route   POST /api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
// router.post('/login', loginUser);

// @route   POST /api/v1/auth/logout
// @desc    Logout user & clear cookie
// @access  Private
// router.post('/logout', logoutUser);

export default router;