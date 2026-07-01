import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export async function POST() {
  const latest = await prisma.mLModel.findFirst({
    orderBy: { trainingDate: "desc" },
  });
  const version = latest
    ? `1.4.${Number(latest.version.split(".").at(-1) ?? 2) + 1}`
    : "1.4.0";
  await prisma.mLModel.updateMany({ data: { isActive: false } });
  const model = await prisma.mLModel.create({
    data: {
      name: "SmartConnect LSTM Congestion Predictor",
      version,
      type: "LSTM",
      accuracy: 0.89,
      aucScore: 0.925,
      precision: 0.85,
      recall: 0.882,
      trainingDate: new Date(),
      isActive: true,
    },
  });
  return NextResponse.json(
    {
      model,
      message:
        "Retraining simulation completed and new active model registered.",
    },
    { status: 201 },
  );
}
