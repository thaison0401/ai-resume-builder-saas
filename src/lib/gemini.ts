import { GoogleGenerativeAI } from "@google/generative-ai";

// Khởi tạo Gemini với API Key từ file .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export default genAI;
