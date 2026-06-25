"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// 1. Define a strict type for individual network cell items
export interface CellData {
  id: string | number;
  latitude: number;
  longitude: number;
  signalStrength?: number; // e.g., dBm or percentage metric
  operator?: "Orange" | "MTN" | "Camtel" | "Nexttel" | string;
  [key: string]: unknown; // Safe fallback catch-all for extra properties
}

const NetworkCoverageMap = dynamic(
  () => import("./NetworkCoverageMap").then((mod) => mod.NetworkCoverageMap),
  {
    ssr: false,
    loading: () => <LoadingSpinner label="Loading Cameroon network map..." />,
  },
);

// 2. Replace 'any[]' with 'CellData[]' to pass the linter check
export function CellHeatmap({ cells }: { cells: CellData[] }) {
  return <NetworkCoverageMap cells={cells} />;
}
