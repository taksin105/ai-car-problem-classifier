import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  badge?: string;
  badgeClass?: string;
}

export function StatsCard({ title, value, icon, color, bgColor, badge, badgeClass }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 p-5 group hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
          {badge && (
            <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass || 'bg-slate-100 text-slate-600'}`}>
              {badge}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor} transition-transform duration-300 group-hover:scale-110 shadow-2xs`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

