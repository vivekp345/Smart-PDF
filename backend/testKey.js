import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log("🔑 Testing API Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    console.log("🤖 Sending test request to Google...");
    const result = await model.generateContent("Say hello");
    console.log("✅ SUCCESS! Response:", result.response.text());
  } catch (error) {
    console.error("❌ FAILED:", error.message);
  }
}

test();