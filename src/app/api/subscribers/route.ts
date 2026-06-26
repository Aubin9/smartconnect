import { NextResponse } from "next/server";
import { subscriberService } from "@/lib/services/subscriber.service";
import { subscriberSearchSchema } from "@/lib/validations/subscriber.schema";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = subscriberSearchSchema.parse(
    Object.fromEntries(url.searchParams),
  );
  const subscribers = await subscriberService.listSubscribers(params);
  return NextResponse.json(subscribers);
}
