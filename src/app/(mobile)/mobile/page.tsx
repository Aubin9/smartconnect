import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ArrowRight, CheckCircle2, Radio, Shield, Wallet } from 'lucide-react';
import { SwipeableCard } from '@/components/mobile/SwipeableCard';
import { TrustScoreGauge } from '@/components/shared/charts/TrustScoreGauge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authOptions } from '@/lib/auth/config';
import { getCurrentOrDemoSubscriber } from '@/lib/services/current-user.service';
import { formatDateTime, formatXaf } from '@/lib/utils/formatters';

export default async function MobileHomePage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const subscriber = await getCurrentOrDemoSubscriber(session);
  if (!subscriber) return <Card>No subscriber profile found.</Card>;

  const latestEvent = subscriber.networkQualityEvents[0];
  const score = latestEvent?.qoeScore ?? 82;
  const quality = score > 75 ? 'Good' : score > 50 ? 'Fair' : 'Poor';

  const services = [
    { title: 'Connectivity Insurance', status: subscriber.insurancePolicies[0]?.active ? 'Active' : 'Inactive', icon: Shield, href: '/mobile/wallet' },
    { title: 'Airtime Bridge', status: subscriber.airtimeBalance <= 0 ? 'Need credit? Tap to bridge' : `${formatXaf(subscriber.airtimeBalance)} airtime`, icon: Wallet, href: '/mobile/wallet' },
    { title: 'Travel Booster', status: 'Not active', icon: Radio, href: '/mobile/wallet' },
    { title: 'SME Micro-loan', status: subscriber.trustScore > 70 ? 'Eligible up to 25,000 XAF' : 'Build trust score', icon: CheckCircle2, href: '/mobile/wallet' }
  ];

  return (
    <div className="space-y-5 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <Card className="bg-gradient-to-br from-brand-blue to-brand-teal text-white md:col-span-2">
        <p className="text-sm font-bold opacity-80">Quality of Experience</p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-4xl font-black">{quality}</p>
            <p className="mt-1 text-sm opacity-90">Current speed: {latestEvent?.throughput?.toFixed(1) ?? '14.2'} Mbps</p>
            <p className="mono mt-1 text-xs opacity-80">RSRP -84 dBm • SINR 18 dB</p>
          </div>
          <div className="flex items-end gap-1">
            {[1, 2, 3, 4, 5].map((bar) => <span key={bar} className="w-3 rounded-t bg-white" style={{ height: `${bar * 12}px`, opacity: bar <= Math.round(score / 20) ? 1 : 0.35 }} />)}
          </div>
        </div>
      </Card>

      <div className="flex gap-3 overflow-x-auto pb-1 md:col-span-2">
        {[
          ['Check Network Quality', '/mobile/quality'],
          ['Request Credit', '/mobile/wallet'],
          ['Get Insurance', '/mobile/wallet'],
          ['Report Issue', '/mobile/alerts'],
          ['View Trust Score', '/mobile/profile']
        ].map(([label, href]) => <Link key={label} href={href} className="shrink-0 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-card dark:bg-slate-900 dark:text-white">{label}</Link>)}
      </div>

      <Card>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Active services</h2>
        <div className="mt-4 space-y-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} href={service.href} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-brand-blue" /><div><p className="font-bold">{service.title}</p><p className="text-xs text-slate-500">{service.status}</p></div></div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div><h2 className="text-lg font-black text-slate-900 dark:text-white">Trust score</h2><p className="text-sm text-slate-500">Financial eligibility engine</p></div>
          <TrustScoreGauge score={subscriber.trustScore} size="sm" />
        </div>
        <Badge tone={subscriber.trustScore > 70 ? 'success' : 'warning'}>{subscriber.trustScore > 70 ? 'SME loan eligible' : 'Keep topping up regularly'}</Badge>
      </Card>

      <Card className="md:col-span-2">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Recent activity</h2>
        <div className="mt-4 space-y-3">
          {subscriber.alerts.slice(0, 5).map((alert) => (
            <SwipeableCard key={alert.id}>
              <div className="flex items-start gap-3">
                <span className="mt-1">{alert.severity === 'CRITICAL' ? '🔴' : alert.severity === 'WARNING' ? '🟡' : '🟢'}</span>
                <div className="min-w-0"><p className="font-bold text-slate-900 dark:text-white">{alert.title}</p><p className="text-sm text-slate-500">{alert.message}</p><p className="mono mt-1 text-xs text-slate-400">{formatDateTime(alert.timestamp)}</p></div>
              </div>
            </SwipeableCard>
          ))}
        </div>
      </Card>
    </div>
  );
}
