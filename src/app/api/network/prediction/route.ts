import { NextResponse } from "next/server";
import { networkService } from "@/lib/services/network.service";
import { mlService } from "@/lib/services/ml.service";
import { predictionInputSchema } from "@/lib/validations/network.schema";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const predictions = await networkService.getPredictions(limit);
  return NextResponse.json(predictions);
}

export async function POST(req: Request) {
  try {
    const body = predictionInputSchema.parse(await req.json());
    const result = await mlService.predictCongestion(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prediction failed" },
      { status: 400 },
    );
  }
}
