import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Landmark, ShieldCheck, Plane, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth/config";
import { getCurrentOrDemoSubscriber } from "@/lib/services/current-user.service";
import { formatDateTime, formatXaf } from "@/lib/utils/formatters";

export default async function MobileWalletPage() {
  const session = await auth();
  if (!session) return null;
  const subscriber = await getCurrentOrDemoSubscriber(session);
  if (!subscriber) return <Card>No wallet found.</Card>;

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-br from-brand-orange to-amber-400 text-white">
        <p className="text-sm font-bold opacity-90">Combined credit balance</p>
        <p className="mt-3 text-4xl font-black">
          {formatXaf(subscriber.walletBalance)}
        </p>
        <p className="mt-2 text-sm opacity-90">
          Data credit: {formatXaf(subscriber.dataCreditBalance)} | Airtime:{" "}
          {formatXaf(subscriber.airtimeBalance)}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Button variant="outline" className="bg-white/20 text-white">
            + Top Up
          </Button>
          <Button variant="outline" className="bg-white/20 text-white">
            Transfer
          </Button>
          <Button variant="outline" className="bg-white/20 text-white">
            History
          </Button>
        </div>
      </Card>

      <Product
        icon={ShieldCheck}
        title="Connectivity Insurance"
        status={subscriber.insurancePolicies[0]?.active ? "Active" : "Inactive"}
        badge="50 XAF/day"
      >
        Today&apos;s coverage used:{" "}
        {subscriber.insurancePolicies[0]?.dailyCoverageUsed ?? 0}h / 24h.
        Auto-claim is enabled when 3+ hours of degradation are detected.
      </Product>
      <Product
        icon={Wallet}
        title="Airtime Bridge"
        status={subscriber.trustScore >= 40 ? "Eligible" : "Not eligible"}
        badge="200 XAF"
      >
        Trust score required: 40. Your score: {subscriber.trustScore.toFixed(0)}
        . Repayment fee: 5.5% at next top-up.
      </Product>
      <Product
        icon={Plane}
        title="Travel Data Booster"
        status="Not active"
        badge="500 MB+"
      >
        Auto-detect border zone or roaming signal and receive discounted bundles
        up to 2GB.
      </Product>
      <Product
        icon={Landmark}
        title="SME Micro-loan"
        status={subscriber.trustScore > 70 ? "Eligible" : "Not eligible"}
        badge="25,000 XAF"
      >
        Threshold: Trust Score above 70 and account age above 6 months. Your
        score: {subscriber.trustScore.toFixed(0)}.
      </Product>

      <Card>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Transaction history
        </h2>
        <div className="mt-4 space-y-3">
          {subscriber.transactions.slice(0, 8).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {transaction.description}
                </p>
                <p className="mono text-xs text-slate-500">
                  {formatDateTime(transaction.timestamp)} •{" "}
                  {transaction.mobileMoneyRef ?? "Internal"}
                </p>
              </div>
              <p className="font-black">{formatXaf(transaction.amount)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Product({
  icon: Icon,
  title,
  status,
  badge,
  children,
}: {
  icon: LucideIcon;
  title: string;
  status: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <Icon className="h-6 w-6 text-brand-orange" />
          <div>
            <h2 className="font-black text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{children}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge
            tone={
              status === "Eligible" || status === "Active"
                ? "success"
                : "warning"
            }
          >
            {status}
          </Badge>
          <p className="mt-2 text-xs font-bold text-slate-500">{badge}</p>
        </div>
      </div>
      <Button className="mt-4 w-full">Open product</Button>
    </Card>
  );
}
