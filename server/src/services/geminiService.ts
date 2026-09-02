import { SchemaType } from '@google/generative-ai';
import { genAI } from '../config/gemini';
import { SYSTEM_PROMPT, ANALYSIS_PROMPT } from '../prompts/systemPrompt';
import { AIAnalysis, CustomerInput } from '../types';

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    category: {
      type: SchemaType.STRING,
      enum: ['Engine', 'Transmission', 'Brake', 'Suspension', 'Electrical', 'Air Conditioning', 'Steering', 'Tire', 'Warning Light', 'Body', 'Other'],
    },
    urgency: {
      type: SchemaType.STRING,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
    },
    confidence: { type: SchemaType.NUMBER },
    summary: { type: SchemaType.STRING },
    symptoms: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    possibleCauses: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    followUpQuestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    recommendation: { type: SchemaType.STRING },
    requiresImmediateAttention: { type: SchemaType.BOOLEAN },
  },
  required: ['category', 'urgency', 'confidence', 'summary', 'symptoms', 'possibleCauses', 'followUpQuestions', 'recommendation', 'requiresImmediateAttention'],
};

/** Analyze a vehicle problem using Gemini AI */
export async function analyzeVehicleProblem(input: CustomerInput): Promise<AIAnalysis> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema as any,
      temperature: 0.3,
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const prompt = ANALYSIS_PROMPT(input);
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const analysis: AIAnalysis = JSON.parse(text);
  
  // Validate required fields
  if (!analysis.category || !analysis.urgency || analysis.confidence === undefined) {
    throw new Error('AI response missing required fields');
  }
  
  // Ensure confidence is between 0 and 1
  analysis.confidence = Math.max(0, Math.min(1, analysis.confidence));
  
  return analysis;
}
