import { NextResponse } from "next/server";
import { subscriberService } from "@/lib/services/subscriber.service";

export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const trust = await subscriberService.getTrustScore(params.id);
  if (!trust)
    return NextResponse.json(
      { error: "Subscriber not found" },
      { status: 404 },
    );
  return NextResponse.json(trust);
}
