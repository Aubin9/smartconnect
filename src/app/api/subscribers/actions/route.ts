import { NextResponse } from "next/server";
import { evaluateSmartConnectRules } from "@/lib/services/rule-engine";

export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const state = await req.json();
  return NextResponse.json(evaluateSmartConnectRules(state));
}
