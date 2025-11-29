import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (text, language) => {
  try {
    // We use the specific 1.5-flash model which is free and fast
   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a helpful AI assistant. 
      Please summarize the following text in ${language}. 
      Keep it concise, professional, and capture the key points using bullet points.
      
      Text to summarize:
      "${text.substring(0, 30000)}" 
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Throwing error allows the controller to catch it and log it
    throw new Error('Failed to generate summary from AI');
  }
};