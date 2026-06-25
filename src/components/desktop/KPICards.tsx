import { Activity, AlertTriangle, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCompact, formatXaf } from '@/lib/utils/formatters';

const icons = [Users, AlertTriangle, TrendingUp, Wallet, Activity];
const gradients = ['from-brand-blue to-brand-teal', 'from-red-500 to-orange-400', 'from-emerald-500 to-teal-400', 'from-brand-orange to-amber-400', 'from-violet-600 to-fuchsia-500'];

export function KPICards({ stats }: { stats: { activeSubscribers: number; currentCongestedCells: number; avgTrustScore: number; creditsDisbursedToday: number; pendingAlerts: number } }) {
  const cards = [
    { title: 'Active Subscribers', value: formatCompact(stats.activeSubscribers), detail: '↑ 3.4% from yesterday' },
    { title: 'Current Congested Cells', value: String(stats.currentCongestedCells), detail: '↓ 12 from 1hr ago' },
    { title: 'Avg Trust Score', value: stats.avgTrustScore.toFixed(1), detail: '↑ 0.3 nightly batch' },
    { title: "Today's Credits Disbursed", value: formatXaf(stats.creditsDisbursedToday), detail: 'PNQM + insurance payouts' },
    { title: 'Pending Alerts', value: String(stats.pendingAlerts), detail: 'Click bell to review' }
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = icons[index];
        return (
          <Card key={card.title} className="overflow-hidden p-0">
            <div className={`bg-gradient-to-br ${gradients[index]} p-5 text-white`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold opacity-90">{card.title}</p>
                <Icon className="h-5 w-5 opacity-90" />
              </div>
              <p className="mt-4 text-3xl font-black">{card.value}</p>
              <p className="mt-1 text-xs font-semibold opacity-90">{card.detail}</p>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
