import express from 'express';
import { chatWithAi } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, chatWithAi);

export default router;