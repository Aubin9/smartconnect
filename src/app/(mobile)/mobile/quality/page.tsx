import { MapPin, Radar, Wifi } from "lucide-react";
import { CellHeatmap } from "@/components/shared/maps/CellHeatmap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth/config";
import { getCurrentOrDemoSubscriber } from "@/lib/services/current-user.service";
import { prisma } from "@/lib/db/prisma";
import { CellData } from "@/components/shared/maps/NetworkCoverageMap";

export default async function MobileQualityPage() {
  const session = await auth();
  if (!session) return null;

  // Get subscriber data with all relations
  const subscriber = await getCurrentOrDemoSubscriber(session);
  if (!subscriber) return <Card>No subscriber profile found.</Card>;

  // Get the latest network quality event
  const latestEvent = subscriber.networkQualityEvents?.[0];

  // Get the cell sector ID from the latest event
  const cellSectorId = latestEvent?.cellSectorId;

  // Fetch the cell sector with predictions separately
  let latestPrediction = null;
  let cellSectorRegion = "Douala";

  if (cellSectorId) {
    const cellSector = await prisma.cellSector.findUnique({
      where: { id: cellSectorId },
      include: {
        predictions: {
          orderBy: { predictedAt: "desc" },
          take: 1,
        },
        kpiData: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    if (cellSector) {
      latestPrediction = cellSector.predictions?.[0];
      cellSectorRegion = cellSector.region;
    }
  }

  // Fetch all cells for the map
  const cells = await prisma.cellSector.findMany({
    where: {
      region: cellSectorRegion,
    },
    include: {
      kpiData: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
      predictions: {
        orderBy: { predictedAt: "desc" },
        take: 1,
      },
    },
  });

  // Transform cells to CellData format
  const cellData: CellData[] = cells.map((cell) => ({
    id: cell.id,
    cellId: cell.cellId,
    location: cell.location,
    region: cell.region,
    operator: cell.operator,
    latitude: cell.latitude,
    longitude: cell.longitude,
    latestKpi: cell.kpiData[0]
      ? {
          rsrp: cell.kpiData[0].rsrp ?? null,
          sinr: cell.kpiData[0].sinr ?? null,
          prbUtilization: cell.kpiData[0].prbUtilization ?? null,
          throughput50th: cell.kpiData[0].throughput50th ?? null,
        }
      : null,
    latestPrediction: cell.predictions[0]
      ? {
          probability: cell.predictions[0].probability,
          windowMinutes: cell.predictions[0].windowMinutes,
        }
      : null,
  }));

  // Get prediction data
  const probability = latestPrediction?.probability ?? 0.72;
  const windowMinutes = latestPrediction?.windowMinutes ?? 20;

  // Calculate trust score status
  const trustScore = subscriber.trustScore ?? 0;
  const trustLevel =
    trustScore > 70 ? "Good" : trustScore > 50 ? "Fair" : "Needs Improvement";

  return (
    <div className="space-y-5">
      {/* Network Scanner Card */}
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
          {latestEvent?.cellSector?.location || subscriber.msisdn || "Douala"}
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <Badge tone="info">Plan: {subscriber.plan}</Badge>
          <Badge tone="success">{subscriber.planSpeed} Mbps</Badge>
        </div>
        <Button size="lg" className="mt-5 w-full">
          <Wifi className="h-5 w-5" /> Test Network
        </Button>
      </Card>

      {/* Speed Test Results */}
      <Card>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Speed test result
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Metric
            label="Speed"
            value={`${latestEvent?.throughput?.toFixed(1) ?? "14.2"} Mbps`}
          />
          <Metric
            label="Latency"
            value={`${latestEvent?.latency?.toFixed(0) ?? "38"} ms`}
          />
          <Metric
            label="QoE Score"
            value={`${latestEvent?.qoeScore?.toFixed(0) ?? "82"}/100`}
          />
          <Metric
            label="Event Type"
            value={latestEvent?.eventType?.replace("_", " ") ?? "Normal"}
          />
        </div>
        {latestEvent?.cellSector && (
          <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <p className="text-xs text-slate-500">Cell ID</p>
              <p className="text-sm font-bold">
                {latestEvent.cellSector.cellId}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Operator</p>
              <p className="text-sm font-bold">
                {latestEvent.cellSector.operator}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Region</p>
              <p className="text-sm font-bold">
                {latestEvent.cellSector.region}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Network Forecast */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Network forecast
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your area is <strong>{(probability * 100).toFixed(0)}%</strong>{" "}
              likely to experience congestion in{" "}
              <strong>{windowMinutes}</strong> minutes.
            </p>
          </div>
          <Badge
            tone={
              probability > 0.75
                ? "danger"
                : probability > 0.5
                  ? "warning"
                  : "success"
            }
          >
            {probability > 0.75
              ? "High Risk"
              : probability > 0.5
                ? "Moderate"
                : "Stable"}
          </Badge>
        </div>
        <p
          className="mt-4 rounded-2xl p-3 text-sm font-semibold"
          style={{
            backgroundColor: probability > 0.7 ? "#fef3c7" : "#d1fae5",
            color: probability > 0.7 ? "#92400e" : "#065f46",
          }}
        >
          {probability > 0.7
            ? "⚠️ Video calls may be affected. Consider switching to Wi-Fi."
            : "✅ Network quality is currently stable."}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline">Set reminder</Button>
          <Button>Find Wi-Fi spots</Button>
        </div>
      </Card>

      {/* Trust Score */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Trust Score
            </h2>
            <p className="text-sm text-slate-500">
              Financial eligibility indicator
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-brand-blue">
              {trustScore.toFixed(0)}
            </p>
            <Badge
              tone={
                trustScore > 70
                  ? "success"
                  : trustScore > 50
                    ? "warning"
                    : "danger"
              }
            >
              {trustLevel}
            </Badge>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-2 rounded-full bg-brand-blue transition-all"
            style={{ width: `${Math.min(trustScore, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Based on {subscriber.trustScoreHistory?.length || 0} trust evaluations
        </p>
      </Card>

      {/* Coverage Map */}
      <Card>
        <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
          Coverage map
        </h2>
        {cellData && cellData.length > 0 ? (
          <CellHeatmap cells={cellData} />
        ) : (
          <p className="py-8 text-center text-slate-500">
            No coverage data available
          </p>
        )}
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
