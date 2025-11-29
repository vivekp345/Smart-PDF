import fs from 'fs';
import Summary from '../models/Summary.js';
import { generateSummary } from '../utils/openaiHelper.js';
import asyncHandler from 'express-async-handler';
import PDFParser from 'pdf2json'; // Standard import works better here

// Helper: Wrap pdf2json in a Promise to use with await
const parsePdfBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1); // 1 = text content only

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      // pdf2json returns raw text, we need to join it
      const rawText = pdfParser.getRawTextContent();
      resolve(rawText);
    });

    pdfParser.parseBuffer(buffer);
  });
};

// @desc    Upload PDF and Generate Summary
// @route   POST /api/v1/pdf/summarize
// @access  Private
export const summarizePdf = asyncHandler(async (req, res) => {
  console.log("👉 1. Request received (using pdf2json)");

  if (!req.file) {
    res.status(400);
    throw new Error('No PDF file uploaded');
  }

  const { language } = req.body;
  const filePath = req.file.path;

  try {
    // 2. Read File
    const dataBuffer = fs.readFileSync(filePath);

    // 3. Parse PDF using our new Helper
    console.log("👉 3. Parsing PDF...");
    const extractedText = await parsePdfBuffer(dataBuffer);
    
    console.log("✅ PDF Parsed! Length:", extractedText.length);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('PDF contained no text. It might be a scanned image.');
    }

    // 4. AI Summary
    console.log("👉 4. Sending to OpenAI...");
    const aiSummary = await generateSummary(extractedText, language || 'English');

    // 5. Save to DB
    const newSummary = await Summary.create({
      user: req.user._id,
      fileName: req.file.originalname,
      originalText: extractedText,
      summaryText: aiSummary,
      language: language || 'English',
    });

    // 6. Cleanup
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json(newSummary);

  } catch (error) {
    console.error("🔥 CONTROLLER ERROR:", error.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: error.message });
  }
});