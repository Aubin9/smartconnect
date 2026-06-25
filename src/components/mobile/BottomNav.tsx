'use client';

import { BarChart3, Bell, CreditCard, Home, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOBILE_NAVIGATION } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/helpers';

const icons = { Home, BarChart3, CreditCard, Bell, UserCircle };

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_NAVIGATION.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons];
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn('flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold transition', active ? 'bg-brand-blue text-white' : 'text-slate-500')}>
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.label === 'Alerts' && <span className="absolute mt-[-4px] ml-8 rounded-full bg-brand-danger px-1 text-[9px] text-white">3</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
