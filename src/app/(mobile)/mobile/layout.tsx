import type { ReactNode } from "react";
import { BottomNav } from "@/components/mobile/BottomNav";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { requireSession } from "@/lib/auth/middleware";
export const dynamic = "force-dynamic";
export default async function MobileLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSession();
  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-950 md:pb-8">
      <MobileHeader title="Subscriber portal" />
      <main className="mx-auto w-full max-w-2xl px-4 py-4 md:max-w-5xl">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
