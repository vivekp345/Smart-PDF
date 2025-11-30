import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import { validateEnv } from './config/validateEnv.js';
import { cleanUploadsFolder } from './utils/cleanup.js';
import logger from './utils/logger.js';

import authRoutes from './routes/authRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
validateEnv();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Run cleanup on startup
cleanUploadsFolder();

// --- 1. Logging (Dev only) ---
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- 2. CORS ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 3. Parsers ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- 4. Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pdf', pdfRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/chat', chatRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- 5. Error Handling ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  // Log the error using your professional logger
  logger.error(err.message);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});