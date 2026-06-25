'use client';

import { Activity, BarChart3, Bot, ClipboardList, ExternalLink, Map, Menu, Settings, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { LogoutButton } from '@/components/common/LogoutButton';
import { Button } from '@/components/ui/button';
import { DASHBOARD_NAVIGATION } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/helpers';
import { useAppStore } from '@/lib/store/app-store';

const icons = { Activity, Map, Users, Wallet, Bot, Settings, ClipboardList, BarChart3 };

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  return (
    <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 lg:block', sidebarOpen ? 'w-80' : 'w-24')}>
      <div className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <Logo compact={!sidebarOpen} />
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-8 space-y-2">
          {DASHBOARD_NAVIGATION.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition',
                  active ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-card' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                )}
                title={item.label}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">USSD access</p>
            <p className="mt-2 mono text-lg font-black text-slate-900 dark:text-white">*123*55#</p>
            {sidebarOpen && <p className="mt-1 text-xs text-slate-500">Feature-phone flow for quality, credits and issue reports.</p>}
          </div>
          <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900" title="Public landing page">
            <ExternalLink className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Public landing page</span>}
          </Link>
          <LogoutButton compact={!sidebarOpen} className="w-full" />
        </div>
      </div>
    </aside>
  );
}
