import { db, isFirebaseConfigured } from '../config/firebase';
import { ServiceCase, CaseStatus, CaseListQuery, DashboardStats, AutomationLog } from '../types';
import { v4 as uuidv4 } from 'uuid';

const CASES_COLLECTION = 'serviceCases';
const LOGS_COLLECTION = 'automationLogs';

// In-Memory Storage for Development/Offline fallback
const inMemoryCases = new Map<string, ServiceCase>();
const inMemoryLogs = new Map<string, AutomationLog>();

// Initialize with sample demo data
const initialDemoCases: Omit<ServiceCase, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    customerName: 'สมชาย สุขใจ',
    phoneNumber: '081-234-5678',
    vehicleModel: 'Toyota Camry',
    vehicleYear: 2022,
    mileage: 35000,
    problemDescription: 'รถสตาร์ทไม่ติดและได้ยินเสียงคลิก',
    category: 'Electrical',
    urgency: 'MEDIUM',
    confidence: 0.82,
    status: 'IN_REVIEW',
    summary: 'ลูกค้าแจ้งว่ารถสตาร์ทไม่ติดและมีเสียงคลิก อาจเกิดจากแบตเตอรี่อ่อนหรือไดสตาร์ทมีปัญหา',
    symptoms: ['Engine fails to start', 'Clicking sound when starting'],
    possibleCauses: ['Weak battery', 'Faulty starter motor', 'Corroded battery terminals'],
    followUpQuestions: ['ไฟหน้ารถติดปกติหรือไม่?', 'เพิ่งเปลี่ยนแบตเตอรี่เมื่อไหร่?'],
    recommendation: 'แนะนำให้ตรวจสอบแบตเตอรี่และระบบสตาร์ทที่ศูนย์บริการ',
    requiresImmediateAttention: false,
    estimatedCost: '฿2,200 - ฿3,800 (ค่าแบตเตอรี่ใหม่ + ค่าแรง)',
    estimatedRepairTime: '45 นาที - 1 ชั่วโมง',
  },
  {
    customerName: 'วิภา รักดี',
    phoneNumber: '089-876-5432',
    vehicleModel: 'Honda Civic',
    vehicleYear: 2023,
    mileage: 15000,
    problemDescription: 'เวลาเหยียบเบรกมีเสียงดังและรู้สึกว่าเบรกไม่ค่อยอยู่',
    category: 'Brake',
    urgency: 'HIGH',
    confidence: 0.93,
    status: 'NEW',
    summary: 'ลูกค้าแจ้งว่าเบรกมีเสียงดังและประสิทธิภาพการเบรกลดลง เป็นเคสเร่งด่วนที่เกี่ยวข้องกับความปลอดภัย',
    symptoms: ['Brake noise', 'Reduced braking performance'],
    possibleCauses: ['Worn brake pads', 'Warped brake rotors', 'Brake fluid leak'],
    followUpQuestions: ['เสียงเกิดขึ้นทุกครั้งที่เบรกหรือไม่?', 'มีไฟเตือนเบรกขึ้นบนหน้าปัดหรือไม่?'],
    recommendation: 'กรุณาหยุดใช้งานรถและนำรถเข้าตรวจสอบทันที เนื่องจากอาจเป็นปัญหาด้านความปลอดภัย',
    requiresImmediateAttention: true,
    estimatedCost: '฿1,800 - ฿3,500 (ผ้าเบรกคู่หน้า + เจียรจาน + ค่าแรง)',
    estimatedRepairTime: '1.5 - 2 ชั่วโมง',
  },
  {
    customerName: 'ประเสริฐ มั่งมี',
    phoneNumber: '062-345-6789',
    vehicleModel: 'Mazda 3',
    vehicleYear: 2021,
    mileage: 52000,
    problemDescription: 'แอร์รถไม่เย็น เปิดแอร์แล้วมีแต่ลมร้อนออกมา',
    category: 'Air Conditioning',
    urgency: 'LOW',
    confidence: 0.88,
    status: 'COMPLETED',
    summary: 'ลูกค้าแจ้งว่าระบบแอร์ไม่ทำความเย็น มีเพียงลมร้อนออกมา',
    symptoms: ['AC not cooling', 'Only warm air from vents'],
    possibleCauses: ['Low refrigerant', 'Compressor failure', 'Clogged condenser'],
    followUpQuestions: ['คอมเพรสเซอร์แอร์ทำงานหรือไม่?', 'เคยเติมน้ำยาแอร์เมื่อไหร่?'],
    recommendation: 'แนะนำให้นัดหมายเข้าตรวจสอบระบบแอร์ สามารถนัดตามความสะดวก',
    requiresImmediateAttention: false,
    estimatedCost: '฿900 - ฿2,200 (เติมน้ำยา R134a + เช็ครอยรั่ว)',
    estimatedRepairTime: '1 - 2 ชั่วโมง',
  },
  {
    customerName: 'นภัส วงศ์สว่าง',
    phoneNumber: '095-111-2233',
    vehicleModel: 'Nissan Almera',
    vehicleYear: 2020,
    mileage: 78000,
    problemDescription: 'รถมีอาการสั่นเวลาเร่งความเร็ว โดยเฉพาะช่วง 80-100 กม./ชม.',
    category: 'Engine',
    urgency: 'MEDIUM',
    confidence: 0.75,
    status: 'ASSIGNED',
    summary: 'ลูกค้าแจ้งว่ารถสั่นเมื่อเร่งความเร็ว อาจเกิดจากหลายสาเหตุ ต้องการข้อมูลเพิ่มเติม',
    symptoms: ['Vibration during acceleration', 'Vibration at 80-100 km/h'],
    possibleCauses: ['Unbalanced wheels', 'Worn CV joints', 'Engine mount issues', 'Transmission issue'],
    followUpQuestions: ['อาการสั่นเกิดที่พวงมาลัยหรือทั้งคัน?', 'เคยถ่วงล้อเมื่อไหร่?', 'มีเสียงผิดปกติร่วมด้วยหรือไม่?'],
    recommendation: 'แนะนำให้นำรถเข้าตรวจสอบเพื่อระบุสาเหตุที่แน่ชัด',
    requiresImmediateAttention: false,
    estimatedCost: '฿600 - ฿2,500 (ถ่วงล้อ 4 ล้อ / ตั้งศูนย์ หรือเปลี่ยนยางแท่นเครื่อง)',
    estimatedRepairTime: '2 - 3 ชั่วโมง',
  },
  {
    customerName: 'กัญญา ใจงาม',
    phoneNumber: '083-444-5566',
    vehicleModel: 'Toyota Yaris',
    vehicleYear: 2024,
    mileage: 8000,
    problemDescription: 'มีไฟเตือนขึ้นบนหน้าปัด เป็นรูปเครื่องยนต์สีเหลือง',
    category: 'Warning Light',
    urgency: 'MEDIUM',
    confidence: 0.80,
    status: 'NEW',
    summary: 'ลูกค้าแจ้งว่ามีไฟเตือน Check Engine ขึ้นบนหน้าปัด',
    symptoms: ['Check engine warning light'],
    possibleCauses: ['Emission system issue', 'Sensor malfunction', 'Loose gas cap', 'Engine performance issue'],
    followUpQuestions: ['ไฟเตือนกะพริบหรือติดค้าง?', 'รถมีอาการผิดปกติอื่นร่วมด้วยหรือไม่?', 'เพิ่งเติมน้ำมันมาหรือไม่?'],
    recommendation: 'แนะนำให้นำรถเข้าตรวจสอบเพื่ออ่านรหัสข้อผิดพลาดด้วยเครื่องสแกน',
    requiresImmediateAttention: false,
    estimatedCost: '฿500 - ฿1,800 (ค่าสแกน OBD-II / เปลี่ยนเซนเซอร์)',
    estimatedRepairTime: '1 ชั่วโมง',
  },
];

// Seed initial memory
initialDemoCases.forEach((item, index) => {
  const id = `demo-${index + 1}`;
  const now = new Date(Date.now() - (index * 3600000 * 4)).toISOString();
  const c: ServiceCase = {
    ...item,
    id,
    status: item.status || 'NEW',
    createdAt: now,
    updatedAt: now,
  };
  inMemoryCases.set(id, c);
  
  const logId = uuidv4();
  inMemoryLogs.set(logId, {
    id: logId,
    caseId: id,
    event: 'Case Created',
    status: 'SUCCESS',
    details: `Initial Case: ${item.category}`,
    timestamp: now,
  });
});

/** Create a new service case */
export async function createCase(caseData: Omit<ServiceCase, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ServiceCase> {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const serviceCase: ServiceCase = {
    ...caseData,
    id,
    status: 'NEW',
    createdAt: now,
    updatedAt: now,
  };
  
  if (db && isFirebaseConfigured) {
    try {
      await db.collection(CASES_COLLECTION).doc(id).set(serviceCase);
    } catch (e) {
      console.warn('Failed to save to Firestore, writing to memory store:', e);
    }
  }
  
  inMemoryCases.set(id, serviceCase);
  return serviceCase;
}

/** Get all cases with optional filters */
export async function getCases(query: CaseListQuery): Promise<ServiceCase[]> {
  let cases: ServiceCase[] = [];
  
  if (db && isFirebaseConfigured) {
    try {
      const snapshot = await db.collection(CASES_COLLECTION).get();
      cases = snapshot.docs.map(doc => doc.data() as ServiceCase);
    } catch (e) {
      console.warn('Firestore read failed, falling back to memory store:', e);
      cases = Array.from(inMemoryCases.values());
    }
  } else {
    cases = Array.from(inMemoryCases.values());
  }
  
  if (query.category) {
    cases = cases.filter(c => c.category === query.category);
  }
  if (query.urgency) {
    cases = cases.filter(c => c.urgency === query.urgency);
  }
  if (query.status) {
    cases = cases.filter(c => c.status === query.status);
  }
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    cases = cases.filter(c =>
      c.customerName.toLowerCase().includes(searchLower) ||
      c.vehicleModel.toLowerCase().includes(searchLower) ||
      c.problemDescription.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort desc by createdAt
  cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return cases;
}

/** Get a single case by ID */
export async function getCaseById(id: string): Promise<ServiceCase | null> {
  if (db && isFirebaseConfigured) {
    try {
      const doc = await db.collection(CASES_COLLECTION).doc(id).get();
      if (doc.exists) {
        return doc.data() as ServiceCase;
      }
    } catch (e) {
      console.warn('Firestore read error for single case, checking memory store:', e);
    }
  }
  return inMemoryCases.get(id) || null;
}

/** Update case status */
export async function updateCaseStatus(id: string, status: CaseStatus): Promise<ServiceCase | null> {
  const updatedAt = new Date().toISOString();

  if (db && isFirebaseConfigured) {
    try {
      const ref = db.collection(CASES_COLLECTION).doc(id);
      const doc = await ref.get();
      if (doc.exists) {
        await ref.update({
          status,
          updatedAt,
        });
        const updated = await ref.get();
        const updatedData = updated.data() as ServiceCase;
        inMemoryCases.set(id, updatedData);
        return updatedData;
      }
    } catch (e) {
      console.warn('Firestore update error, updating memory store:', e);
    }
  }

  const existing = inMemoryCases.get(id);
  if (!existing) return null;
  existing.status = status;
  existing.updatedAt = updatedAt;
  inMemoryCases.set(id, existing);
  return existing;
}

/** Get dashboard statistics */
export async function getDashboardStats(): Promise<DashboardStats> {
  const cases = await getCases({});
  
  return {
    total: cases.length,
    newCases: cases.filter(c => c.status === 'NEW').length,
    highPriority: cases.filter(c => c.urgency === 'HIGH').length,
    inProgress: cases.filter(c => c.status === 'IN_REVIEW' || c.status === 'ASSIGNED').length,
    completed: cases.filter(c => c.status === 'COMPLETED').length,
  };
}

/** Create automation log entry */
export async function createAutomationLog(
  caseId: string,
  event: string,
  status: 'SUCCESS' | 'FAILED',
  details?: string
): Promise<AutomationLog> {
  const id = uuidv4();
  const log: AutomationLog = {
    id,
    caseId,
    event,
    status,
    details: details || '',
    timestamp: new Date().toISOString(),
  };
  
  if (db && isFirebaseConfigured) {
    try {
      await db.collection(LOGS_COLLECTION).doc(id).set(log);
    } catch (e) {
      console.warn('Failed to save automation log to Firestore:', e);
    }
  }
  
  inMemoryLogs.set(id, log);
  return log;
}

/** Get automation logs, optionally filtered by caseId */
export async function getAutomationLogs(caseId?: string): Promise<AutomationLog[]> {
  let logs: AutomationLog[] = [];

  if (db && isFirebaseConfigured) {
    try {
      let ref: FirebaseFirestore.Query = db.collection(LOGS_COLLECTION);
      if (caseId) {
        ref = ref.where('caseId', '==', caseId);
      }
      const snapshot = await ref.get();
      logs = snapshot.docs.map(doc => doc.data() as AutomationLog);
    } catch (e) {
      console.warn('Failed to fetch automation logs from Firestore, using memory:', e);
      logs = Array.from(inMemoryLogs.values());
      if (caseId) {
        logs = logs.filter(l => l.caseId === caseId);
      }
    }
  } else {
    logs = Array.from(inMemoryLogs.values());
    if (caseId) {
      logs = logs.filter(l => l.caseId === caseId);
    }
  }

  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return logs;
}

