import React from 'react';
import type { UrgencyLevel, CaseStatus } from '../../types';

const urgencyStyles: Record<UrgencyLevel, { bg: string; dot: string; text: string }> = {
  HIGH: {
    bg: 'bg-red-500/10 text-red-700 border-red-500/20 shadow-xs shadow-red-500/5',
    dot: 'bg-red-500 animate-pulse-glow',
    text: 'text-red-700 font-semibold',
  },
  MEDIUM: {
    bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20 shadow-xs shadow-amber-500/5',
    dot: 'bg-amber-500',
    text: 'text-amber-700 font-semibold',
  },
  LOW: {
    bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 shadow-xs shadow-emerald-500/5',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 font-semibold',
  },
};

const statusStyles: Record<CaseStatus, { bg: string; dot: string; text: string }> = {
  NEW: {
    bg: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    dot: 'bg-blue-500 animate-pulse-glow',
    text: 'text-blue-700 font-semibold',
  },
  IN_REVIEW: {
    bg: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    dot: 'bg-purple-500',
    text: 'text-purple-700 font-semibold',
  },
  ASSIGNED: {
    bg: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    dot: 'bg-orange-500',
    text: 'text-orange-700 font-semibold',
  },
  COMPLETED: {
    bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 font-semibold',
  },
};

const categoryColors: Record<string, string> = {
  Engine: 'bg-red-50 text-red-700 border-red-200/80',
  Transmission: 'bg-orange-50 text-orange-700 border-orange-200/80',
  Brake: 'bg-rose-50 text-rose-700 border-rose-200/80',
  Suspension: 'bg-amber-50 text-amber-700 border-amber-200/80',
  Electrical: 'bg-sky-50 text-sky-700 border-sky-200/80',
  'Air Conditioning': 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
  Steering: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  Tire: 'bg-slate-100 text-slate-700 border-slate-200',
  'Warning Light': 'bg-yellow-50 text-yellow-800 border-yellow-200/80',
  Body: 'bg-teal-50 text-teal-700 border-teal-200/80',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'urgency' | 'status' | 'category' | 'default';
  value?: string;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'default', value, className = '', dot = true }: BadgeProps) {
  if (variant === 'urgency' && value && urgencyStyles[value as UrgencyLevel]) {
    const style = urgencyStyles[value as UrgencyLevel];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${className}`}>
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
        <span className={style.text}>{children}</span>
      </span>
    );
  }

  if (variant === 'status' && value && statusStyles[value as CaseStatus]) {
    const style = statusStyles[value as CaseStatus];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${className}`}>
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
        <span className={style.text}>{children}</span>
      </span>
    );
  }

  if (variant === 'category' && value) {
    const colorClass = categoryColors[value] || 'bg-slate-100 text-slate-700 border-slate-200';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200 ${className}`}>
      {children}
    </span>
  );
}

