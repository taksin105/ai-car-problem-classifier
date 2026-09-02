import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Car, User, Phone, Calendar, Gauge, Zap, Coins, Clock } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { Toast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { analyzeProblem } from '../services/api';
import type { CustomerInput, ServiceCase } from '../types';

const DEMO_TEMPLATES = [
  {
    title: '🚨 เบรกแตก / ไม่อยู่',
    badge: 'HIGH',
    badgeClass: 'bg-red-200 text-red-900',
    color: 'border-red-200 bg-red-50 hover:bg-red-100 text-red-900',
    data: {
      customerName: 'สมชาย รักเร็ว',
      phoneNumber: '081-999-1122',
      vehicleModel: 'Honda Civic Type R',
      vehicleYear: 2023,
      mileage: 45000,
      problemDescription: 'เหยียบเบรกแล้วมีเสียงดังเอี๊ยดรุนแรงและรู้สึกว่าเบรกไม่อยู่ รถมีอาการปัดเป๋ไปทางซ้ายอันตรายมาก',
    },
  },
  {
    title: '⚠️ แอร์ไม่เย็น มีแต่ลมร้อน',
    badge: 'MED',
    badgeClass: 'bg-amber-200 text-amber-900',
    color: 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900',
    data: {
      customerName: 'วิภา สดชื่น',
      phoneNumber: '089-888-2233',
      vehicleModel: 'Toyota Corolla Cross',
      vehicleYear: 2022,
      mileage: 35000,
      problemDescription: 'เปิดแอร์แล้วมีแต่ลมร้อนออกมา ไม่มีไอเย็นเลย และได้ยินเสียงหวีดเบาๆ จากช่องแอร์เวลาเร่งเครื่อง',
    },
  },
  {
    title: '⚠️ ไฟ Check Engine โชว์',
    badge: 'MED',
    badgeClass: 'bg-amber-200 text-amber-900',
    color: 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900',
    data: {
      customerName: 'กัญญา ใจดี',
      phoneNumber: '062-777-3344',
      vehicleModel: 'Mazda 3',
      vehicleYear: 2021,
      mileage: 58000,
      problemDescription: 'มีไฟเตือนรูปเครื่องยนต์สีส้มโชว์ค้างบนหน้าปัด และเวลาเร่งแซงรู้สึกว่าเครื่องยนต์มีอาการกระตุกและสะดุด',
    },
  },
  {
    title: '📋 เช็คระยะ / เสียงช่วงล่าง',
    badge: 'LOW',
    badgeClass: 'bg-green-200 text-green-900',
    color: 'border-green-200 bg-green-50 hover:bg-green-100 text-green-900',
    data: {
      customerName: 'ประเสริฐ มั่งมี',
      phoneNumber: '095-666-5544',
      vehicleModel: 'Nissan Almera',
      vehicleYear: 2024,
      mileage: 15000,
      problemDescription: 'ต้องการนำรถเข้าตรวจเช็คระยะตามรอบ 15,000 กม. และมีเสียงกุกๆ เบาๆ ใต้ท้องรถเวลาขับผ่านลูกระนาด',
    },
  },
];

export function CustomerInputPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [result, setResult] = useState<ServiceCase | null>(null);
  const [form, setForm] = useState<CustomerInput>({
    customerName: '',
    phoneNumber: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    mileage: 0,
    problemDescription: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Required';
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Required';
    if (!form.vehicleModel.trim()) newErrors.vehicleModel = 'Required';
    if (!form.vehicleYear || form.vehicleYear < 1900 || form.vehicleYear > new Date().getFullYear() + 1) newErrors.vehicleYear = 'Invalid year';
    if (form.mileage < 0) newErrors.mileage = 'Invalid mileage';
    if (!form.problemDescription.trim() || form.problemDescription.trim().length < 10) newErrors.problemDescription = 'Please describe the problem in detail (min 10 characters)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setResult(null);
      const serviceCase = await analyzeProblem(form);
      setResult(serviceCase);
      setToast({ message: 'Case created successfully!', type: 'success' });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'ไม่สามารถวิเคราะห์ข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CustomerInput, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  if (result) {
    // Show Analysis Result inline
    return (
      <div className="space-y-6">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                ✓ AI Analysis Completed
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {result.id.slice(0, 8)}...</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              Vehicle Triage & Diagnostic Report
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setResult(null);
                setForm({ customerName: '', phoneNumber: '', vehicleModel: '', vehicleYear: new Date().getFullYear(), mileage: 0, problemDescription: '' });
              }}
              className="px-4 py-2 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              + New Intake
            </button>
            <button
              onClick={() => navigate(`/cases/${result.id}`)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              View Full Details →
            </button>
          </div>
        </div>

        {/* Urgency Alert Banner */}
        {result.requiresImmediateAttention && (
          <div className="p-4 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/25 rounded-2xl flex items-center gap-3 shadow-xs">
            <span className="text-2xl">🚨</span>
            <div>
              <p className="text-sm font-bold text-red-900">High Priority Emergency Case Alert</p>
              <p className="text-xs text-red-700 font-medium">This vehicle exhibits critical symptoms that require immediate inspection before operation.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main AI Insights */}
          <div className="lg:col-span-2 space-y-5">
            {/* Scorecard */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                AI Classification & Triage
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Problem Category</p>
                  <Badge variant="category" value={result.category}>{result.category}</Badge>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Urgency Level</p>
                  <Badge variant="urgency" value={result.urgency}>{result.urgency}</Badge>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Confidence Score</p>
                  <span className="text-xl font-extrabold text-blue-600">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* AI Cost & Repair Time Estimation (NEW FEATURE) */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-sky-500/5 rounded-2xl border border-emerald-500/20 shadow-xs p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-2xs">
                    <Coins className="h-4 w-4" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                    💰 AI Cost & Repair Time Estimation (ประมาณการราคา & เวลาซ่อม)
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI Quoting Tool
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/90 border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                    <Coins className="h-3.5 w-3.5 text-emerald-600" />
                    <span>ประมาณการค่าใช้จ่ายเบื้องต้น (Est. Cost)</span>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-700">
                    {result.estimatedCost || '฿1,200 - ฿3,500 (ค่าอะไหล่ + ค่าแรง)'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">*ราคาอาจปรับเปลี่ยนตามยี่ห้ออะไหล่ที่ลูกค้าเลือก</p>
                </div>

                <div className="p-4 rounded-xl bg-white/90 border border-sky-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                    <Clock className="h-3.5 w-3.5 text-sky-600" />
                    <span>ระยะเวลาดำเนินการโดยประมาณ (Est. Time)</span>
                  </div>
                  <p className="text-lg font-extrabold text-sky-700">
                    {result.estimatedRepairTime || '1.5 - 2 ชั่วโมง'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">*ขึ้นอยู่กับความพร้อมของช่องซ่อมและอะไหล่</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Executive Problem Summary
              </h2>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">{result.summary}</p>
            </div>

            {/* Symptoms & Possible Causes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  🔍 Extracted Symptoms
                </h3>
                <ul className="space-y-2">
                  {result.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  ⚠️ Potential Root Causes
                </h3>
                <ul className="space-y-2">
                  {result.possibleCauses.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 bg-amber-50/50 px-3 py-2 rounded-lg border border-amber-100">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Follow-up Questions for Advisor */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                ❓ Recommended Follow-up Questions for Customer
              </h3>
              <div className="space-y-2">
                {result.followUpQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/80 text-xs font-medium text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/5 rounded-2xl border border-blue-200/80 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
                💡 AI Service Recommendation
              </h3>
              <p className="text-xs font-semibold text-blue-950 leading-relaxed">{result.recommendation}</p>
            </div>
          </div>

          {/* Customer & Case Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Customer & Vehicle Profile
              </h2>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Customer:</span>
                  <span className="font-bold text-slate-900">{result.customerName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-bold text-slate-900">{result.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Vehicle:</span>
                  <span className="font-bold text-slate-900">{result.vehicleModel} ({result.vehicleYear})</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Mileage:</span>
                  <span className="font-bold text-slate-900">{result.mileage ? `${result.mileage.toLocaleString()} km` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-3">
              <button
                onClick={() => navigate(`/cases/${result.id}`)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
              >
                Go to Case Details & Print
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 py-2.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-slate-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">New Service Case Intake</h1>
        <p className="text-xs text-slate-500 mt-1">Enter customer reported vehicle symptoms for instant AI classification</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Quick Demo Templates */}
        <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200/70 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-2xs">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950">
                ⚡ Quick Demo Templates (คลิกเดียวเพื่อจำลองเคสสำหรับนำเสนอ)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-blue-600">1-Click Auto Fill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DEMO_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setForm(tmpl.data);
                  setErrors({});
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer ${tmpl.color}`}
              >
                <span className="font-semibold">{tmpl.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${tmpl.badgeClass}`}>
                  {tmpl.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Step 1: Customer Info */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[11px] flex items-center justify-center">1</span>
                <span>Customer Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.customerName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                      placeholder="e.g., สมชาย มั่นใจ"
                    />
                  </div>
                  {errors.customerName && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                      placeholder="e.g., 081-234-5678"
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Vehicle Info */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[11px] flex items-center justify-center">2</span>
                <span>Vehicle Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vehicle Model *</label>
                  <div className="relative">
                    <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.vehicleModel}
                      onChange={(e) => handleChange('vehicleModel', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.vehicleModel ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                      placeholder="e.g., Honda Civic"
                    />
                  </div>
                  {errors.vehicleModel && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.vehicleModel}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" /> Year *
                  </label>
                  <input
                    type="number"
                    value={form.vehicleYear || ''}
                    onChange={(e) => handleChange('vehicleYear', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                    className={`w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.vehicleYear ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="2024"
                  />
                  {errors.vehicleYear && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.vehicleYear}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-slate-400" /> Mileage (km)
                  </label>
                  <input
                    type="number"
                    value={form.mileage === 0 ? '' : form.mileage}
                    onChange={(e) => handleChange('mileage', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                    className={`w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors.mileage ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    min="0"
                    placeholder="e.g., 45,000"
                  />
                  {errors.mileage && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.mileage}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: Problem Description */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[11px] flex items-center justify-center">3</span>
                <span>Problem Description (อาการที่พบ)</span>
              </h2>
              <div className="relative">
                <textarea
                  value={form.problemDescription}
                  onChange={(e) => handleChange('problemDescription', e.target.value)}
                  rows={4}
                  className={`w-full p-4 bg-slate-50/60 border rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed ${errors.problemDescription ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  placeholder='ระบุอาการรถ เช่น "เวลาเหยียบเบรกมีเสียงดังเอี๊ยดรุนแรงและรู้สึกว่าเบรกไม่อยู่"'
                />
              </div>
              {errors.problemDescription && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.problemDescription}</p>}
            </div>
          </div>

          {/* Submit Action */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400 font-medium">
              ✨ Instant AI Triage powered by Gemini 3.6 Flash
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 font-bold text-xs transition-all shadow-md shadow-blue-500/25 cursor-pointer hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>AI is Analyzing & Classifying...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Analyze Problem</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

