import express from 'express';
import { getHistory, deleteSummary } from '../controllers/historyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.get('/', protect, getHistory);
router.delete('/:id', protect, deleteSummary);

export default router;