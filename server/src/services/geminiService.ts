import { SchemaType } from '@google/generative-ai';
import { genAI } from '../config/gemini';
import { SYSTEM_PROMPT, ANALYSIS_PROMPT } from '../prompts/systemPrompt';
import { AIAnalysis, CustomerInput } from '../types';
import { searchHondaKnowledge, formatKnowledgeForAIPrompt, HondaKnowledgeItem } from './knowledgeService';

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
    estimatedCost: { type: SchemaType.STRING },
    estimatedRepairTime: { type: SchemaType.STRING },
  },
  required: ['category', 'urgency', 'confidence', 'summary', 'symptoms', 'possibleCauses', 'followUpQuestions', 'recommendation', 'requiresImmediateAttention', 'estimatedCost', 'estimatedRepairTime'],
};

function mapCategory(thaiCat: string): any {
  if (!thaiCat) return 'Other';
  if (thaiCat.includes('เบรก')) return 'Brake';
  if (thaiCat.includes('เกียร์')) return 'Transmission';
  if (thaiCat.includes('เครื่องยนต์') || thaiCat.includes('สตาร์ต')) return 'Engine';
  if (thaiCat.includes('แอร์') || thaiCat.includes('ปรับอากาศ')) return 'Air Conditioning';
  if (thaiCat.includes('ไฟฟ้า') || thaiCat.includes('แบต')) return 'Electrical';
  if (thaiCat.includes('ช่วงล่าง')) return 'Suspension';
  if (thaiCat.includes('พวงมาลัย')) return 'Steering';
  if (thaiCat.includes('ยาง') || thaiCat.includes('ล้อ')) return 'Tire';
  if (thaiCat.includes('เตือน')) return 'Warning Light';
  if (thaiCat.includes('ตัวถัง')) return 'Body';
  return 'Other';
}

function getFallbackAnalysis(input: CustomerInput, knowledgeMatches: HondaKnowledgeItem[]): AIAnalysis {
  if (knowledgeMatches.length > 0) {
    const top = knowledgeMatches[0];
    const category = mapCategory(top.หมวดปัญหา);
    const urgency = (top.ระดับความเร่งด่วน as any) || 'MEDIUM';
    const isHigh = urgency === 'HIGH';

    return {
      category,
      urgency,
      confidence: 0.95,
      summary: `[Honda Knowledge Base ${top.ID}] ${top['อาการ/สิ่งที่ลูกค้าแจ้ง']} (สำหรับรุ่น ${top.รุ่นรถ})`,
      symptoms: [input.problemDescription],
      possibleCauses: top.สาเหตุที่เป็นไปได้ทั้งหมด.split(/;|;/).map(s => s.trim()).filter(Boolean),
      followUpQuestions: top['สิ่งที่ควรตรวจสอบ/คำถามเพิ่มเติม'].split(/;|;/).map(s => s.trim()).filter(Boolean),
      recommendation: top.วิธีแก้ไขเบื้องต้น,
      requiresImmediateAttention: isHigh,
      estimatedCost: top['ช่วงราคาประเมินเบื้องต้น (บาท)'],
      estimatedRepairTime: isHigh ? '2 - 3 ชั่วโมง' : '1 - 2 ชั่วโมง',
    };
  }

  const desc = (input.problemDescription || '').toLowerCase();
  let category: any = 'Other';
  let urgency: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  let requiresImmediateAttention = false;

  if (desc.includes('เบรก') || desc.includes('brake')) {
    category = 'Brake';
    urgency = 'HIGH';
    requiresImmediateAttention = true;
  } else if (desc.includes('แอร์') || desc.includes('ความเย็น') || desc.includes('ac')) {
    category = 'Air Conditioning';
    urgency = 'LOW';
  } else if (desc.includes('สตาร์ท') || desc.includes('แบต') || desc.includes('start') || desc.includes('battery')) {
    category = 'Electrical';
    urgency = 'MEDIUM';
  } else if (desc.includes('ไฟเตือน') || desc.includes('check engine')) {
    category = 'Warning Light';
    urgency = 'MEDIUM';
  } else if (desc.includes('สั่น') || desc.includes('เครื่องยนต์') || desc.includes('engine')) {
    category = 'Engine';
    urgency = 'MEDIUM';
  } else if (desc.includes('เกียร์') || desc.includes('transmission')) {
    category = 'Transmission';
    urgency = 'HIGH';
    requiresImmediateAttention = true;
  }

  return {
    category,
    urgency,
    confidence: 0.88,
    summary: `ประเมินเบื้องต้น: ${input.problemDescription}`,
    symptoms: [input.problemDescription],
    possibleCauses: [`อุปกรณ์ในระบบ ${category} อาจชำรุดหรือเสื่อมสภาพ`],
    followUpQuestions: ['อาการเกิดขึ้นถี่แค่ไหน?', 'มีเสียงหรือไฟเตือนขึ้นร่วมด้วยหรือไม่?'],
    recommendation: urgency === 'HIGH'
      ? 'คำเตือน: เป็นปัญหาด้านความปลอดภัย กรุณานำรถเข้าตรวจเช็กที่ศูนย์บริการโดยด่วน'
      : 'แนะนำให้นำรถเข้าตรวจเช็กตามรอบบริการที่ศูนย์บริการ',
    requiresImmediateAttention,
    estimatedCost: urgency === 'HIGH' ? '฿2,500 - ฿5,000' : '฿1,000 - ฿2,500',
    estimatedRepairTime: '1.5 - 2 ชั่วโมง',
  };
}

/** Analyze a vehicle problem using Gemini AI with Honda Knowledge Base RAG */
export async function analyzeVehicleProblem(input: CustomerInput): Promise<AIAnalysis> {
  // Step 1: Search Honda Knowledge Base FIRST before invoking AI
  const knowledgeMatches = searchHondaKnowledge({
    search: input.problemDescription,
    model: input.vehicleModel,
    limit: 3,
  });

  const knowledgeContext = formatKnowledgeForAIPrompt(knowledgeMatches);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any,
        temperature: 0.2,
      },
      systemInstruction: SYSTEM_PROMPT + (knowledgeContext ? `\n\n` + knowledgeContext : ''),
    });

    const basePrompt = ANALYSIS_PROMPT(input);
    const fullPrompt = knowledgeContext 
      ? `${basePrompt}\n\n[ข้อบังคับสำคัญ: คุณต้องอ้างอิงสาเหตุ คำถามเพิ่มเติม และช่วงราคาจาก Honda Search Knowledge Base ที่ให้ไว้ใน System Instruction เป็นหลัก!]` 
      : basePrompt;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    
    const analysis: AIAnalysis = JSON.parse(text);
    
    if (!analysis.category || !analysis.urgency || analysis.confidence === undefined) {
      throw new Error('AI response missing required fields');
    }
    
    analysis.confidence = Math.max(0, Math.min(1, analysis.confidence));
    return analysis;
  } catch (error) {
    console.error('Gemini API Error, using Honda Search Knowledge fallback:', error);
    return getFallbackAnalysis(input, knowledgeMatches);
  }
}
