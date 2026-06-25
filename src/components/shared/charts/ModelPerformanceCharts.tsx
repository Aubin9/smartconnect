'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ConfusionMatrix({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <Card>
      <CardHeader><div><CardTitle>Confusion matrix</CardTitle><CardDescription>True/false outcomes for congestion prediction</CardDescription></div></CardHeader>
      <div className="grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-xs font-bold uppercase text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RocCurve({ data }: { data: Array<{ threshold: number; tpr: number; fpr: number }> }) {
  return (
    <Card>
      <CardHeader><div><CardTitle>ROC curve</CardTitle><CardDescription>Threshold sensitivity with active LSTM model</CardDescription></div></CardHeader>
      <div className="h-64"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="fpr" /><YAxis dataKey="tpr" /><Tooltip /><Line dataKey="tpr" stroke="#0066FF" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
    </Card>
  );
}

export function FeatureImportance({ data }: { data: Array<{ feature: string; importance: number }> }) {
  return (
    <Card>
      <CardHeader><div><CardTitle>Feature importance</CardTitle><CardDescription>Top engineered variables used by the predictor</CardDescription></div></CardHeader>
      <div className="h-64"><ResponsiveContainer><BarChart data={data} layout="vertical" margin={{ left: 50 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="feature" width={120} /><Tooltip /><Bar dataKey="importance" fill="#00B4D8" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div>
    </Card>
  );
}

export function WeeklyAccuracy({ data }: { data: Array<{ week: string; accuracy: number }> }) {
  return (
    <Card>
      <CardHeader><div><CardTitle>Feedback loop improvement</CardTitle><CardDescription>Week-over-week prediction accuracy</CardDescription></div></CardHeader>
      <div className="h-64"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis domain={[0.8, 0.92]} /><Tooltip /><Line dataKey="accuracy" stroke="#00C853" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
    </Card>
  );
}
