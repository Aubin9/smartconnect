'use client';

import { useQuery } from '@tanstack/react-query';

export function useSubscribers(query?: string) {
  return useQuery({
    queryKey: ['subscribers', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      const res = await fetch(`/api/subscribers?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load subscribers');
      return res.json();
    }
  });
}

export function useSubscriber(id: string) {
  return useQuery({
    queryKey: ['subscriber', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/subscribers/${id}`);
      if (!res.ok) throw new Error('Failed to load subscriber');
      return res.json();
    }
  });
}
