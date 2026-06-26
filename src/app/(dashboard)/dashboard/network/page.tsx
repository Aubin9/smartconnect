import { CellHeatmap } from "@/components/shared/maps/CellHeatmap";
import { DataTable } from "@/components/desktop/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { networkService } from "@/lib/services/network.service";
import { percent } from "@/lib/utils/formatters";
export const dynamic = "force-dynamic";
export default async function NetworkPage() {
  const cells = await networkService.getCells();
  const rows = cells.map((cell) => ({
    id: cell.id,
    cellId: cell.cellId,
    location: cell.location,
    operator: cell.operator,
    region: cell.region,
    rsrp: cell.latestKpi?.rsrp ?? null,
    sinr: cell.latestKpi?.sinr ?? null,
    prb: cell.latestKpi?.prbUtilization ?? null,
    probability: cell.latestPrediction?.probability ?? 0,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Congestion prediction map</CardTitle>
            <CardDescription>
              Drill down from national view to individual base station sectors.
            </CardDescription>
          </div>
        </CardHeader>
        <CellHeatmap cells={cells} />
      </Card>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Cell sector KPI table</CardTitle>
            <CardDescription>
              Search, filter, and export-ready network status list.
            </CardDescription>
          </div>
        </CardHeader>
        <DataTable
          data={rows}
          columns={[
            {
              key: "cellId",
              header: "Cell ID",
              render: (row) => (
                <span className="mono font-bold">{row.cellId}</span>
              ),
            },
            {
              key: "location",
              header: "Location",
              render: (row) => row.location,
            },
            {
              key: "operator",
              header: "Operator",
              render: (row) => <Badge tone="info">{row.operator}</Badge>,
            },
            {
              key: "rsrp",
              header: "RSRP",
              render: (row) => `${row.rsrp ?? "N/A"} dBm`,
            },
            {
              key: "sinr",
              header: "SINR",
              render: (row) => `${row.sinr ?? "N/A"} dB`,
            },
            {
              key: "prb",
              header: "PRB",
              render: (row) => `${row.prb ?? "N/A"}%`,
            },
            {
              key: "probability",
              header: "30-min probability",
              render: (row) => (
                <Badge
                  tone={
                    row.probability >= 0.75
                      ? "danger"
                      : row.probability >= 0.6
                        ? "warning"
                        : "success"
                  }
                >
                  {percent(row.probability)}
                </Badge>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
