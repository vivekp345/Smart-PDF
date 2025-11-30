import express from 'express';
import multer from 'multer';
import { summarizePdf } from '../controllers/pdfController.js';
import { protect } from '../middlewares/authMiddleware.js'; // We need to create this!
import { validate } from '../middlewares/validationMiddleware.js'; // <-- Impo

const router = express.Router();



const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });


router.post('/summarize', protect, upload.single('pdf'), validate('pdf'), summarizePdf);

export default router;