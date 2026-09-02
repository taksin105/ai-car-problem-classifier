import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Coins,
  Printer,
  Bell,
  Cpu,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Workflow,
  Laptop,
} from 'lucide-react';

export function UserGuidePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'getting-started' | 'ai-triage' | 'quoting' | 'pdf-export' | 'webhook' | 'faq'>('getting-started');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const TABS = [
    { id: 'getting-started', label: '🚀 คู่มือเริ่มต้นใช้งาน', badge: 'Step-by-Step' },
    { id: 'ai-triage', label: '🤖 กลไก AI Triage', badge: 'Gemini 3.6' },
    { id: 'quoting', label: '💰 ระบบประเมินราคา & เวลา', badge: 'AI Quoting' },
    { id: 'pdf-export', label: '🖨️ การพิมพ์ใบรับรถ PDF', badge: 'Intake Sheet' },
    { id: 'webhook', label: '🔔 แจ้งเตือน Discord & n8n', badge: 'Realtime' },
    { id: 'faq', label: '❓ FAQ & Troubleshooting', badge: 'Help' },
  ] as const;

  const FAQS = [
    {
      q: '1. AI ประเมินอาการรถยนต์ได้แม่นยำแค่ไหน และเชื่อถือได้หรือไม่?',
      a: 'ระบบทำงานบนโมเดล Google Gemini 3.6 Flash ร่วมกับ Structured JSON Schema โดยกำหนดกฎเกณฑ์ (Safety Rules) ไว้อย่างรัดกุม ทำหน้าที่เป็น "AI First-Line Triage" เพื่อช่วยคัดกรองเบื้องต้น สกัดอาการ และตั้งคำถามแนะนำให้ Service Advisor โดยจะมี Confidence Score (0-100%) แสดงทุกครั้ง พร้อมข้อกำหนดความรับผิดชอบ (Disclaimer) ว่าต้องให้ช่างตรวจสอบยืนยันก่อนลงมือซ่อมจริงเสมอ',
    },
    {
      q: '2. การประมาณการค่าซ่อมและระยะเวลา (Estimated Cost & Time) คิดคำนวณจากอะไร?',
      a: 'Gemini วิเคราะห์จาก 5 ตัวแปร: 1) ยี่ห้อและรุ่นรถ 2) ปีรถ 3) เลขไมล์สะสม 4) หมวดหมู่ปัญหา และ 5) ระดับความเสียหายที่ระบุ โดยอิงฐานข้อมูลช่วงราคามาตรฐานของศูนย์บริการและอู่ซ่อมมาตรฐานในไทย โดยแยกค่าอะไหล่และค่าแรงออกจากกันอย่างชัดเจน',
    },
    {
      q: '3. หากกดปุ่ม "Analyze Problem" แล้วเกิด Error ต้องแก้ไขอย่างไร?',
      a: 'ให้ตรวจสอบ 3 จุด: 1) ตรวจสอบไฟล์ server/.env ว่ามี GEMINI_API_KEY ถูกต้องหรือไม่ 2) ตรวจสอบว่า Backend รันอยู่บนพอร์ต 5000 หรือไม่ (เข้า http://localhost:5000/api/health) 3) ตรวจสอบว่าช่อง Problem Description พิมพ์อย่างน้อย 10 ตัวอักษรขึ้นไป',
    },
    {
      q: '4. ต้องการเปลี่ยนกลุ่ม Discord หรือเปลี่ยน Webhook URL ต้องทำอย่างไร?',
      a: 'เปิดไฟล์ server/.env แล้วแก้ไขค่า N8N_WEBHOOK_URL ให้เป็น Discord Webhook URL ใหม่ของคุณ จากนั้นเซิร์ฟเวอร์จะรีโหลดอัตโนมัติ และเคสถัดไปจะถูกส่งเข้าห้องใหม่ทันที',
    },
    {
      q: '5. ข้อมูลเคสและประวัติถูกบันทึกไว้ที่ไหน ปลอดภัยหรือไม่?',
      a: 'ข้อมูลถูกบันทึกลง Google Firebase Firestore (คลาวด์มาตรฐานระดับ Enterprise) ใน Collection "serviceCases" และ "automationLogs" โดยไม่มีการเก็บข้อมูลบัตรเครดิตหรือรหัสผ่าน ปลอดภัย 100%',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1d] via-[#131b2e] to-[#0d1527] text-white rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold mb-4 shadow-xs">
            <BookOpen className="h-4 w-4 text-blue-400" />
            <span>AutoTech AI Pro • Complete Operations Manual & Documentation</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            คู่มือการใช้งานระบบ <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">AutoTech AI</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
            เอกสารแนะนำขั้นตอนการปฏิบัติงาน การรับเรื่องลูกค้า การวิเคราะห์อาการด้วยปัญญาประดิษฐ์ (AI Triage) 
            การประเมินราคาซ่อม และการส่งต่อข้อมูลเข้าศูนย์บริการอย่างครบวงจร
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/new-case')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
            >
              <span>+ เปิดหน้าสร้างเคสรับรถ</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <Laptop className="h-4 w-4" />
              <span>เข้าหน้าแดชบอร์ดหลัก</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-600/10 via-indigo-600/5 to-transparent pointer-events-none" />
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: GETTING STARTED */}
      {activeTab === 'getting-started' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span>3 ขั้นตอนการรับรถและวิเคราะห์ปัญหา (Workflow Walkthrough)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                แนวทางปฏิบัติมาตรฐานสำหรับ Service Advisor เมื่อมีลูกค้านำรถเข้าศูนย์บริการ
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/50 to-white border border-blue-100 shadow-2xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900">รับเรื่อง & บันทึกข้อมูลรถ</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  เข้าหน้า <strong>New Case</strong> กรอกชื่อ เบอร์โทร ข้อมูลรถ (ยี่ห้อ รุ่น ปี เลขไมล์) และพิมพ์อาการที่ลูกค้าแจ้ง หรือกดปุ่ม <strong>⚡ Quick Demo Template</strong> ด้านบนเพื่อกรอกตัวอย่างใน 1 คลิก
                </p>
                <div className="p-2.5 rounded-lg bg-blue-100/60 text-[11px] text-blue-900 font-semibold">
                  📌 ตัวอย่างอาการ: "เบรกแล้วมีเสียงดังเอี๊ยดและรู้สึกว่าเบรกไม่อยู่"
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-100 shadow-2xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900">AI ประมวลผล & เสนอราคา</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  กดปุ่ม <strong>Analyze Problem</strong> ระบบจะส่งข้อมูลให้ Gemini วิเคราะห์ภายใน 2 วินาที พร้อมแสดงผล:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                  <li>หมวดหมู่ & ระดับความด่วน (Urgency)</li>
                  <li><strong>ประมาณการค่าซ่อม & เวลาซ่อม</strong></li>
                  <li>คำถามที่ควรถามลูกค้าเพิ่ม (Follow-up)</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-50/50 to-white border border-purple-100 shadow-2xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-900">พิมพ์ใบรับรถ & ส่งต่อช่าง</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  เมื่อตรวจทานความถูกต้องแล้ว พนักงานสามารถ:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                  <li>กด <strong>Print / Export PDF</strong> เพื่อออกใบรับรถให้ลูกค้าเซ็น</li>
                  <li>ระบบจะส่ง Alert เข้า Discord ของทีมช่างอัตโนมัติ</li>
                  <li>อัปเดตสถานะเป็น <strong>IN_REVIEW</strong> หรือ <strong>COMPLETED</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Good vs Bad Input Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  ✅ การกรอกอาการที่ดี (AI วิเคราะห์ได้แม่นยำสูง 90%+)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <strong>ระบุพฤติกรรมชัดเจน:</strong> "เวลาเหยียบเบรกที่ความเร็ว 60 กม./ชม. มีเสียงดังเอี๊ยดจากล้อหน้าขวา และแป้นเบรกสั่น"
                </li>
                <li className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <strong>ระบุช่วงเวลาที่เกิด:</strong> "สตาร์ทรถตอนเช้าเครื่องสั่นและมีควันขาวออกท่อไอเสีย พอเครื่องร้อนอาการดีขึ้น"
                </li>
                <li className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <strong>ระบุไฟเตือนบนหน้าปัด:</strong> "มีไฟรูปเครื่องยนต์ (Check Engine) สีเหลืองโชว์ค้าง รถเร่งไม่ค่อยขึ้น"
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-rose-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-950">
                  ❌ การกรอกอาการที่กำกวม (AI จะได้ Confidence ต่ำ)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                  <strong>สั้นเกินไป:</strong> "รถพัง" หรือ "มีเสียงดัง" <em>(AI จะจัดเป็นหมวด Other และขอข้อมูลเพิ่ม)</em>
                </li>
                <li className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                  <strong>ไม่ระบุตำแหน่ง:</strong> "รู้สึกขับแปลกๆ ไม่เหมือนเดิม" <em>(ไม่มีข้อมูลพอจะระบุระบบที่เสีย)</em>
                </li>
                <li className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                  <strong>คาดเดาเองโดยไม่มีอาการ:</strong> "น่าจะหัวเทียนบอด" <em>(ควรอธิบายอาการที่พบ เช่น เร่งสะดุด หรือสตาร์ทยาก)</em>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI TRIAGE & URGENCY MATRIX */}
      {activeTab === 'ai-triage' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                <span>เกณฑ์การจัดระดับความเร่งด่วน (Urgency Triage Matrix)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                AI จะประเมินระดับความเสี่ยงต่อชีวิต ทรัพย์สิน และเครื่องยนต์ โดยแบ่งออกเป็น 3 ระดับ
              </p>
            </div>

            {/* Matrix Cards */}
            <div className="space-y-4">
              {/* HIGH Card */}
              <div className="p-6 rounded-2xl bg-red-50/40 border-2 border-red-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse-glow" />
                    <h3 className="text-sm font-extrabold text-red-900 uppercase">🔴 HIGH Urgency (เคสเร่งด่วน / อันตรายสูง)</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-extrabold border border-red-200">
                    🚨 Immediate Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>คำจำกัดความ:</strong> ปัญหาที่มีผลกระทบโดยตรงต่อความปลอดภัยในการขับขี่ หรือหากฝืนขับต่อไปอาจทำให้เครื่องยนต์เสียหายถาวร
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/80 rounded-xl border border-red-100">
                    <span className="font-bold text-red-900 block mb-1">ตัวอย่างอาการ:</span>
                    <span className="text-slate-600">เบรกไม่อยู่, พวงมาลัยล็อค, ควันโขมง, น้ำมันเครื่องรั่วหยดหนัก, ความร้อนขึ้นสูง (Overheat)</span>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-red-100">
                    <span className="font-bold text-red-900 block mb-1">การดำเนินการของระบบ:</span>
                    <span className="text-slate-600">ส่งแจ้งเตือน Discord แท็ก <strong>@everyone</strong> + แนะนำให้พนักงานแจ้งลูกค้าหยุดใช้รถทันที</span>
                  </div>
                </div>
              </div>

              {/* MEDIUM Card */}
              <div className="p-6 rounded-2xl bg-amber-50/40 border-2 border-amber-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-extrabold text-amber-900 uppercase">🟡 MEDIUM Urgency (ความเร่งด่วนปานกลาง)</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold border border-amber-200">
                    ⚠️ Schedule Soon (1-3 Days)
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>คำจำกัดความ:</strong> รถยังพอขับขี่ได้ แต่สมรรถนะลดลงอย่างเห็นได้ชัด หรือระบบเตือนเริ่มทำงาน ควรรีบนำเข้าตรวจสอบใน 1-3 วัน
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
                    <span className="font-bold text-amber-900 block mb-1">ตัวอย่างอาการ:</span>
                    <span className="text-slate-600">ไฟ Check Engine โชว์, สตาร์ทติดยาก, เกียร์กระตุก, เครื่องสั่นตอนเร่งความเร็ว, แบตเตอรี่เริ่มเสื่อม</span>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
                    <span className="font-bold text-amber-900 block mb-1">การดำเนินการของระบบ:</span>
                    <span className="text-slate-600">ส่งแจ้งเตือน Discord การ์ดสีส้ม + แนะนำนัดหมายคิวช่างในระยะเวลาอันใกล้</span>
                  </div>
                </div>
              </div>

              {/* LOW Card */}
              <div className="p-6 rounded-2xl bg-emerald-50/40 border-2 border-emerald-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-extrabold text-emerald-900 uppercase">🟢 LOW Urgency (ปกติ / บำรุงรักษา)</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
                    🟢 Routine Service
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>คำจำกัดความ:</strong> ปัญหาความสะดวกสบายทั่วไป หรือการเช็คระยะตามตารางเวลา ไม่มีผลต่อความปลอดภัยในการขับขี่
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">ตัวอย่างอาการ:</span>
                    <span className="text-slate-600">แอร์ไม่เย็น มีแต่ลม, เช็คระยะ 40,000 กม., เปลี่ยนถ่ายน้ำมันเครื่อง, เสียงพลาสติกคอนโซลสั่น</span>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">การดำเนินการของระบบ:</span>
                    <span className="text-slate-600">ส่งแจ้งเตือน Discord การ์ดสีเขียว + นัดหมายตามความสะดวกของลูกค้า</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUOTING & COST ESTIMATION */}
      {activeTab === 'quoting' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Coins className="h-5 w-5 text-emerald-600" />
                <span>ระบบประเมินราคาซ่อมและเวลาทำงาน (AI Quoting Engine)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                ช่วยให้ Service Advisor สามารถตอบคำถามที่ลูกค้าถามบ่อยที่สุด: "ราคาประมาณเท่าไหร่ และเสร็จกี่โมง?"
              </p>
            </div>

            {/* Quoting Cards Mockup */}
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-sky-500/5 rounded-2xl border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-emerald-950 flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-emerald-600" />
                  ตัวอย่างการแสดงผลราคาในระบบ (Sample AI Quoting Result)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900">
                  AI Calculated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">💰 ประมาณการค่าใช้จ่าย (Estimated Cost)</span>
                  <p className="text-lg font-extrabold text-emerald-700">฿1,800 - ฿3,500</p>
                  <p className="text-[11px] text-slate-600 mt-1">(ค่าอะไหล่ผ้าเบรกคู่หน้า + เจียรจาน + ค่าแรง)</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-sky-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">⏱️ ระยะเวลาดำเนินการ (Estimated Time)</span>
                  <p className="text-lg font-extrabold text-sky-700">1.5 - 2 ชั่วโมง</p>
                  <p className="text-[11px] text-slate-600 mt-1">(กรณีอะไหล่พร้อมในสต็อก)</p>
                </div>
              </div>
            </div>

            {/* Price Estimation Principles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                หลักการประเมินราคาของ AI:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">1. อิงรุ่นและปีรถ</span>
                  <span className="text-slate-600">รถยุโรป/รถกลุ่มพรีเมียม ค่าอะไหล่จะถูกคำนวณในเกณฑ์ที่สูงกว่ารถยนต์ Eco Car ตามราคาตลาดจริง</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">2. แยกค่าอะไหล่ & ค่าแรง</span>
                  <span className="text-slate-600">ระบบจะระบุองค์ประกอบของราคา เช่น ค่าถ่ายน้ำยา ค่าล้างระบบ หรือค่าเปลี่ยนอะไหล่</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">3. ช่วงราคา (Price Range)</span>
                  <span className="text-slate-600">แสดงเป็นช่วง Min - Max เพื่อเผื่อกรณีลูกค้าเลือกใช้อะไหล่แท้ศูนย์ หรืออะไหล่ OEM เกรดเทียบเท่า</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PDF & INTAKE SHEET */}
      {activeTab === 'pdf-export' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Printer className="h-5 w-5 text-purple-600" />
                <span>การออกใบสรุปรายงานรับรถ (Service Intake Sheet & Export PDF)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                เปลี่ยนหน้าจอเคสให้กลายเป็นเอกสารทางการสำหรับพิมพ์หรือบันทึกเป็น PDF หน้าร้านได้ทันที
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-xs text-slate-700">
                <h3 className="text-sm font-bold text-slate-900">องค์ประกอบในใบสรุปรายงานรับรถ:</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <strong>1. หัวเอกสารศูนย์บริการ:</strong> โลโก้, Case ID, วันที่-เวลารับรถ และสถานะงาน
                  </div>
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <strong>2. ข้อมูลลูกค้า & ตัวรถ:</strong> ชื่อ เบอร์โทร รุ่นรถ ปีรถ และเลขไมล์
                  </div>
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <strong>3. ผลวิเคราะห์ AI & ประมาณการราคา:</strong> หมวดหมู่, Urgency, ราคาประเมิน, และคำแนะนำช่าง
                  </div>
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <strong>4. Service Advisor Checklist:</strong> เช็กลิสต์ตรวจสภาพภายนอกและระดับของเหลว
                  </div>
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <strong>5. ช่องลงลายมือชื่อ:</strong> ลายเซ็นลูกค้ายินยอมรับบริการ + ลายเซ็นพนักงานรับรถ
                  </div>
                </div>
              </div>

              {/* Visual Mockup */}
              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-3">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-left text-[10px] space-y-2">
                  <div className="flex justify-between border-b pb-1 font-bold text-slate-800">
                    <span>🚗 AutoTech AI Service Center</span>
                    <span>INTAKE SHEET</span>
                  </div>
                  <div className="text-slate-500">Customer: สมชาย สุขใจ | Honda Civic (2023)</div>
                  <div className="p-1.5 bg-red-50 text-red-700 font-bold rounded">
                    URGENCY: HIGH • Problem: Brake System
                  </div>
                  <div className="text-slate-500">Est. Cost: ฿1,800 - ฿3,500 | Est. Time: 1.5 - 2 ชม.</div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-center text-[9px] text-slate-400">
                    <div>(ลงชื่อลูกค้า)....................</div>
                    <div>(ลงชื่อพนักงาน)....................</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  กดปุ่ม <strong>"Print / Export PDF"</strong> จากหน้า Case Details ระบบจะซ่อน Sidebar และจัดหน้ากระดาษ A4 สวยงามอัตโนมัติ
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WEBHOOK & DISCORD AUTOMATION */}
      {activeTab === 'webhook' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                <span>การเชื่อมต่อระบบแจ้งเตือน Real-time (Discord & n8n)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                การแจ้งเตือนช่างทันทีผ่าน Discord Rich Embeds หรือต่อยอดระบบ Low-code Automation ด้วย n8n
              </p>
            </div>

            {/* Architecture Pipeline */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                <Workflow className="h-4 w-4 text-blue-400" />
                Dataflow Architecture Pipeline
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="font-bold text-white mb-1">1. User Submit</div>
                  <div className="text-[11px] text-slate-400">React Frontend ส่งข้อมูล</div>
                </div>
                <div className="p-3 bg-blue-900/60 rounded-xl border border-blue-500/40">
                  <div className="font-bold text-blue-300 mb-1">2. Gemini Triage</div>
                  <div className="text-[11px] text-blue-200">AI สกัดอาการ & ออกราคา</div>
                </div>
                <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-500/40">
                  <div className="font-bold text-emerald-300 mb-1">3. Firestore DB</div>
                  <div className="text-[11px] text-emerald-200">บันทึกเคส & Audit Log</div>
                </div>
                <div className="p-3 bg-purple-900/60 rounded-xl border border-purple-500/40">
                  <div className="font-bold text-purple-300 mb-1">4. Discord Webhook</div>
                  <div className="text-[11px] text-purple-200">ส่งการ์ดแจ้งเตือนทีมช่าง</div>
                </div>
              </div>
            </div>

            {/* Discord Embed Preview */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ตัวอย่างการ์ดแจ้งเตือนใน Discord (Discord Embed Mockup):
              </h3>
              <div className="p-4 bg-[#2B2D31] text-white rounded-xl border-l-4 border-red-500 font-mono text-xs space-y-2 shadow-md">
                <div className="text-red-400 font-bold flex items-center gap-1.5">
                  <span>🚨 [URGENT] High Priority Vehicle Case Alert!</span>
                  <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded text-red-300">@everyone</span>
                </div>
                <div className="text-slate-200 font-bold">🔧 Category: Brake (HIGH Urgency)</div>
                <div className="text-slate-300 text-[11px]">
                  **Summary:** ลูกค้าแจ้งว่าเบรกมีเสียงดังและเบรกไม่อยู่ เป็นเคสเร่งด่วนที่ต้องตรวจสอบทันที
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300">
                  <div>👤 **Customer:** วิภา รักดี (089-876-5432)</div>
                  <div>🚗 **Vehicle:** Honda Civic (2023) - 15,000 km</div>
                  <div>💰 **Est. Cost:** ฿1,800 - ฿3,500</div>
                  <div>⏱️ **Est. Time:** 1.5 - 2 ชั่วโมง</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FAQ & TROUBLESHOOTING */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <span>คำถามที่พบบ่อย & การแก้ไขปัญหา (FAQ & Troubleshooting)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                รวบรวมข้อสงสัยและแนวทางแก้ปัญหาด้านเทคนิคที่พบบ่อย
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all bg-white"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        openFaq === idx ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
