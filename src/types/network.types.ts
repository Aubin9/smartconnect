export type KpiPoint = {
  timestamp: string;
  rsrp: number | null;
  sinr: number | null;
  prbUtilization: number | null;
  throughput50th: number | null;
};

export type CellSectorView = {
  id: string;
  cellId: string;
  location: string;
  region: string;
  operator: string;
  latitude: number;
  longitude: number;
  latestKpi?: {
    rsrp: number | null;
    sinr: number | null;
    prbUtilization: number | null;
    throughput50th: number | null;
  } | null;
  latestPrediction?: {
    probability: number;
    windowMinutes: number;
  } | null;
};
