import { NextResponse } from "next/server";
import { financialService } from "@/lib/services/financial.service";
import { insuranceActionSchema } from "@/lib/validations/financial.schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = insuranceActionSchema.parse(await req.json());
    const result = await financialService.insuranceAction(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Insurance action failed",
      },
      { status: 400 },
    );
  }
}
