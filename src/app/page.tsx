import {
  Activity,
  ArrowRight,
  BarChart3,
  CreditCard,
  Database,
  Gauge,
  Globe2,
  LockKeyhole,
  Network,
  RadioTower,
  ShieldCheck,
  Smartphone,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Active subscribers', value: '1.2M', trend: '+3.4%' },
  { label: 'Congested cells', value: '47', trend: '-12 cells' },
  { label: 'Average trust score', value: '68.4', trend: '+0.3' },
  { label: 'Credits today', value: '4.7M XAF', trend: 'auto-disbursed' }
];

const pillars = [
  {
    icon: RadioTower,
    title: 'Predictive Network Quality Manager',
    description: 'Collects RSRP, SINR, PRB utilisation and throughput KPIs, predicts congestion windows, then alerts or compensates subscribers before complaints become churn.'
  },
  {
    icon: Wallet,
    title: 'Contextual Digital Wallet Engine',
    description: 'Uses trust score, account age, top-up behaviour and outage events to trigger insurance payouts, airtime bridge, SME micro-loans and travel booster offers.'
  },
  {
    icon: Database,
    title: 'Production-style full stack',
    description: 'Next.js App Router, TypeScript, PostgreSQL, Prisma ORM, role-based login, API routes, seed data and responsive dashboards in one deployable codebase.'
  }
];

const flows = [
  'Network KPIs enter through OSS/BSS, device SDK and simulated streaming APIs.',
  'Feature engineering prepares five-minute KPI windows for congestion prediction.',
  'Decision rules compare congestion probability, QoE and financial eligibility.',
  'Subscribers receive alerts, credits, wallet actions or reporting records automatically.'
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#00B4D8_0%,transparent_28%),linear-gradient(135deg,#1a2a6c_0%,#0066FF_52%,#00B4D8_100%)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
        <header className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
          <Logo inverted />
          <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
            <a href="#solution" className="text-white/80 hover:text-white">Solution</a>
            <a href="#features" className="text-white/80 hover:text-white">Features</a>
            <a href="#pitch" className="text-white/80 hover:text-white">Pitch</a>
            <Link href="/login" className="text-white/80 hover:text-white">Login</Link>
            <Link href="/register" className="rounded-xl bg-white px-4 py-2 text-brand-blue shadow-card transition hover:bg-slate-100">Register</Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/login" className="rounded-xl border border-white/30 px-3 py-2 text-sm font-bold text-white">Login</Link>
            <Link href="/register" className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-brand-blue">Register</Link>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-16">
          <div>
            <Badge className="border-white/20 bg-white/20 text-white">Dual-layer telecom VAS for Cameroon</Badge>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Intelligent network quality, automatic compensation and contextual wallet services.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              SmartConnect helps telecom operators predict congestion, protect subscriber experience, automate service credits, and unlock financial micro-products from one responsive platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login?callbackUrl=/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-base font-black text-brand-blue shadow-card transition hover:bg-slate-100">
                Open operator dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login?callbackUrl=/mobile" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-base font-black text-white backdrop-blur transition hover:bg-white/20">
                Open subscriber portal <Smartphone className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/70">
              New user? <Link href="/register" className="font-black text-white underline decoration-white/40 underline-offset-4">Create a subscriber or operator account here.</Link>
            </p>
          </div>

          <Card className="border-white/20 bg-white/10 p-4 text-white shadow-soft backdrop-blur-xl">
            <div className="rounded-3xl bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/70">Live platform preview</p>
                  <h2 className="text-2xl font-black">Cameroon Network Intelligence</h2>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-200">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> Live
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-white/60">{item.label}</p>
                    <p className="mt-2 text-2xl font-black">{item.value}</p>
                    <p className="mt-1 text-xs text-emerald-200">{item.trend}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Gauge className="h-10 w-10 text-brand-teal" />
                  <div>
                    <p className="text-xs font-bold text-white/60">Predicted congestion probability</p>
                    <p className="text-3xl font-black">72%</p>
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-brand-warning to-brand-danger" />
                </div>
                <p className="mt-3 text-sm text-white/70">Suggested action: alert Douala Zone-3 subscribers and prepare automatic credit if QoE drops below SLA.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="solution" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="max-w-3xl">
          <Badge tone="info">Architecture</Badge>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">One platform, two value layers.</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            The system connects network quality intelligence with subscriber-facing financial actions. It is designed for telecom operators, network engineers, business analysts and subscribers using web or mobile-responsive screens.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-teal/10 dark:text-brand-teal">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{pillar.title}</CardTitle>
                <CardDescription className="leading-6">{pillar.description}</CardDescription>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-16 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <Badge tone="success">Included modules</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Built for a clear academic demo and a realistic production direction.</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              The project includes login, registration, protected role flows, PostgreSQL models, synthetic telecom data, financial transactions, alerts, ML model metadata and responsive interfaces.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 text-sm font-black text-white shadow-card">
                Register now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 shadow-card dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                Sign in <LockKeyhole className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Operator dashboard', BarChart3],
              ['Subscriber mobile portal', Smartphone],
              ['Network coverage map', Globe2],
              ['Congestion prediction', Activity],
              ['Trust score engine', ShieldCheck],
              ['Financial products', CreditCard],
              ['PostgreSQL database', Database],
              ['API route layer', Network]
            ].map(([label, Icon]) => {
              const RealIcon = Icon as typeof Activity;
              return (
                <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                    <RealIcon className="h-5 w-5" />
                  </div>
                  <p className="font-black text-slate-900 dark:text-white">{String(label)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pitch" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Badge tone="warning">How to explain it</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Simple project pitch.</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              SmartConnect is not just a dashboard. It demonstrates how an operator can transform raw network KPIs into business actions that improve customer satisfaction and create new VAS revenue.
            </p>
          </div>
          <div className="space-y-3">
            {flows.map((flow, index) => (
              <div key={flow} className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-teal text-sm font-black text-white">{index + 1}</div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">{flow}</p>
                  <p className="mt-1 text-sm text-slate-500">This is the end-to-end logic shown in the dashboard, APIs, services and seed data.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-950 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="flex flex-wrap gap-3 text-sm font-bold">
            <Link href="/login" className="text-slate-500 hover:text-brand-blue">Login</Link>
            <Link href="/register" className="text-slate-500 hover:text-brand-blue">Register</Link>
            <Link href="/login?callbackUrl=/dashboard" className="text-slate-500 hover:text-brand-blue">Dashboard</Link>
            <Link href="/login?callbackUrl=/mobile" className="text-slate-500 hover:text-brand-blue">Subscriber portal</Link>
          </div>
          <p className="text-sm text-slate-500">Built for SmartConnect VAS demonstration.</p>
        </div>
      </footer>
    </main>
  );
}
