'use client';

import L from 'leaflet';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { formatXaf, percent } from '@/lib/utils/formatters';

type Cell = {
  id: string;
  cellId: string;
  location: string;
  region: string;
  operator: string;
  latitude: number;
  longitude: number;
  latestKpi?: { rsrp: number | null; sinr: number | null; prbUtilization: number | null; throughput50th: number | null } | null;
  latestPrediction?: { probability: number; windowMinutes: number } | null;
};

function colorFor(probability: number) {
  if (probability >= 0.85) return '#7e22ce';
  if (probability >= 0.75) return '#e74c3c';
  if (probability >= 0.6) return '#f39c12';
  return '#2ecc71';
}

export function NetworkCoverageMap({ cells }: { cells: Cell[] }) {
  return (
    <div className="h-[520px] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <MapContainer center={[5.9631, 10.1591]} zoom={6} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {cells.map((cell) => {
          const probability = cell.latestPrediction?.probability ?? 0.2;
          return (
            <CircleMarker
              key={cell.id}
              center={[cell.latitude, cell.longitude]}
              pathOptions={{ color: colorFor(probability), fillColor: colorFor(probability), fillOpacity: 0.55 }}
              radius={12 + probability * 18}
            >
              <Popup>
                <div className="min-w-56 space-y-2">
                  <p className="font-bold">{cell.cellId} • {cell.location}</p>
                  <p>Operator: {cell.operator}</p>
                  <p>RSRP: <strong>{cell.latestKpi?.rsrp ?? 'N/A'} dBm</strong></p>
                  <p>SINR: <strong>{cell.latestKpi?.sinr ?? 'N/A'} dB</strong></p>
                  <p>PRB: <strong>{cell.latestKpi?.prbUtilization ?? 'N/A'}%</strong></p>
                  <p>Throughput P50: <strong>{cell.latestKpi?.throughput50th ?? 'N/A'} Mbps</strong></p>
                  <p>Congestion probability: <strong>{percent(probability)}</strong></p>
                  <Button size="sm" className="w-full" onClick={() => alert(`Alert simulation queued for ${cell.cellId}`)}>Trigger Alert</Button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
