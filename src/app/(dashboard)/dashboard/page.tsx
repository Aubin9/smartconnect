import { AlertTriangle, ArrowRight, CheckCircle2, Filter, RadioTower, ShieldCheck } from 'lucide-react';
import { CellHeatmap } from '@/components/shared/maps/CellHeatmap';
import { CongestionChart } from '@/components/shared/charts/CongestionChart';
import { KPICards } from '@/components/desktop/KPICards';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { networkService } from '@/lib/services/network.service';
import { formatDateTime, percent } from '@/lib/utils/formatters';

export default async function DashboardPage() {
  const [stats, cells, kpis, predictions, actions] = await Promise.all([
    networkService.getDashboardStats(),
    networkService.getCells(),
    networkService.getLatestKpis({ limit: 60 }),
    networkService.getPredictions(5),
    networkService.getRecentActions(50)
  ]);

  const chartData = kpis
    .slice(0, 12)
    .reverse()
    .map((kpi) => ({
      time: new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala' }).format(kpi.timestamp),
      rsrp: Math.round(kpi.rsrp ?? -90),
      sinr: Number((kpi.sinr ?? 10).toFixed(1)),
      prb: Number((kpi.prbUtilization ?? 50).toFixed(1)),
      throughput: Number((kpi.throughput50th ?? 2).toFixed(2))
    }));

  return (
    <div className="space-y-6">
      <KPICards stats={stats} />
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Live Cameroon network overview</CardTitle>
                <CardDescription>Color-coded cell sectors: green good, yellow warning, red congested, purple predicted congestion.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm"><Filter className="h-4 w-4" /> Region</Button>
                <Button variant="outline" size="sm"><RadioTower className="h-4 w-4" /> Operator</Button>
                <Button variant="outline" size="sm">Historical playback</Button>
              </div>
            </div>
            <CellHeatmap cells={cells} />
          </Card>
        </div>
        <div className="space-y-6">
          <CongestionChart data={chartData} />
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Top 5 predicted congestions</CardTitle>
                <CardDescription>Next 30-minute LSTM forecast window</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="rounded-2xl border border-slate-100 bg-gradient-to-r from-amber-50 to-red-50 p-3 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">{prediction.cellSector.cellId}</p>
                      <p className="text-xs text-slate-500">{prediction.cellSector.location} • {prediction.windowMinutes} min</p>
                    </div>
                    <Badge tone={prediction.probability >= 0.85 ? 'danger' : 'warning'}>{percent(prediction.probability)}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                    <Button size="sm" className="flex-1">Trigger Alert</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent actions feed</CardTitle>
            <CardDescription>Last 50 alerts, credits, loans and insurance actions.</CardDescription>
          </div>
          <Button variant="outline" size="sm">Export PDF <ArrowRight className="h-4 w-4" /></Button>
        </CardHeader>
        <div className="max-h-96 space-y-3 overflow-y-auto pr-2 scrollbar-thin">
          {actions.map((action) => (
            <div key={action.id} className="flex gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <div className="mt-1">
                {action.kind.includes('credit') ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : action.kind.includes('loan') ? <ShieldCheck className="h-5 w-5 text-brand-orange" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 dark:text-white">{action.title}</p>
                <p className="text-sm text-slate-500">{action.message}</p>
                <p className="mt-1 mono text-xs text-slate-400">{action.subscriber} • {formatDateTime(action.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
