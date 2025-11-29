import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';

// @desc    Register a new user (Sign Up)
// @route   POST /api/v1/auth/signup
// @access  Public
const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists');
  }

  // 2. Create new user
  const user = await User.create({
    name,
    email,
    password,
    // The password will be automatically hashed by the 'pre-save' middleware in User.js
  });

  // 3. If user created successfully, generate token and send response
  if (user) {
    generateToken(res, user._id); // This sets the httpOnly cookie

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND if password matches
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id); // This sets the httpOnly cookie

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/v1/auth/logout
// @access  Public (or Private, depending on setup)
const logoutUser = asyncHandler(async (req, res) => {
  // To log out, we just clear the cookie
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Set expiration date to the past
  });

  res.status(200).json({ message: 'User logged out successfully' });
});

export { signupUser, loginUser, logoutUser };