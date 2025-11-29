import dotenv from 'dotenv';
dotenv.config();

async function findModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("🔍 Checking available models for your API Key...");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    const data = await response.json();

    if (data.error) {
      console.error("❌ API ERROR:", data.error.message);
    } else if (data.models) {
      console.log("✅ SUCCESS! Found these models:");
      // Filter for 'generateContent' capable models
      const chatModels = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", ""));
      
      console.log(chatModels);
    } else {
      console.log("⚠️ No models found. You might need to enable the API in Google Console.");
    }
  } catch (error) {
    console.error("❌ NETWORK ERROR:", error.message);
  }
}

findModels();