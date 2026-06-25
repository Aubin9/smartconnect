export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function safeNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function probabilityToStatus(probability: number) {
  if (probability >= 0.85) return 'critical';
  if (probability >= 0.75) return 'danger';
  if (probability >= 0.6) return 'warning';
  return 'healthy';
}
