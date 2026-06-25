import { NextResponse } from 'next/server';
import { financialService } from '@/lib/services/financial.service';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subscriberId = url.searchParams.get('subscriberId') ?? undefined;
  const transactions = await financialService.getTransactions({ subscriberId, limit: 75 });
  return NextResponse.json(transactions);
}
