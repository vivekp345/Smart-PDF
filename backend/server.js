import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// --- Initial Config ---
dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// --- Core Middlewares ---
app.use(express.json()); // Allow app to accept JSON data
app.use(express.urlencoded({ extended: true })); // Allow app to accept form data
app.use(cookieParser()); // Allow app to parse cookies

// --- API Routes ---
// All auth routes will be prefixed with /api/v1/auth
app.use('/api/v1/auth', authRoutes);

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Error Handling (Optional but recommended) ---
// 404 Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// General Error Handler
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// --- Start Server ---
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);