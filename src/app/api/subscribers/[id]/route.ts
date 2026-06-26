import { NextResponse } from "next/server";
import { subscriberService } from "@/lib/services/subscriber.service";

export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const subscriber = await subscriberService.getSubscriber(params.id);
  if (!subscriber)
    return NextResponse.json(
      { error: "Subscriber not found" },
      { status: 404 },
    );
  return NextResponse.json(subscriber);
}
