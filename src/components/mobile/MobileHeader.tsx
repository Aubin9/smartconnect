import { LogoutButton } from '@/components/common/LogoutButton';
import { Logo } from '@/components/common/Logo';

export function MobileHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:hidden">
      <div className="flex items-center justify-between">
        <Logo compact />
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-black text-slate-900 dark:text-white">{title}</p>
            <p className="text-[11px] text-emerald-600">Live network</p>
          </div>
          <LogoutButton compact className="h-9 px-3" />
        </div>
      </div>
    </header>
  );
}
