import express from 'express';
import { chatWithAi } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit'; // Import

const router = express.Router();


const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: 'Chat limit exceeded. Please wait a moment.'
});

// Apply chatLimiter specifically here
router.post('/', protect, chatLimiter, chatWithAi);

export default router;