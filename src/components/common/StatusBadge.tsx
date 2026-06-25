import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes('critical') || normalized.includes('failed') || normalized.includes('danger')
    ? 'danger'
    : normalized.includes('warning') || normalized.includes('pending')
      ? 'warning'
      : normalized.includes('complete') || normalized.includes('approved') || normalized.includes('active') || normalized.includes('success')
        ? 'success'
        : 'neutral';

  return <Badge tone={tone}>{status.replaceAll('_', ' ')}</Badge>;
}
