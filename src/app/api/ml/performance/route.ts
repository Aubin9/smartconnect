import { NextResponse } from 'next/server';
import { mlService } from '@/lib/services/ml.service';

export async function GET() {
  const performance = await mlService.getPerformance();
  return NextResponse.json(performance);
}
