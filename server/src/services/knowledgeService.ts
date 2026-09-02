import hondaData from '../data/honda_knowledge.json';

export interface HondaKnowledgeItem {
  ID: string;
  ยี่ห้อ: string;
  รุ่นรถ: string;
  หมวดปัญหา: string;
  'อาการ/สิ่งที่ลูกค้าแจ้ง': string;
  สาเหตุที่เป็นไปได้ทั้งหมด: string;
  'สิ่งที่ควรตรวจสอบ/คำถามเพิ่มเติม': string;
  วิธีแก้ไขเบื้องต้น: string;
  'ช่วงราคาประเมินเบื้องต้น (บาท)': string;
  ระดับความเร่งด่วน: string;
  'คำค้น/Keyword สำหรับ AI': string;
  หมายเหตุ: string;
}

export interface KnowledgeQuery {
  search?: string;
  model?: string;
  category?: string;
  urgency?: string;
  limit?: number;
}

/** Search knowledge items with scoring algorithm */
export function searchHondaKnowledge(params: KnowledgeQuery): HondaKnowledgeItem[] {
  let items = hondaData.knowledge as HondaKnowledgeItem[];

  if (params.model && params.model !== 'All') {
    const modelLower = params.model.toLowerCase();
    items = items.filter(item => 
      item.รุ่นรถ.toLowerCase().includes(modelLower) || 
      item.รุ่นรถ === 'ทุกรุ่น' ||
      modelLower.includes(item.รุ่นรถ.toLowerCase())
    );
  }

  if (params.category && params.category !== 'All') {
    const catLower = params.category.toLowerCase();
    items = items.filter(item => item.หมวดปัญหา.toLowerCase().includes(catLower));
  }

  if (params.urgency && params.urgency !== 'All') {
    items = items.filter(item => item.ระดับความเร่งด่วน.toUpperCase() === params.urgency?.toUpperCase());
  }

  if (!params.search || !params.search.trim()) {
    const limit = params.limit || 50;
    return items.slice(0, limit);
  }

  const keywords = params.search.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = items.map(item => {
    let score = 0;
    const fullText = [
      item['อาการ/สิ่งที่ลูกค้าแจ้ง'],
      item['สาเหตุที่เป็นไปได้ทั้งหมด'],
      item['คำค้น/Keyword สำหรับ AI'],
      item.รุ่นรถ,
      item.หมวดปัญหา,
      item.วิธีแก้ไขเบื้องต้น,
    ].join(' ').toLowerCase();

    for (const kw of keywords) {
      if (fullText.includes(kw)) {
        score += 2;
      }
      if (item['คำค้น/Keyword สำหรับ AI'].toLowerCase().includes(kw)) {
        score += 5;
      }
      if (item['อาการ/สิ่งที่ลูกค้าแจ้ง'].toLowerCase().includes(kw)) {
        score += 4;
      }
      if (item.รุ่นรถ.toLowerCase().includes(kw)) {
        score += 3;
      }
    }
    return { item, score };
  });

  const limit = params.limit || 50;
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.item)
    .slice(0, limit);
}

/** Format top matching knowledge items into AI Prompt Context */
export function formatKnowledgeForAIPrompt(matches: HondaKnowledgeItem[]): string {
  if (matches.length === 0) return '';

  return `
===================================================================
[HONDA SEARCH KNOWLEDGE BASE - PRIORITY REFERENCE DATA]
ไฟล์อ้างอิงหลัก: Honda_Search_Knowledge_AI_Car_Problem
หมายเหตุ: คุณต้องนำข้อมูลความรู้ Honda ด้านล่างนี้มาเป็นฐานข้อมูลคำตอบอันดับแรกเสมอ!
===================================================================
` + matches.map((m, i) => `
[Match #${i+1}] ID: ${m.ID} | รุ่นรถ: ${m.รุ่นรถ} | หมวดปัญหา: ${m.หมวดปัญหา}
- อาการที่แจ้ง: ${m['อาการ/สิ่งที่ลูกค้าแจ้ง']}
- สาเหตุที่เป็นไปได้ทั้งหมด: ${m.สาเหตุที่เป็นไปได้ทั้งหมด}
- สิ่งที่ควรตรวจสอบ/คำถามเพิ่มเติม: ${m['สิ่งที่ควรตรวจสอบ/คำถามเพิ่มเติม']}
- วิธีแก้ไขเบื้องต้น: ${m.วิธีแก้ไขเบื้องต้น}
- ช่วงราคาประเมินเบื้องต้น: ${m['ช่วงราคาประเมินเบื้องต้น (บาท)']} บาท
- ระดับความเร่งด่วน: ${m.ระดับความเร่งด่วน}
`).join('\n') + `
===================================================================
คำสั่งบังคับสำหรับ AI: 
โปรดใช้ข้อมูลจาก Honda Search Knowledge ข้างต้นเป็นหลักในการสร้าง JSON response 
หากข้อมูลอาการตรงกับคลังความรู้นี้ ให้ดึง "สาเหตุที่เป็นไปได้", "คำถามเพิ่มเติม", "คำแนะนำ", "ระดับความรุนแรง" และ "ราคาประเมิน" จากคลังความรู้นี้ก่อนข้อมูลภายนอกเสมอ!
===================================================================
`;
}

export function getHondaKnowledgeStats() {
  const items = hondaData.knowledge as HondaKnowledgeItem[];
  const modelsMap = new Map<string, number>();
  const categoriesMap = new Map<string, number>();

  items.forEach(item => {
    modelsMap.set(item.รุ่นรถ, (modelsMap.get(item.รุ่นรถ) || 0) + 1);
    categoriesMap.set(item.หมวดปัญหา, (categoriesMap.get(item.หมวดปัญหา) || 0) + 1);
  });

  return {
    totalItems: items.length,
    sources: hondaData.sources,
    priceGuide: hondaData.priceGuide,
    aiUsageGuide: hondaData.aiUsageGuide,
    models: Array.from(modelsMap.entries()).map(([model, count]) => ({ model, count })),
    categories: Array.from(categoriesMap.entries()).map(([category, count]) => ({ category, count })),
  };
}
