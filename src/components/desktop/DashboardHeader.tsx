'use client';

import { Bell, RefreshCw, Search, SunMoon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { LogoutButton } from '@/components/common/LogoutButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WAT_TIME_ZONE } from '@/lib/utils/constants';

export function DashboardHeader({ pendingAlerts = 0 }: { pendingAlerts?: number }) {
  const [time, setTime] = useState(new Date());
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const wat = new Intl.DateTimeFormat('en-CM', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: WAT_TIME_ZONE
  }).format(time);

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <p className="text-sm font-bold text-emerald-600">Live platform status: operational</p>
        </div>
        <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">SmartConnect Command Center</h1>
        <p className="text-sm text-slate-500">Cameroon time (WAT): {wat}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden w-72 md:block">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search cells, MSISDN, tickets..." aria-label="Search" />
        </div>
        <Button variant="outline" size="md" onClick={() => location.reload()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="md" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
          <SunMoon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="md" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {pendingAlerts > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-brand-danger px-1.5 py-0.5 text-[10px] font-black text-white">{pendingAlerts}</span>}
        </Button>
        <LogoutButton className="hidden sm:inline-flex" />
      </div>
    </header>
  );
}
