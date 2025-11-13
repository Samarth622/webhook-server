import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

console.log("🔑 Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function reviewCodeWithGemini(filePath) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const code = readFileSync(filePath, "utf-8");

  const prompt = `You are an expert software reviewer. Review this JavaScript file and provide:
- Possible bugs
- Code smells
- Suggestions for improvement
Be specific and concise. Here is the code:\n\n${code}`;

  try {
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = await response.text();

    console.log(`✅ Gemini responded for ${path.basename(filePath)}`);
    return text;
  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    return "❌ Gemini review failed.";
  }
}
