'use client';

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoanPie({ approved, rejected }: { approved: number; rejected: number }) {
  const data = [
    { name: 'Approved', value: approved, fill: '#00C853' },
    { name: 'Rejected', value: rejected, fill: '#FF1744' }
  ];
  return (
    <Card>
      <CardHeader><div><CardTitle>Loans approved vs rejected</CardTitle><CardDescription>CDWM rule engine performance</CardDescription></div></CardHeader>
      <div className="h-64">
        <ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>{data.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
      </div>
    </Card>
  );
}

export function InsuranceBar() {
  const data = [
    { day: 'Mon', payouts: 92000 },
    { day: 'Tue', payouts: 134000 },
    { day: 'Wed', payouts: 110000 },
    { day: 'Thu', payouts: 176000 },
    { day: 'Fri', payouts: 142000 }
  ];
  return (
    <Card>
      <CardHeader><div><CardTitle>Insurance payouts</CardTitle><CardDescription>Daily connectivity protection payouts</CardDescription></div></CardHeader>
      <div className="h-64"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="payouts" fill="#00B4D8" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
    </Card>
  );
}

export function TrustTopupScatter({ data }: { data: Array<{ msisdn: string; trustScore: number; topUpAmount: number }> }) {
  return (
    <Card>
      <CardHeader><div><CardTitle>Trust score vs top-up amount</CardTitle><CardDescription>Correlation signal for subscriber financial products</CardDescription></div></CardHeader>
      <div className="h-64"><ResponsiveContainer><ScatterChart><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" dataKey="trustScore" name="Trust score" /><YAxis type="number" dataKey="topUpAmount" name="Top-up" /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Scatter data={data} fill="#0066FF" /></ScatterChart></ResponsiveContainer></div>
    </Card>
  );
}
