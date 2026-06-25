export function LoadingSpinner({ label = 'Loading SmartConnect data...' }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-slate-500">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
