import { NextResponse } from 'next/server';
import { financialService } from '@/lib/services/financial.service';
import { creditRequestSchema } from '@/lib/validations/financial.schema';

export async function POST(req: Request) {
  try {
    const body = creditRequestSchema.parse(await req.json());
    const credit = await financialService.applyCredit(body);
    return NextResponse.json(credit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Credit failed' }, { status: 400 });
  }
}
