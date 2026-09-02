import { useState, useMemo } from 'react';
import {
  Search,
  Database,
  Filter,
  AlertTriangle,
  HelpCircle,
  Wrench,
  BookOpen,
  DollarSign,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import hondaData from '../data/honda_knowledge.json';

interface KnowledgeItem {
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

export function SearchKnowledgePage() {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'price' | 'aiRules' | 'sources'>('knowledge');
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const knowledgeItems = hondaData.knowledge as KnowledgeItem[];
  const priceGuides = hondaData.priceGuide as Array<{ รายการ: string; กลุ่มรถ: string; 'ช่วงราคาโดยประมาณ (บาท)': string; หมายเหตุ: string }>;
  const aiUsageGuides = hondaData.aiUsageGuide as Array<{ หัวข้อ: string; คำอธิบาย: string }>;
  const sources = hondaData.sources as Array<{ แหล่งข้อมูล: string; URL: string; ข้อมูลที่นำมาใช้: string; หมายเหตุ: string }>;

  // Extract unique models & categories
  const models = useMemo(() => {
    const set = new Set<string>();
    knowledgeItems.forEach(item => {
      if (item.รุ่นรถ) set.add(item.รุ่นรถ);
    });
    return Array.from(set).sort();
  }, [knowledgeItems]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    knowledgeItems.forEach(item => {
      if (item.หมวดปัญหา) set.add(item.หมวดปัญหา);
    });
    return Array.from(set).sort();
  }, [knowledgeItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return knowledgeItems.filter(item => {
      if (selectedModel !== 'All' && item.รุ่นรถ !== selectedModel && item.รุ่นรถ !== 'ทุกรุ่น') {
        return false;
      }
      if (selectedCategory !== 'All' && item.หมวดปัญหา !== selectedCategory) {
        return false;
      }
      if (selectedUrgency !== 'All' && item.ระดับความเร่งด่วน.toUpperCase() !== selectedUrgency) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        const fullText = [
          item.ID,
          item.รุ่นรถ,
          item.หมวดปัญหา,
          item['อาการ/สิ่งที่ลูกค้าแจ้ง'],
          item['สาเหตุที่เป็นไปได้ทั้งหมด'],
          item['คำค้น/Keyword สำหรับ AI'],
          item.วิธีแก้ไขเบื้องต้น,
        ].join(' ').toLowerCase();

        return fullText.includes(query);
      }
      return true;
    });
  }, [knowledgeItems, selectedModel, selectedCategory, selectedUrgency, search]);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toUpperCase()) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            HIGH 🚨
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
            MEDIUM ⚠️
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
            LOW 🟦
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Honda_Search_Knowledge_AI_Car_Problem</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-400" />
              Search Knowledge Base
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              คลังความรู้อาการเสีย รถยนต์ Honda และแนวทางแก้ไขสำหรับ AI (RAG Priority Knowledge Source) รวม 258 รายการ
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Knowledge</p>
              <p className="text-2xl font-extrabold text-blue-300">{knowledgeItems.length}</p>
            </div>
            <div className="px-4 py-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Honda Models</p>
              <p className="text-2xl font-extrabold text-emerald-300">{models.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'knowledge'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Honda Knowledge (258 รายการ)</span>
        </button>
        <button
          onClick={() => setActiveTab('price')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'price'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>ตารางราคาประมาณการ (Price Guide)</span>
        </button>
        <button
          onClick={() => setActiveTab('aiRules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'aiRules'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>หลักการค้นหาของ AI (AI Rules)</span>
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'sources'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ExternalLink className="h-4 w-4" />
          <span>แหล่งอ้างอิง (Sources)</span>
        </button>
      </div>

      {/* Tab 1: Knowledge Search */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาอาการเสีย, รหัส HONDA-0001, รุ่นรถ (City, Civic, CR-V), คำค้น หรือวิธีแก้..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Filter className="h-3.5 w-3.5 text-blue-600" />
                  <span>ตัวกรอง:</span>
                </div>
                {/* Model Filter */}
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="All">🚗 ทุกรุ่นรถ (All Models)</option>
                  {models.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="All">📂 ทุกหมวดปัญหา (All Categories)</option>
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Urgency Filter */}
                <select
                  value={selectedUrgency}
                  onChange={e => setSelectedUrgency(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="All">🚦 ทุกความรุนแรง (All Urgency)</option>
                  <option value="HIGH">HIGH (สูงมาก 🚨)</option>
                  <option value="MEDIUM">MEDIUM (ปานกลาง ⚠️)</option>
                  <option value="LOW">LOW (ปกติ 🟦)</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                พบ <strong className="text-blue-600 font-bold">{filteredItems.length}</strong> จาก {knowledgeItems.length} รายการ
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div
                key={item.ID}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.ID}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {item.รุ่นรถ}
                      </span>
                      {getUrgencyBadge(item.ระดับความเร่งด่วน)}
                    </div>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item['อาการ/สิ่งที่ลูกค้าแจ้ง']}
                  </h3>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    <strong className="text-slate-700 font-bold">สาเหตุ:</strong> {item.สาเหตุที่เป็นไปได้ทั้งหมด}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    💰 {item['ช่วงราคาประเมินเบื้องต้น (บาท)']}
                  </span>
                  <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    รายละเอียด <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Price Guide */}
      {activeTab === 'price' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">ตารางราคาประมาณการซ่อมบำรุง Honda (Price Guide)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="px-4 py-3 text-left">รายการอะไหล่ / งานซ่อม</th>
                  <th className="px-4 py-3 text-left">กลุ่มรถยนต์ Honda</th>
                  <th className="px-4 py-3 text-left">ช่วงราคาโดยประมาณ (บาท)</th>
                  <th className="px-4 py-3 text-left">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {priceGuides.map((pg, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{pg.รายการ}</td>
                    <td className="px-4 py-3 text-slate-600">{pg.กลุ่มรถ}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{pg['ช่วงราคาโดยประมาณ (บาท)']}</td>
                    <td className="px-4 py-3 text-slate-500">{pg.หมายเหตุ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AI Rules */}
      {activeTab === 'aiRules' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">หลักการทำงานและการลำดับความสำคัญของ AI (AI Usage Rules)</h2>
          </div>
          <div className="space-y-4">
            {aiUsageGuides.map((guide, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h3 className="text-xs font-bold text-blue-900 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                  {guide.หัวข้อ}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-5">{guide.คำอธิบาย}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Sources */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ExternalLink className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">แหล่งข้อมูลอ้างอิงออฟฟิเชียล (Official Honda Sources)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{src.แหล่งข้อมูล}</h3>
                  <a href={src.URL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[11px] font-semibold flex items-center gap-1">
                    เปิดลิงก์ <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600">{src.ข้อมูลที่นำมาใช้}</p>
                <p className="text-[10px] text-slate-400">{src.หมายเหตุ}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                  {selectedItem.ID}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  Honda {selectedItem.รุ่นรถ}
                </span>
                {getUrgencyBadge(selectedItem.ระดับความเร่งด่วน)}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">อาการที่ลูกค้าแจ้ง</span>
                <h2 className="text-base font-extrabold text-slate-900 mt-1">{selectedItem['อาการ/สิ่งที่ลูกค้าแจ้ง']}</h2>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-blue-600" />
                  สาเหตุที่เป็นไปได้ทั้งหมด:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">{selectedItem.สาเหตุที่เป็นไปได้ทั้งหมด}</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                  สิ่งที่ควรตรวจสอบ / คำถามเพิ่มเติมสำหรับ Service Advisor:
                </span>
                <p className="text-xs text-blue-800 leading-relaxed pt-1">{selectedItem['สิ่งที่ควรตรวจสอบ/คำถามเพิ่มเติม']}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-emerald-600" />
                  วิธีแก้ไขเบื้องต้น / คำแนะนำ:
                </span>
                <p className="text-xs text-emerald-800 leading-relaxed pt-1">{selectedItem.วิธีแก้ไขเบื้องต้น}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-100 text-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">ช่วงราคาประเมินเบื้องต้น</span>
                  <p className="text-sm font-extrabold text-emerald-600">฿ {selectedItem['ช่วงราคาประเมินเบื้องต้น (บาท)']}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-100 text-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">คำค้น / Keywords</span>
                  <p className="text-xs font-semibold text-slate-700 truncate">{selectedItem['คำค้น/Keyword สำหรับ AI']}</p>
                </div>
              </div>

              {selectedItem.หมายเหตุ && (
                <p className="text-[11px] text-slate-400 italic pt-1">
                  หมายเหตุ: {selectedItem.หมายเหตุ}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
