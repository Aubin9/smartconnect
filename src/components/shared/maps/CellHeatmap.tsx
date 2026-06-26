"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CellData } from "./NetworkCoverageMap";

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
