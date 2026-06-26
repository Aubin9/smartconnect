import { auth } from "@/lib/auth/client";
import { Bell, Check, CircleAlert, Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentOrDemoSubscriber } from "@/lib/services/current-user.service";
import { formatRelative } from "@/lib/utils/formatters";
export const dynamic = "force-dynamic";
export default async function MobileAlertsPage() {
  const session = await auth();
  if (!session) return null;
  const subscriber = await getCurrentOrDemoSubscriber(session);
  if (!subscriber) return <Card>No alerts found.</Card>;

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              All alerts enabled
            </h1>
            <p className="text-sm text-slate-500">
              Network, financial and promotion messages.
            </p>
          </div>
          <div className="h-8 w-14 rounded-full bg-brand-blue p-1">
            <div className="ml-auto h-6 w-6 rounded-full bg-white" />
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          <Badge tone="info">All</Badge>
          <Badge tone="warning">Network</Badge>
          <Badge tone="success">Financial</Badge>
          <Badge tone="neutral">Promotions</Badge>
        </div>
      </Card>
      {subscriber.alerts.map((alert) => {
        const Icon =
          alert.severity === "CRITICAL"
            ? CircleAlert
            : alert.type === "PROMOTIONAL"
              ? Megaphone
              : Bell;
        return (
          <Card
            key={alert.id}
            className={alert.severity === "CRITICAL" ? "border-red-200" : ""}
          >
            <div className="flex gap-3">
              <Icon
                className={
                  alert.severity === "CRITICAL"
                    ? "h-6 w-6 text-brand-danger"
                    : alert.severity === "WARNING"
                      ? "h-6 w-6 text-brand-orange"
                      : "h-6 w-6 text-brand-blue"
                }
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-slate-900 dark:text-white">
                    {alert.title}
                  </h2>
                  <Badge
                    tone={
                      alert.severity === "CRITICAL"
                        ? "danger"
                        : alert.severity === "WARNING"
                          ? "warning"
                          : "info"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
                <p className="mt-2 text-xs font-bold text-slate-400">
                  {formatRelative(alert.timestamp)}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button size="sm">View</Button>
                  <Button variant="outline" size="sm">
                    <Check className="h-4 w-4" /> Claim
                  </Button>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" /> Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
