/* eslint-disable @typescript-eslint/no-require-imports */
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function checkModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelId = "models/gemini-2.0-flash";
  console.log(`Checking model: ${modelId}`);
  try {
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent("Create a simple red square image");
    console.log("Response:", JSON.stringify(result.response, null, 2));
  } catch (err) {
    console.log("Error Status:", err.status);
    console.log("Error Message:", err.message);
    console.log("Full Error:", JSON.stringify(err, null, 2));
  }
}

checkModel();
