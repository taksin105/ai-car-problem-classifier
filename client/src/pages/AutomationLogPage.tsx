import { useEffect, useState } from 'react';
import { Activity, CheckCircle, XCircle, Clock, Cpu, Database, Webhook, Bell, RefreshCw } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { getAutomationLogs } from '../services/api';
import type { AutomationLog } from '../types';

export function AutomationLogPage() {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getAutomationLogs();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getEventIcon = (event: string) => {
    if (event.includes('AI')) return <Cpu className="h-3.5 w-3.5 text-blue-500" />;
    if (event.includes('Firestore') || event.includes('Saved')) return <Database className="h-3.5 w-3.5 text-emerald-500" />;
    if (event.includes('Workflow') || event.includes('n8n')) return <Webhook className="h-3.5 w-3.5 text-purple-500" />;
    if (event.includes('Notified') || event.includes('Advisor')) return <Bell className="h-3.5 w-3.5 text-amber-500" />;
    return <Activity className="h-3.5 w-3.5 text-slate-500" />;
  };

  const successCount = logs.filter(l => l.status === 'SUCCESS').length;
  const failCount = logs.filter(l => l.status === 'FAILED').length;
  const successRate = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 100;

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Automation Workflow Logs</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time audit trail of all AI analysis, database operations, and notification triggers</p>
        </div>
        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Automation Events</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{logs.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Success Rate</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{successRate}%</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {successCount} Succeeded
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Failed Events</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{failCount}</span>
            {failCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                Check credentials
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Event Stream</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
              {logs.length} events
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Sorted by newest first</span>
        </div>

        {error ? (
          <div className="p-8 text-center text-xs text-red-600 font-medium">{error}</div>
        ) : logs.length === 0 ? (
          <EmptyState title="No automation logs" description="Logs will appear here when cases are processed" icon={<Activity className="h-16 w-16" />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">Timestamp</th>
                  <th className="px-6 py-3.5 text-left">Workflow Event</th>
                  <th className="px-6 py-3.5 text-left">Target Case ID</th>
                  <th className="px-6 py-3.5 text-left">Execution Status</th>
                  <th className="px-6 py-3.5 text-left">Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 text-xs text-slate-500 whitespace-nowrap font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {new Date(log.timestamp).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'medium' })}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-bold text-slate-800">
                        {getEventIcon(log.event)}
                        <span>{log.event}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs font-mono text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {log.caseId.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-700 border-red-500/20'
                      }`}>
                        {log.status === 'SUCCESS' ? (
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-600" />
                        )}
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs font-medium text-slate-600">
                      {log.details || <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

