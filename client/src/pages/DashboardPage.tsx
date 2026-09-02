import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, AlertTriangle, Clock, CheckCircle2, FileText, Search, Filter, ArrowRight, Play, Check } from 'lucide-react';
import { StatsCard } from '../components/ui/StatsCard';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Toast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';
import { getDashboardStats, getCases, updateCaseStatus } from '../services/api';
import type { ServiceCase, DashboardStats, ProblemCategory, UrgencyLevel, CaseStatus } from '../types';

const CATEGORIES: ProblemCategory[] = ['Engine', 'Transmission', 'Brake', 'Suspension', 'Electrical', 'Air Conditioning', 'Steering', 'Tire', 'Warning Light', 'Body', 'Other'];
const URGENCIES: UrgencyLevel[] = ['HIGH', 'MEDIUM', 'LOW'];
const STATUSES: CaseStatus[] = ['NEW', 'IN_REVIEW', 'ASSIGNED', 'COMPLETED'];

function formatDateTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} น.`;
  } catch {
    return dateStr;
  }
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<ServiceCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, casesData] = await Promise.all([
        getDashboardStats(),
        getCases({
          search: search || undefined,
          category: filterCategory || undefined,
          urgency: filterUrgency || undefined,
          status: filterStatus || undefined,
        }),
      ]);
      setStats(statsData);
      // Sort: HIGH first, then MEDIUM, then LOW
      const urgencyOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      casesData.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
      setCases(casesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (e: React.MouseEvent, caseId: string, newStatus: CaseStatus) => {
    e.stopPropagation();
    try {
      await updateCaseStatus(caseId, newStatus);
      setToast({ message: `อัปเดตสถานะเป็น ${newStatus.replace('_', ' ')} สำเร็จ`, type: 'success' });
      fetchData();
    } catch {
      setToast({ message: 'ไม่สามารถอัปเดตสถานะได้', type: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterCategory, filterUrgency, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Failed to load dashboard</h3>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Service Advisor Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time AI Problem Classification & Service Intake Pipeline
          </p>
        </div>
        <button
          onClick={() => navigate('/new-case')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg cursor-pointer"
        >
          <span>+ New Case Intake</span>
        </button>
      </div>

      {/* Metric Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Cases"
            value={stats.total}
            icon={<FileText className="h-5 w-5" />}
            color="text-blue-600"
            bgColor="bg-blue-50"
            badge="All-time"
          />
          <StatsCard
            title="New Cases"
            value={stats.newCases}
            icon={<BarChart3 className="h-5 w-5" />}
            color="text-sky-600"
            bgColor="bg-sky-50"
            badge="Pending"
            badgeClass="bg-sky-100 text-sky-700"
          />
          <StatsCard
            title="High Priority"
            value={stats.highPriority}
            icon={<AlertTriangle className="h-5 w-5" />}
            color="text-red-600"
            bgColor="bg-red-50"
            badge="Action Required"
            badgeClass="bg-red-100 text-red-700 font-bold"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Clock className="h-5 w-5" />}
            color="text-amber-600"
            bgColor="bg-amber-50"
            badge="Working"
            badgeClass="bg-amber-100 text-amber-700"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle2 className="h-5 w-5" />}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
            badge="Closed"
            badgeClass="bg-emerald-100 text-emerald-700"
          />
        </div>
      )}

      {/* Search & Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, vehicle, or symptom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-slate-400 pl-1">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Urgency</option>
              {URGENCIES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            {(search || filterCategory || filterUrgency || filterStatus) && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilterCategory('');
                  setFilterUrgency('');
                  setFilterStatus('');
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cases Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Recent Service Cases</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
              {cases.length} cases
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click row to view full AI triage details</span>
        </div>

        {cases.length === 0 ? (
          <EmptyState title="No cases found" description="Try adjusting your filters or create a new case intake." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">Customer</th>
                  <th className="px-6 py-3.5 text-left">Vehicle Details</th>
                  <th className="px-6 py-3.5 text-left">Category</th>
                  <th className="px-6 py-3.5 text-left">Urgency Level</th>
                  <th className="px-6 py-3.5 text-left">Workflow Status</th>
                  <th className="px-6 py-3.5 text-left">Intake Time</th>
                  <th className="px-6 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => {
                  const initials = c.customerName.trim().slice(0, 2).toUpperCase();
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {c.customerName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">{c.phoneNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-slate-900">{c.vehicleModel}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.vehicleYear} • {c.mileage ? `${c.mileage.toLocaleString()} km` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="category" value={c.category}>{c.category}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="urgency" value={c.urgency}>{c.urgency}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="status" value={c.status}>{c.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {formatDateTime(c.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {c.status === 'NEW' && (
                            <button
                              onClick={(e) => handleQuickStatusChange(e, c.id, 'IN_REVIEW')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 transition-all cursor-pointer shadow-2xs"
                              title="รับเคส (In Review)"
                            >
                              <Play className="h-3 w-3 fill-purple-600" />
                              รับเคส
                            </button>
                          )}
                          {c.status === 'IN_REVIEW' && (
                            <button
                              onClick={(e) => handleQuickStatusChange(e, c.id, 'COMPLETED')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-all cursor-pointer shadow-2xs"
                              title="ปิดงาน (Complete)"
                            >
                              <Check className="h-3 w-3 text-emerald-600" />
                              ปิดงาน
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/cases/${c.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                            title="ดูรายละเอียดเคส"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


