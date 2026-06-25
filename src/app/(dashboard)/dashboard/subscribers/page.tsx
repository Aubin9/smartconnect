import { Search } from "lucide-react";
import { DataTable } from "@/components/desktop/DataTable";
import { TrustScoreGauge } from "@/components/shared/charts/TrustScoreGauge";
import { LoanApplicationForm } from "@/components/shared/forms/LoanApplicationForm";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { subscriberService } from "@/lib/services/subscriber.service";
import { formatXaf } from "@/lib/utils/formatters";

export default async function SubscribersPage() {
  const subscribers = await subscriberService.listSubscribers({ limit: 40 });
  const first = subscribers[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Subscriber analytics</CardTitle>
            <CardDescription>
              Search by MSISDN, USSD profile, subscriber ID, trust score and
              active financial products.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="relative mb-5 max-w-xl">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by MSISDN, USSD code, or subscriber ID"
          />
        </div>
        <DataTable
          data={subscribers.map((subscriber) => ({
            id: subscriber.id,
            msisdn: subscriber.msisdn,
            name: subscriber.user.name ?? "Unknown",
            plan: subscriber.plan,
            trustScore: subscriber.trustScore,
            walletBalance: subscriber.walletBalance,
            insurance: subscriber.insurancePolicies[0]?.active
              ? "Active"
              : "Inactive",
            loan: subscriber.loans[0]?.status ?? "None",
          }))}
          columns={[
            {
              key: "msisdn",
              header: "MSISDN",
              render: (row) => (
                <span className="mono font-bold">{row.msisdn}</span>
              ),
            },
            { key: "name", header: "Name", render: (row) => row.name },
            {
              key: "plan",
              header: "Plan",
              render: (row) => <Badge tone="info">{row.plan}</Badge>,
            },
            {
              key: "trustScore",
              header: "Trust score",
              render: (row) => (
                <span className="font-black">{row.trustScore.toFixed(1)}</span>
              ),
            },
            {
              key: "walletBalance",
              header: "Wallet",
              render: (row) => formatXaf(row.walletBalance),
            },
            {
              key: "insurance",
              header: "Insurance",
              render: (row) => <StatusBadge status={row.insurance} />,
            },
            {
              key: "loan",
              header: "Loan",
              render: (row) => <StatusBadge status={row.loan} />,
            },
          ]}
        />
      </Card>

      {first && (
        <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Individual subscriber view</CardTitle>
                <CardDescription>
                  Default sample profile from seeded data.
                </CardDescription>
              </div>
            </CardHeader>
            <div className="flex flex-col items-center">
              <TrustScoreGauge score={first.trustScore} size="lg" />
              <p className="mt-3 text-xl font-black text-slate-900 dark:text-white">
                {first.user.name}
              </p>
              <p className="mono text-sm text-slate-500">{first.msisdn}</p>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Plan type</span>
                <strong>{first.plan}</strong>
              </div>
              <div className="flex justify-between">
                <span>Account age</span>
                <strong>{first.accountAge} months</strong>
              </div>
              <div className="flex justify-between">
                <span>Top-up frequency</span>
                <strong>{first.topUpFrequency}/month</strong>
              </div>
              <div className="flex justify-between">
                <span>Wallet balance</span>
                <strong>{formatXaf(first.walletBalance)}</strong>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Simulate action</CardTitle>
                <CardDescription>
                  Test CDWM loan flow directly from the subscriber context.
                </CardDescription>
              </div>
            </CardHeader>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="font-black text-slate-900 dark:text-white">
                  Quality of Experience trend
                </h4>
                <div className="mt-4 space-y-3">
                  {first.networkQualityEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl bg-white p-3 dark:bg-slate-900"
                    >
                      <div className="flex justify-between text-sm">
                        <span>{event.eventType.replaceAll("_", " ")}</span>
                        <strong>
                          {event.qoeScore?.toFixed(0) ?? "N/A"}/100
                        </strong>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-brand-blue"
                          style={{ width: `${event.qoeScore ?? 50}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <LoanApplicationForm subscriberId={first.id} />
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
