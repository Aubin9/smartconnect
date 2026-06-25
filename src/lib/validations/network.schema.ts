import { z } from 'zod';

export const kpiQuerySchema = z.object({
  region: z.string().optional(),
  operator: z.string().optional(),
  limit: z.coerce.number().int().positive().max(500).default(120)
});

export const predictionInputSchema = z.object({
  cellId: z.string().min(2),
  timestamp: z.coerce.date().optional(),
  kpis: z.object({
    rsrp: z.number().min(-140).max(-40).optional(),
    sinr: z.number().min(-20).max(50).optional(),
    prbUtilization: z.number().min(0).max(100).optional(),
    throughputMbps: z.number().min(0).optional()
  })
});

export const cellQuerySchema = z.object({
  region: z.string().optional(),
  operator: z.string().optional()
});
