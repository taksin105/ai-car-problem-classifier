import './config/firebase';
import { createCase, createAutomationLog } from './services/firestoreService';

const demoData = [
  {
    customerName: 'สมชาย สุขใจ',
    phoneNumber: '081-234-5678',
    vehicleModel: 'Toyota Camry',
    vehicleYear: 2022,
    mileage: 35000,
    problemDescription: 'รถสตาร์ทไม่ติดและได้ยินเสียงคลิก',
    category: 'Electrical' as const,
    urgency: 'MEDIUM' as const,
    confidence: 0.82,
    summary: 'ลูกค้าแจ้งว่ารถสตาร์ทไม่ติดและมีเสียงคลิก อาจเกิดจากแบตเตอรี่อ่อนหรือไดสตาร์ทมีปัญหา',
    symptoms: ['Engine fails to start', 'Clicking sound when starting'],
    possibleCauses: ['Weak battery', 'Faulty starter motor', 'Corroded battery terminals'],
    followUpQuestions: ['ไฟหน้ารถติดปกติหรือไม่?', 'เพิ่งเปลี่ยนแบตเตอรี่เมื่อไหร่?'],
    recommendation: 'แนะนำให้ตรวจสอบแบตเตอรี่และระบบสตาร์ทที่ศูนย์บริการ',
    requiresImmediateAttention: false,
  },
  {
    customerName: 'วิภา รักดี',
    phoneNumber: '089-876-5432',
    vehicleModel: 'Honda Civic',
    vehicleYear: 2023,
    mileage: 15000,
    problemDescription: 'เวลาเหยียบเบรกมีเสียงดังและรู้สึกว่าเบรกไม่ค่อยอยู่',
    category: 'Brake' as const,
    urgency: 'HIGH' as const,
    confidence: 0.93,
    summary: 'ลูกค้าแจ้งว่าเบรกมีเสียงดังและประสิทธิภาพการเบรกลดลง เป็นเคสเร่งด่วนที่เกี่ยวข้องกับความปลอดภัย',
    symptoms: ['Brake noise', 'Reduced braking performance'],
    possibleCauses: ['Worn brake pads', 'Warped brake rotors', 'Brake fluid leak'],
    followUpQuestions: ['เสียงเกิดขึ้นทุกครั้งที่เบรกหรือไม่?', 'มีไฟเตือนเบรกขึ้นบนหน้าปัดหรือไม่?'],
    recommendation: 'กรุณาหยุดใช้งานรถและนำรถเข้าตรวจสอบทันที เนื่องจากอาจเป็นปัญหาด้านความปลอดภัย',
    requiresImmediateAttention: true,
  },
  {
    customerName: 'ประเสริฐ มั่งมี',
    phoneNumber: '062-345-6789',
    vehicleModel: 'Mazda 3',
    vehicleYear: 2021,
    mileage: 52000,
    problemDescription: 'แอร์รถไม่เย็น เปิดแอร์แล้วมีแต่ลมร้อนออกมา',
    category: 'Air Conditioning' as const,
    urgency: 'LOW' as const,
    confidence: 0.88,
    summary: 'ลูกค้าแจ้งว่าระบบแอร์ไม่ทำความเย็น มีเพียงลมร้อนออกมา',
    symptoms: ['AC not cooling', 'Only warm air from vents'],
    possibleCauses: ['Low refrigerant', 'Compressor failure', 'Clogged condenser'],
    followUpQuestions: ['คอมเพรสเซอร์แอร์ทำงานหรือไม่?', 'เคยเติมน้ำยาแอร์เมื่อไหร่?'],
    recommendation: 'แนะนำให้นัดหมายเข้าตรวจสอบระบบแอร์ สามารถนัดตามความสะดวก',
    requiresImmediateAttention: false,
  },
  {
    customerName: 'นภัส วงศ์สว่าง',
    phoneNumber: '095-111-2233',
    vehicleModel: 'Nissan Almera',
    vehicleYear: 2020,
    mileage: 78000,
    problemDescription: 'รถมีอาการสั่นเวลาเร่งความเร็ว โดยเฉพาะช่วง 80-100 กม./ชม.',
    category: 'Engine' as const,
    urgency: 'MEDIUM' as const,
    confidence: 0.75,
    summary: 'ลูกค้าแจ้งว่ารถสั่นเมื่อเร่งความเร็ว อาจเกิดจากหลายสาเหตุ ต้องการข้อมูลเพิ่มเติม',
    symptoms: ['Vibration during acceleration', 'Vibration at 80-100 km/h'],
    possibleCauses: ['Unbalanced wheels', 'Worn CV joints', 'Engine mount issues', 'Transmission issue'],
    followUpQuestions: ['อาการสั่นเกิดที่พวงมาลัยหรือทั้งคัน?', 'เคยถ่วงล้อเมื่อไหร่?', 'มีเสียงผิดปกติร่วมด้วยหรือไม่?'],
    recommendation: 'แนะนำให้นำรถเข้าตรวจสอบเพื่อระบุสาเหตุที่แน่ชัด',
    requiresImmediateAttention: false,
  },
  {
    customerName: 'กัญญา ใจงาม',
    phoneNumber: '083-444-5566',
    vehicleModel: 'Toyota Yaris',
    vehicleYear: 2024,
    mileage: 8000,
    problemDescription: 'มีไฟเตือนขึ้นบนหน้าปัด เป็นรูปเครื่องยนต์สีเหลือง',
    category: 'Warning Light' as const,
    urgency: 'MEDIUM' as const,
    confidence: 0.80,
    summary: 'ลูกค้าแจ้งว่ามีไฟเตือน Check Engine ขึ้นบนหน้าปัด',
    symptoms: ['Check engine warning light'],
    possibleCauses: ['Emission system issue', 'Sensor malfunction', 'Loose gas cap', 'Engine performance issue'],
    followUpQuestions: ['ไฟเตือนกะพริบหรือติดค้าง?', 'รถมีอาการผิดปกติอื่นร่วมด้วยหรือไม่?', 'เพิ่งเติมน้ำมันมาหรือไม่?'],
    recommendation: 'แนะนำให้นำรถเข้าตรวจสอบเพื่ออ่านรหัสข้อผิดพลาดด้วยเครื่องสแกน',
    requiresImmediateAttention: false,
  },
];

async function seed() {
  console.log('🌱 Seeding demo data...');
  
  for (const data of demoData) {
    const serviceCase = await createCase(data);
    console.log(`  ✅ Created case: ${serviceCase.customerName} - ${serviceCase.category} (${serviceCase.urgency})`);
    
    // Create automation logs for each case
    await createAutomationLog(serviceCase.id, 'Case Created', 'SUCCESS');
    await createAutomationLog(serviceCase.id, 'AI Analysis Completed', 'SUCCESS', `Category: ${serviceCase.category}, Urgency: ${serviceCase.urgency}`);
    await createAutomationLog(serviceCase.id, 'Firestore Saved', 'SUCCESS');
    await createAutomationLog(serviceCase.id, 'n8n Workflow Triggered', 'SUCCESS');
    if (serviceCase.requiresImmediateAttention) {
      await createAutomationLog(serviceCase.id, 'Service Advisor Notified (HIGH Priority)', 'SUCCESS');
    } else {
      await createAutomationLog(serviceCase.id, 'Service Advisor Notified', 'SUCCESS');
    }
  }
  
  console.log('\\n✅ Seed completed! Created', demoData.length, 'demo cases');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
