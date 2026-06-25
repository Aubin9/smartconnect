import { NextResponse } from 'next/server';
import { mlService } from '@/lib/services/ml.service';

export async function GET() {
  const model = await mlService.getActiveModel();
  return NextResponse.json(model);
}
