import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Radio } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Service Advisor Dashboard';
    if (location.pathname === '/new-case') return 'Customer Intake & AI Triage';
    if (location.pathname.startsWith('/cases/')) return 'Case Investigation & Report';
    if (location.pathname === '/automation-logs') return 'Workflow & Automation Logs';
    if (location.pathname === '/guide') return 'Operations Manual & User Guide';
    if (location.pathname === '/settings') return 'System & Webhook Settings';
    return 'AI Service Assistant';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 print:bg-white print:min-h-0">
      <Sidebar />
      <div className="ml-64 print:ml-0 flex flex-col min-h-screen">
        {/* Sleek Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Portal /</span>
            <span className="text-xs font-bold text-slate-800">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Webhook Status Pill (Clickable) */}
            <a
              href="/settings"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
              title="คลิกเพื่อกำหนดหรือเปลี่ยน Discord Webhook URL"
            >
              <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
              <span>Discord Alert: Connected</span>
            </a>

            <div className="h-4 w-[1px] bg-slate-200" />

            {/* Notification Icon */}
            <div className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

