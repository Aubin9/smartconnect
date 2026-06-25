import { z } from 'zod';

export const subscriberSearchSchema = z.object({
  query: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25)
});

export const simulateActionSchema = z.object({
  trigger: z.enum(['QUALITY_DEGRADED', 'OUTAGE_3H', 'ZERO_BALANCE', 'SME_LOAN', 'ROAMING', 'FAMILY_BUNDLE_LOW']),
  throughputMbps: z.number().optional(),
  outageHours: z.number().optional(),
  balanceXaf: z.number().optional(),
  roaming: z.boolean().optional(),
  sharedBundlePercent: z.number().optional()
});
