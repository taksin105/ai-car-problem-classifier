import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './environment';

if (!config.geminiApiKey) {
  console.warn('GEMINI_API_KEY not configured. AI analysis will not work.');
}

export const genAI = new GoogleGenerativeAI(config.geminiApiKey);
