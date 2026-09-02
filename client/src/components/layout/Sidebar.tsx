import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Activity, BookOpen, Settings, Wrench, ShieldCheck, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', badge: 'Live' },
  { to: '/new-case', icon: PlusCircle, label: 'New Case', highlight: true },
  { to: '/automation-logs', icon: Activity, label: 'Automation Logs' },
  { to: '/guide', icon: BookOpen, label: 'User Guide' },
  { to: '/settings', icon: Settings, label: 'Settings & Webhook' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0f1d] text-white flex flex-col z-40 print:hidden border-r border-slate-800/80 shadow-xl">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20 ring-1 ring-white/20">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-white">AutoTech AI</h1>
              <span className="bg-blue-500/20 text-blue-400 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Service Triage Engine</p>
          </div>
        </div>

        {/* Live System Status Pill */}
        <div className="mt-4 flex items-center justify-between px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px]">
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
            AI Workflow
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Ready
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map(({ to, icon: Icon, label, badge, highlight }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 font-bold'
                  : highlight
                  ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:text-white border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
            {badge && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User / Advisor Widget Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Service Advisor</p>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-blue-400 inline" /> Center Frontdesk #01
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

