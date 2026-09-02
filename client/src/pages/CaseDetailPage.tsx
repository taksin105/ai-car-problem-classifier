import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Printer, Car } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Toast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { getCaseById, updateCaseStatus, getAutomationLogs } from '../services/api';
import type { ServiceCase, CaseStatus, AutomationLog } from '../types';

const STATUS_OPTIONS: CaseStatus[] = ['NEW', 'IN_REVIEW', 'ASSIGNED', 'COMPLETED'];

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<ServiceCase | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [statusDialog, setStatusDialog] = useState<{ open: boolean; status: CaseStatus | null }>({ open: false, status: null });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [c, l] = await Promise.all([
          getCaseById(id),
          getAutomationLogs(id),
        ]);
        setCaseData(c);
        setLogs(l);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async () => {
    if (!id || !statusDialog.status) return;
    try {
      const updated = await updateCaseStatus(id, statusDialog.status);
      setCaseData(updated);
      setToast({ message: `Status updated to ${statusDialog.status}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    } finally {
      setStatusDialog({ open: false, status: null });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Spinner size="lg" /></div>;
  if (error || !caseData) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Case not found</h3>
          <p className="text-sm text-gray-500 mt-1">{error || 'The requested case could not be found'}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog
        isOpen={statusDialog.open}
        title="Update Status"
        message={`Are you sure you want to change the status to ${statusDialog.status?.replace('_', ' ')}?`}
        onConfirm={handleStatusChange}
        onCancel={() => setStatusDialog({ open: false, status: null })}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200/80 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200 text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Case Investigation</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {caseData.id.slice(0, 12)}...
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Intake registered on {new Date(caseData.createdAt).toLocaleString('th-TH')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="urgency" value={caseData.urgency}>{caseData.urgency}</Badge>
          <Badge variant="status" value={caseData.status}>{caseData.status.replace('_', ' ')}</Badge>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 bg-white text-slate-700 hover:text-blue-600 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="พิมพ์หรือบันทึกเป็น PDF"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header (visible only on print) */}
      <div className="hidden print:block mb-8 border-b-2 border-gray-800 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Car className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Service Center</h1>
              <p className="text-xs text-gray-500">Vehicle Problem Classification & Service Intake Report</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p><strong>Case ID:</strong> {caseData.id.slice(0, 13)}...</p>
            <p><strong>Date:</strong> {new Date(caseData.createdAt).toLocaleString('th-TH')}</p>
            <p><strong>Status:</strong> {caseData.status}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Vehicle */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Customer & Vehicle Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Customer Name</span>
                <span className="font-bold text-slate-900 text-sm">{caseData.customerName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Contact Phone</span>
                <span className="font-bold text-slate-900 text-sm">{caseData.phoneNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Vehicle Model & Year</span>
                <span className="font-bold text-slate-900 text-sm">{caseData.vehicleModel} ({caseData.vehicleYear})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Current Odometer</span>
                <span className="font-bold text-slate-900 text-sm">{caseData.mileage ? `${caseData.mileage.toLocaleString()} km` : 'N/A'}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Reported Problem (อาการที่ลูกค้าแจ้ง)
              </span>
              <p className="text-xs font-medium text-slate-800 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                {caseData.problemDescription}
              </p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Diagnostic Assessment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="text-center p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Category</p>
                <Badge variant="category" value={caseData.category}>{caseData.category}</Badge>
              </div>
              <div className="text-center p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Urgency</p>
                <Badge variant="urgency" value={caseData.urgency}>{caseData.urgency}</Badge>
              </div>
              <div className="text-center p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Confidence</p>
                <span className="text-lg font-extrabold text-blue-600">{Math.round(caseData.confidence * 100)}%</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Summary</h3>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">{caseData.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Symptoms</h3>
                <ul className="space-y-1.5">
                  {caseData.symptoms.map((s, i) => (
                    <li key={i} className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Possible Causes</h3>
                <ul className="space-y-1.5">
                  {caseData.possibleCauses.map((c, i) => (
                    <li key={i} className="text-xs font-medium text-slate-700 bg-amber-50/40 p-2 rounded-lg border border-amber-100/60">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Follow-up Questions</h3>
              <ul className="space-y-1.5">
                {caseData.followUpQuestions.map((q, i) => (
                  <li key={i} className="text-xs font-medium text-slate-800 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100/60 flex items-start gap-2">
                    <span className="font-bold text-blue-600">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-xl border border-blue-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">Advisor Recommendation</h3>
              <p className="text-xs font-semibold text-blue-950 leading-relaxed">{caseData.recommendation}</p>
            </div>

            {/* Print Only: Service Checklist & Signatures */}
            <div className="hidden print:block mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Service Advisor Checklist</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded-xs" />
                  <span>ตรวจสอบสภาพภายนอกตัวรถและระดับของเหลว</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded-xs" />
                  <span>สอบถามคำถามติดตามอาการกับลูกค้าครบถ้วน</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded-xs" />
                  <span>ประเมินเวลาและจัดคิวช่างผู้เชี่ยวชาญ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded-xs" />
                  <span>แจ้งประมาณการค่าใช้จ่ายเบื้องต้นแก่ลูกค้า</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mt-12 pt-4">
                <div className="text-center">
                  <div className="border-b border-gray-400 pb-8 mb-2" />
                  <p className="text-xs font-semibold text-gray-800">ลายมือชื่อลูกค้า (Customer Signature)</p>
                  <p className="text-[10px] text-gray-500">วันที่: ..... / ..... / ..........</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-gray-400 pb-8 mb-2" />
                  <p className="text-xs font-semibold text-gray-800">ลายมือชื่อ Service Advisor ผู้รับรถ</p>
                  <p className="text-[10px] text-gray-500">วันที่: ..... / ..... / ..........</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (hidden on print) */}
        <div className="space-y-6 print:hidden">
          {/* Status Management */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Status Management
            </h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status}
                  onClick={() => status !== caseData.status && setStatusDialog({ open: true, status })}
                  disabled={status === caseData.status}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    status === caseData.status
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{status.replace('_', ' ')}</span>
                    {status === caseData.status && <span>✓ Current</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Automation Timeline
            </h2>
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400">No automation logs for this case</p>
            ) : (
              <div className="space-y-4">
                {logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((log, i) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1 ring-4 ${log.status === 'SUCCESS' ? 'bg-emerald-500 ring-emerald-100' : 'bg-red-500 ring-red-100'}`} />
                      {i < logs.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-xs font-bold text-slate-900">{log.event}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString('th-TH', { timeStyle: 'medium' })}
                      </p>
                      {log.details && <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">{log.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

