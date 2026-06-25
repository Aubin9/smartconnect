import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/desktop/Sidebar';
import { DashboardHeader } from '@/components/desktop/DashboardHeader';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { requireSession } from '@/lib/auth/middleware';
import { networkService } from '@/lib/services/network.service';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  if (session.user.role === 'SUBSCRIBER') redirect('/mobile');
  const stats = await networkService.getDashboardStats();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <DashboardHeader pendingAlerts={stats.pendingAlerts} />
          <ErrorBoundary>
            <div className="mx-auto max-w-[1800px] p-4 pb-10 lg:p-8">{children}</div>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
