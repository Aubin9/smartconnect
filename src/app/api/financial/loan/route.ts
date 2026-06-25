import { NextResponse } from 'next/server';
import { financialService } from '@/lib/services/financial.service';
import { loanRequestSchema } from '@/lib/validations/financial.schema';

export async function POST(req: Request) {
  try {
    const body = loanRequestSchema.parse(await req.json());
    const result = await financialService.processLoan(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Loan failed' }, { status: 400 });
  }
}
