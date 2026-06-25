'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const NetworkCoverageMap = dynamic(() => import('./NetworkCoverageMap').then((mod) => mod.NetworkCoverageMap), {
  ssr: false,
  loading: () => <LoadingSpinner label="Loading Cameroon network map..." />
});

export function CellHeatmap({ cells }: { cells: any[] }) {
  return <NetworkCoverageMap cells={cells} />;
}
