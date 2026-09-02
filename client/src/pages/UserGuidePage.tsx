import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Zap,
  Coins,
  Printer,
  Bell,
  Cpu,
  Database,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export function UserGuidePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: 'AI ประเมินอาการรถยนต์ได้แม่นยำแค่ไหน และเชื่อถือได้หรือไม่?',
      a: 'ระบบทำงานบนโมเดล Google Gemini 3.6 Flash ร่วมกับ Structured JSON Schema ทางการแพทย์/ช่างยนต์ โดยถูกออกแบบมาให้เป็น "AI First-Line Triage" เพื่อช่วยคัดกรองเบื้องต้น สกัดอาการ และแนะนำคำถามให้ Service Advisor เท่านั้น โดยจะแสดง Confidence Score (ความมั่นใจ) ทุกครั้ง และมีคำเตือนระบุให้ช่างผู้เชี่ยวชาญตรวจสอบจริงเสมอ',
    },
    {
      q: 'การประมาณการค่าซ่อมและเวลา (Estimated Cost & Time) คำนวณจากอะไร?',
      a: 'Gemini จะวิเคราะห์จากยี่ห้อ รุ่นรถ ปีรถ เลขไมล์ และระดับความเสียหายที่ลูกค้าแจ้ง โดยอิงช่วงราคามาตรฐานของศูนย์บริการไทย (แบ่งเป็นค่าอะไหล่ + ค่าแรง) เพื่อให้พนักงานสามารถแจ้งลูกค้าเป็นตัวเลขคร่าวๆ (Ballpark Figure) ได้ทันที',
    },
    {
      q: 'ระบบแจ้งเตือนเข้า Discord หรือ n8n ทำงานอย่างไรเมื่อมีเคสใหม่?',
      a: 'ทันทีที่กดยืนยันหรือ AI วิเคราะห์เสร็จ ระบบ Backend จะส่ง HTTP POST Webhook ไปยัง Discord Webhook URL ที่ตั้งไว้ใน server/.env อัตโนมัติ โดยจะจัด Format เป็นการ์ด Embed สีตามระดับความด่วน (สีแดงสำหรับ HIGH พร้อมแท็ก @everyone, สีส้มสำหรับ MEDIUM, สีเขียวสำหรับ LOW)',
    },
    {
      q: 'สามารถพิมพ์หรือส่งออกใบรับรถเป็น PDF ได้อย่างไร?',
      a: 'เข้าไปที่หน้ารายละเอียดเคส (Case Details) จะมีปุ่ม "🖨️ Print / Export PDF" อยู่มุมบนขวา ระบบจะจัดรูปแบบหน้าเว็บเป็นใบสรุปรายงานรับรถ (Service Intake Sheet) ทางการ ตัดเมนูและปุ่มที่ไม่จำเป็นออก มีเช็กลิสต์และช่องลงลายมือชื่อลูกค้า พร้อมสั่ง Print หรือ Save as PDF ได้ทันที',
    },
    {
      q: 'ข้อมูลเคสและประวัติถูกบันทึกไว้ที่ไหน?',
      a: 'ข้อมูลถูกจัดเก็บแบบ Real-time บน Google Firebase Firestore ใน Collection "serviceCases" (เก็บข้อมูลเคส) และ "automationLogs" (เก็บประวัติการส่งข้อมูลและ Webhook)',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0A0F1D] text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>AutoTech AI Pro • Operations & User Manual</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
            คู่มือการใช้งานระบบ AI Service Assistant
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            ระบบผู้ช่วยอัจฉริยะสำหรับคัดกรอง วิเคราะห์ปัญหารถยนต์ ประเมินราคาค่าซ่อม และส่งต่องานช่างแบบ Real-time ด้วย Gemini 3.6 Flash
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/new-case')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
            >
              <span>ทดลองสร้างเคสใหม่</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
            >
              <span>ไปที่ Dashboard</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* 3-Step Quick Start Guide */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-extrabold text-slate-900">3 ขั้นตอนเริ่มต้นใช้งาน (Quick Start)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-base flex items-center justify-center mb-4 border border-blue-100">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">รับเรื่อง & กรอกข้อมูลรถ</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              เข้าหน้า <strong>New Case</strong> กรอกข้อมูลลูกค้า ยี่ห้อ รุ่นรถ และอาการ หรือใช้ปุ่ม <strong>⚡ Quick Demo Template</strong> เพื่อจำลองเคสตัวอย่างในคลิกเดียว
            </p>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-medium">
              💡 ทริค: เลือกเคสเบรกแตกเพื่อทดสอบระบบเตือนด่วนสีแดง
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-base flex items-center justify-center mb-4 border border-emerald-100">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">AI ตรวจสอบ & ประเมินราคา</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              กดปุ่ม <strong>Analyze Problem</strong> เพื่อให้ Gemini จัดหมวดหมู่อาการ ประเมินระดับความด่วน (Urgency) พร้อมออกราคาและระยะเวลาซ่อมเบื้องต้น
            </p>
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 font-medium">
              💰 ได้รับราคาประเมินและ Follow-up questions ทันที
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden group hover:border-purple-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 font-extrabold text-base flex items-center justify-center mb-4 border border-purple-100">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">จัดการเคส & พิมพ์ใบรับรถ</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              อัปเดตสถานะงาน (รับเคส / ปิดงาน) ในหน้า <strong>Dashboard</strong> หรือเปิดหน้า <strong>Case Details</strong> เพื่อกดพิมพ์ใบรับรถ (PDF) หน้าร้าน
            </p>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-800 font-medium">
              🖨️ ออกใบ Service Intake Sheet พร้อมช่องเซ็นชื่อ
            </div>
          </div>
        </div>
      </div>

      {/* Urgency Classification Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">เกณฑ์การจัดระดับความด่วน (Urgency Matrix)</h3>
            <p className="text-xs text-slate-500">AI จะจัดระดับความด่วนของเคสตามระดับความเสี่ยงด้านความปลอดภัย</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-6 py-3.5 text-left">ระดับความด่วน (Urgency)</th>
                <th className="px-6 py-3.5 text-left">ลักษณะอาการ</th>
                <th className="px-6 py-3.5 text-left">ตัวอย่างเคส</th>
                <th className="px-6 py-3.5 text-left">การดำเนินการของระบบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-700 font-bold border border-red-500/20">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-glow" />
                    HIGH (ฉุกเฉิน)
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">
                  เสี่ยงต่อความปลอดภัยขณะขับขี่ หรืออาจเกิดความเสียหายรุนแรงต่อเครื่องยนต์
                </td>
                <td className="px-6 py-4 text-slate-600">
                  เบรกไม่อยู่, พวงมาลัยล็อค, ควัน/กลิ่นไหม้, น้ำมันรั่วหยดหนัก
                </td>
                <td className="px-6 py-4 text-red-700 font-bold">
                  🚨 แจ้งเตือน Discord สีแดง + แท็ก @everyone + แจ้งพนักงานทันที
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 font-bold border border-amber-500/20">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    MEDIUM (ปานกลาง)
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">
                  รถยังพอขับได้ แต่ประสิทธิภาพลดลง ควรรีบนำเข้าตรวจสอบใน 1-3 วัน
                </td>
                <td className="px-6 py-4 text-slate-600">
                  ไฟ Check Engine โชว์, สตาร์ทติดยาก, เครื่องสั่นตอนเร่งความเร็ว
                </td>
                <td className="px-6 py-4 text-amber-700 font-bold">
                  ⚠️ แจ้งเตือน Discord สีส้ม + แนะนำคิวตรวจสอบช่าง
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    LOW (ปกติ)
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">
                  งานบำรุงรักษาตามรอบ หรือปัญหาความสะดวกสบายทั่วไป
                </td>
                <td className="px-6 py-4 text-slate-600">
                  แอร์ไม่เย็น, เช็คระยะ 40,000 กม., เปลี่ยนถ่ายน้ำมันเครื่อง, เสียงพลาสติก
                </td>
                <td className="px-6 py-4 text-emerald-700 font-bold">
                  🟢 แจ้งเตือน Discord สีเขียว + นัดหมายตามความสะดวก
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">ฟีเจอร์หลักทั้งหมดของระบบ (System Features)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">⚡ 1-Click Demo Templates</h3>
            <p className="text-xs text-slate-500">
              ปุ่มกดกรอกเคสตัวอย่าง 4 ระดับความด่วน ช่วยให้ทดสอบและนำเสนอให้กรรมการดูได้อย่างรวดเร็ว
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">💰 AI Cost & Repair Time Estimator</h3>
            <p className="text-xs text-slate-500">
              ประเมินราคาซ่อม (ค่าอะไหล่ + ค่าแรง) และชั่วโมงการซ่อมเบื้องต้นอัตโนมัติด้วย AI
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3">
              <Printer className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">🖨️ Service Intake Sheet (PDF)</h3>
            <p className="text-xs text-slate-500">
              พิมพ์ใบสรุปรายงานรับรถทางการ พร้อม Service Checklist และช่องเซ็นชื่อลูกค้ารับบริการ
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl w-fit mb-3">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">🔔 Real-time Discord Alerts</h3>
            <p className="text-xs text-slate-500">
              ส่งแจ้งเตือนการ์ด Rich Embed สีสันสดใสตามความด่วนเข้ากลุ่มช่างทันทีที่มีเคสใหม่
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl w-fit mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">🤖 Gemini 3.6 Flash Engine</h3>
            <p className="text-xs text-slate-500">
              โมเดลประมวลผลเร็ว สกัดอาการ วิเคราะห์สาเหตุ และสร้างคำถามติดตามอาการ (Follow-up)
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">📊 Firebase & Audit Logs</h3>
            <p className="text-xs text-slate-500">
              บันทึกข้อมูลเคสลง Firestore พร้อมหน้าตรวจสอบประวัติการทำงานของระบบอัตโนมัติ 100%
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-extrabold text-slate-900">คำถามที่พบบ่อย (FAQ & Technical Support)</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
