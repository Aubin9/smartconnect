import { Bot, Clock, GitBranch } from 'lucide-react';
import { ConfusionMatrix, FeatureImportance, RocCurve, WeeklyAccuracy } from '@/components/shared/charts/ModelPerformanceCharts';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mlService } from '@/lib/services/ml.service';
import { formatDateTime, percent } from '@/lib/utils/formatters';

export default async function MlModelPage() {
  const performance = await mlService.getPerformance();
  const model = performance.model;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Card><Bot className="h-6 w-6 text-brand-blue" /><p className="mt-3 text-sm text-slate-500">Active model</p><p className="text-2xl font-black">{model?.version ?? 'N/A'}</p></Card>
        <Card><p className="text-sm text-slate-500">Accuracy</p><p className="mt-3 text-3xl font-black">{model?.accuracy ? percent(model.accuracy, 1) : 'N/A'}</p></Card>
        <Card><p className="text-sm text-slate-500">AUC score</p><p className="mt-3 text-3xl font-black">{model?.aucScore?.toFixed(3) ?? 'N/A'}</p></Card>
        <Card><Clock className="h-6 w-6 text-brand-orange" /><p className="mt-3 text-sm text-slate-500">Next training</p><p className="text-sm font-black">{formatDateTime(performance.nextTraining)}</p></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ConfusionMatrix data={performance.confusionMatrix} />
        <RocCurve data={performance.roc} />
        <FeatureImportance data={performance.featureImportance} />
        <WeeklyAccuracy data={performance.weeklyAccuracy} />
      </section>

      <Card>
        <CardHeader><div><CardTitle>Model version history</CardTitle><CardDescription>MLflow-style model registry simulation for PNQM LSTM deployments.</CardDescription></div></CardHeader>
        <div className="space-y-3">
          {performance.versions.map((version) => (
            <div key={version.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-3"><GitBranch className="h-5 w-5 text-brand-teal" /><div><p className="font-black">{version.name}</p><p className="text-sm text-slate-500">Version {version.version} • trained {version.trainingDate ? formatDateTime(version.trainingDate) : 'N/A'}</p></div></div>
              <div className="flex items-center gap-2"><Badge tone={version.isActive ? 'success' : 'neutral'}>{version.isActive ? 'Active' : 'Archived'}</Badge><span className="font-bold">AUC {version.aucScore?.toFixed(3) ?? 'N/A'}</span></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
