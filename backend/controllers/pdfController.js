import fs from 'fs';
import Summary from '../models/Summary.js';
import { generateSummary } from '../utils/openaiHelper.js';
import asyncHandler from 'express-async-handler';
import PDFParser from 'pdf2json';
import logger from '../utils/logger.js';

/**
 * Helper to wrap pdf2json in a Promise for async/await usage
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
const parsePdfBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1); // 1 = text content only

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      // pdf2json returns raw text content, usually encoded
      const rawText = pdfParser.getRawTextContent();
      resolve(rawText);
    });

    pdfParser.parseBuffer(buffer);
  });
};

/**
 * @desc    Upload PDF and Generate Summary
 * @route   POST /api/v1/pdf/summarize
 * @access  Private
 */
export const summarizePdf = asyncHandler(async (req, res) => {
  // 1. Validation
  if (!req.file) {
    res.status(400);
    throw new Error('No PDF file uploaded');
  }

  const { language } = req.body;
  const filePath = req.file.path;

  logger.info(`Processing PDF upload: ${req.file.originalname} for user ${req.user._id}`);

  try {
    // 2. Read File from Disk
    const dataBuffer = fs.readFileSync(filePath);

    // 3. Parse PDF
    const extractedText = await parsePdfBuffer(dataBuffer);

    // 4. Validate Extraction
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('PDF contained no text. It might be a scanned image or empty.');
    }

    // 5. AI Summary Generation
    const aiSummary = await generateSummary(extractedText, language || 'English');

    // 6. Save to Database
    const newSummary = await Summary.create({
      user: req.user._id,
      fileName: req.file.originalname,
      originalText: extractedText,
      summaryText: aiSummary,
      language: language || 'English',
    });

    // 7. Cleanup: Delete uploaded file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // 8. Respond
    res.status(201).json(newSummary);

  } catch (error) {
    // Always cleanup file on error to prevent storage leaks
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    logger.error(`PDF Processing Failed: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to process PDF' });
  }
});