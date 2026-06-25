import Link from 'next/link';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

export function Logo({ compact = false, inverted = false, className }: { compact?: boolean; inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-teal text-white shadow-card">
        <Activity className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
      </div>
      {!compact && (
        <div>
          <p className={cn('text-lg font-black leading-none', inverted ? 'text-white' : 'text-slate-950 dark:text-white')}>SmartConnect</p>
          <p className={cn('text-xs font-semibold', inverted ? 'text-cyan-100' : 'text-brand-teal')}>Intelligent Network. Smarter You.</p>
        </div>
      )}
    </Link>
  );
}
