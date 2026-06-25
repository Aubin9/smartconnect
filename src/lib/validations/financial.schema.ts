import { z } from 'zod';

export const creditRequestSchema = z.object({
  subscriberId: z.string().min(1),
  amount: z.number().positive().max(500),
  reason: z.string().min(4),
  degradationMinutes: z.number().int().positive().optional(),
  congestionProbability: z.number().min(0).max(1).optional()
});

export const loanRequestSchema = z.object({
  subscriberId: z.string().min(1),
  amount: z.number().positive().max(25000),
  termWeeks: z.number().int().min(1).max(12).default(4)
});

export const insuranceActionSchema = z.object({
  subscriberId: z.string().min(1),
  action: z.enum(['OPT_IN', 'OPT_OUT', 'CLAIM']),
  outageHours: z.number().optional()
});
