import { getServerSession } from "next-auth";
import { MapPin, Radar, Wifi } from "lucide-react";
import { CellHeatmap } from "@/components/shared/maps/CellHeatmap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth/config";
import { getCurrentOrDemoSubscriber } from "@/lib/services/current-user.service";
import { networkService } from "@/lib/services/network.service";

export default async function MobileQualityPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const [cells, predictions] = await Promise.all([
    getCurrentOrDemoSubscriber(session),
    networkService.getCells({ region: "Douala" }),
    networkService.getPredictions(1),
  ]);
  const prediction = predictions[0];

  return (
    <div className="space-y-5">
      <Card className="text-center">
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-teal/10">
          <div className="absolute h-32 w-32 animate-scan rounded-full border-t-4 border-brand-blue" />
          <Radar className="h-14 w-14 text-brand-blue" />
        </div>
        <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
          Network scanner
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          <MapPin className="mr-1 inline h-4 w-4" />
          Bonapriso, Douala
        </p>
        <Button size="lg" className="mt-5 w-full">
          <Wifi className="h-5 w-5" /> Test Network
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Speed test result
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Metric label="Speed" value="14.2 Mbps" />
          <Metric label="Latency" value="38 ms" />
          <Metric label="RSRP" value="-84 dBm" />
          <Metric label="SINR" value="18 dB" />
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              30-minute forecast
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your area is{" "}
              {(prediction?.probability
                ? prediction.probability * 100
                : 72
              ).toFixed(0)}
              % likely to experience congestion in{" "}
              {prediction?.windowMinutes ?? 20} minutes.
            </p>
          </div>
          <Badge tone="warning">↑ 8%</Badge>
        </div>
        <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          Video calls may be affected. Consider switching to Wi-Fi.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline">Set reminder</Button>
          <Button>Find Wi-Fi spots</Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
          Coverage map
        </h2>
        <CellHeatmap cells={cells} />
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
