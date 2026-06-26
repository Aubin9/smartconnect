import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({
    status: "ok",
    service: "smartconnect",
    timestamp: new Date().toISOString(),
  });
}
