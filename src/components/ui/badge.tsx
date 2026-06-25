import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

type BadgeProps = {
  children: ReactNode;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
};

const tones = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300',
  danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300',
  info: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200'
};

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1', tones[tone], className)}>{children}</span>;
}
