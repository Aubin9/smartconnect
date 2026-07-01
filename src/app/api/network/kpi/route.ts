import { NextResponse } from "next/server";
import { networkService } from "@/lib/services/network.service";
import { kpiQuerySchema } from "@/lib/validations/network.schema";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = kpiQuerySchema.parse(Object.fromEntries(url.searchParams));
  const [stats, kpis, actions] = await Promise.all([
    networkService.getDashboardStats(),
    networkService.getLatestKpis(params),
    networkService.getRecentActions(20),
  ]);
  return NextResponse.json({ stats, kpis, actions });
}
