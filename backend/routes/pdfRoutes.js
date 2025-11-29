import express from 'express';
import multer from 'multer';
import { summarizePdf } from '../controllers/pdfController.js';
import { protect } from '../middlewares/authMiddleware.js'; // We need to create this!

const router = express.Router();

// --- Multer Config ---
const upload = multer({ 
  dest: 'uploads/', // Files will be temporarily stored here
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit: 10MB
});

// --- Routes ---
// POST /api/v1/pdf/summarize
// protect middleware ensures we know WHO the user is
// upload.single('pdf') looks for a form-data field named 'pdf'
router.post('/summarize', protect, upload.single('pdf'), summarizePdf);

export default router;