'use client';

import { useQuery } from '@tanstack/react-query';

export function useTransactions(subscriberId?: string) {
  return useQuery({
    queryKey: ['transactions', subscriberId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (subscriberId) params.set('subscriberId', subscriberId);
      const res = await fetch(`/api/financial/transactions?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load transactions');
      return res.json();
    }
  });
}
