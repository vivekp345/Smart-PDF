import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Chat with AI
// @route   POST /api/v1/chat
// @access  Private
export const chatWithAi = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the conversation
    // We start a chat session so Gemini remembers context
    const chat = model.startChat({
      history: history || [], // Pass previous messages if any
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500);
    throw new Error('AI failed to respond');
  }
});