'use client';

import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils/helpers';

export function TrustScoreGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const data = [{ name: 'Trust', value: score, fill: score >= 70 ? '#00C853' : score >= 40 ? '#FF8C00' : '#FF1744' }];
  return (
    <div className={cn('relative', size === 'sm' ? 'h-28 w-28' : size === 'lg' ? 'h-52 w-52' : 'h-40 w-40')}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={999} background />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{Math.round(score)}</span>
        <span className="text-xs font-bold text-slate-500">/100</span>
      </div>
    </div>
  );
}
