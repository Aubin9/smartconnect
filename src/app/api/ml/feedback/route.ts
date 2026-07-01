import { NextResponse } from "next/server";
import { z } from "zod";
import { mlService } from "@/lib/services/ml.service";

export const dynamic = "force-dynamic";
const schema = z.object({
  predictionId: z.string(),
  actualOccurred: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const feedback = await mlService.recordFeedback(
      body.predictionId,
      body.actualOccurred,
    );
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Feedback failed" },
      { status: 400 },
    );
  }
}
