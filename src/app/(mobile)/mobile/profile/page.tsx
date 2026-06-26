import type { ReactNode } from "react";
import { Copy, LogOut, Settings, Shield } from "lucide-react";
import { TrustScoreGauge } from "@/components/shared/charts/TrustScoreGauge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth/config";
import { getCurrentOrDemoSubscriber } from "@/lib/services/current-user.service";
import { formatXaf } from "@/lib/utils/formatters";

export default async function MobileProfilePage() {
  const session = await auth();
  if (!session) return null;
  const subscriber = await getCurrentOrDemoSubscriber(session);
  if (!subscriber) return <Card>No profile found.</Card>;

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Subscriber ID</p>
            <h1 className="mono text-xl font-black text-slate-900 dark:text-white">
              {subscriber.msisdn}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {subscriber.user.name} • {subscriber.plan}
            </p>
            <Badge className="mt-3" tone="success">
              Mobile Money linked: MTN MoMo
            </Badge>
          </div>
          <TrustScoreGauge score={subscriber.trustScore} size="sm" />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Account settings
        </h2>
        <div className="mt-4 space-y-3">
          <Row
            label="USSD code"
            value="*123*55#"
            icon={<Copy className="h-4 w-4" />}
          />
          <Row label="Account age" value={`${subscriber.accountAge} months`} />
          <Row
            label="Top-ups this month"
            value={`${subscriber.topUpFrequency} (${formatXaf(subscriber.topUpAmount)})`}
          />
          <Row label="Data used this month" value="2.8 GB / 3 GB" />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Preferences
        </h2>
        <div className="mt-4 space-y-3">
          {[
            "Push notifications: On",
            "SMS alerts: On",
            "USSD messages: On",
            "Daily summary: Off",
            "Share diagnostic data: On",
            "Location access: While Using",
          ].map((item) => (
            <Row
              key={item}
              label={item.split(":")[0]}
              value={item.split(":")[1].trim()}
            />
          ))}
        </div>
      </Card>

      <Card>
        <div className="grid gap-2">
          <Button variant="outline">
            <Shield className="h-4 w-4" /> Privacy Policy
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4" /> FAQ & Help
          </Button>
          <Button variant="danger">
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
        {value}
        {icon}
      </span>
    </div>
  );
}
