'use client';

import { Area, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Point = {
  time: string;
  rsrp: number;
  sinr: number;
  prb: number;
  throughput: number;
};

export function CongestionChart({ data }: { data: Point[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Real-time KPI graph</CardTitle>
          <CardDescription>Last 60 minutes; refreshed by SSE/API every 5 seconds in production mode.</CardDescription>
        </div>
      </CardHeader>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="prb" name="PRB Util (%)" fill="rgba(243,156,18,0.25)" stroke="#f39c12" />
            <Line type="monotone" dataKey="rsrp" name="RSRP (dBm)" stroke="#0066FF" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="sinr" name="SINR (dB)" stroke="#00C853" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="throughput" name="Throughput (Mbps)" stroke="#7c3aed" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
