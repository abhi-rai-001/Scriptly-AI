import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Using the recommended models
export const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
export const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
