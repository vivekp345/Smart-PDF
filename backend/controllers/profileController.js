import User from '../models/User.js';
import Summary from '../models/Summary.js';
import asyncHandler from 'express-async-handler';

// @desc    Get user profile & stats
// @route   GET /api/v1/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  // 1. Get User Details
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 2. Get Usage Stats (Count total summaries)
  const totalSummaries = await Summary.countDocuments({ user: req.user._id });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    stats: {
      totalSummaries,
      plan: 'Free Tier', // You can add logic for paid plans later
    }
  });
});