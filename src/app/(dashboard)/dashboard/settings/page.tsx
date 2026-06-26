import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CDWM_RULES, NETWORK_THRESHOLDS } from "@/lib/utils/constants";
export const dynamic = "force-dynamic";
export default function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>PNQM threshold configuration</CardTitle>
            <CardDescription>
              Operational thresholds used by the predictive network quality
              manager.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <Setting
            label="Congestion probability trigger"
            value={`${NETWORK_THRESHOLDS.congestionProbability * 100}%`}
          />
          <Setting
            label="QoE throughput floor"
            value={`${NETWORK_THRESHOLDS.minimumThroughputMbps} Mbps`}
          />
          <Setting
            label="Consecutive degradation window"
            value={`${NETWORK_THRESHOLDS.degradationMinutes} minutes`}
          />
          <Setting
            label="Credit per degradation window"
            value={`${NETWORK_THRESHOLDS.creditPerWindowXaf} XAF`}
          />
          <Setting
            label="Daily credit cap"
            value={`${NETWORK_THRESHOLDS.dailyCreditCapXaf} XAF`}
          />
        </div>
      </Card>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>CDWM financial rule configuration</CardTitle>
            <CardDescription>
              Rule engine controls for insurance, bridge, micro-loan and booster
              products.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <Setting
            label="Insurance premium"
            value={`${CDWM_RULES.insurancePremiumXaf} XAF/day`}
          />
          <Setting
            label="Insurance payout"
            value={`${CDWM_RULES.insurancePayoutXaf} XAF`}
          />
          <Setting
            label="Airtime bridge minimum trust score"
            value={`${CDWM_RULES.bridgeTrustScore}/100`}
          />
          <Setting
            label="SME loan minimum trust score"
            value={`>${CDWM_RULES.loanTrustScore}/100`}
          />
          <Setting
            label="SME loan max amount"
            value={`${CDWM_RULES.maxLoanXaf} XAF`}
          />
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>External integration status</CardTitle>
            <CardDescription>
              Demo-ready connectors for Mobile Money, SMS, USSD and ML serving.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            "MTN MoMo API",
            "Orange Money API",
            "SMPP SMS Gateway",
            "USSD Phase 2 Gateway",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"
            >
              <Badge tone="success">Configured</Badge>
              <p className="mt-2 font-bold">{item}</p>
            </div>
          ))}
        </div>
        <Button className="mt-5">Save configuration</Button>
      </Card>
    </div>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
      <span className="text-sm text-slate-500">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
