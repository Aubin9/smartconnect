'use client';

import { useQuery } from '@tanstack/react-query';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/network/kpi');
      if (!res.ok) throw new Error('Failed to load dashboard stats');
      return res.json();
    },
    refetchInterval: 5_000
  });
}

export function useCells(region?: string, operator?: string) {
  return useQuery({
    queryKey: ['cells', region, operator],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (region) params.set('region', region);
      if (operator) params.set('operator', operator);
      const res = await fetch(`/api/network/cells?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load cells');
      return res.json();
    },
    refetchInterval: 10_000
  });
}
