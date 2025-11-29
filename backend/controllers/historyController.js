import Summary from '../models/Summary.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all summaries for the logged-in user
// @route   GET /api/v1/history
// @access  Private
export const getHistory = asyncHandler(async (req, res) => {
  const summaries = await Summary.find({ user: req.user._id })
    .sort({ createdAt: -1 }); // Newest first

  res.status(200).json(summaries);
});

// @desc    Delete a summary
// @route   DELETE /api/v1/history/:id
// @access  Private
export const deleteSummary = asyncHandler(async (req, res) => {
  const summary = await Summary.findById(req.params.id);

  if (!summary) {
    res.status(404);
    throw new Error('Summary not found');
  }

  // Ensure user owns this summary before deleting
  if (summary.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await summary.deleteOne();
  res.status(200).json({ id: req.params.id });
});