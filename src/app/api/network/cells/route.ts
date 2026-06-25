import { NextResponse } from 'next/server';
import { networkService } from '@/lib/services/network.service';
import { cellQuerySchema } from '@/lib/validations/network.schema';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = cellQuerySchema.parse(Object.fromEntries(url.searchParams));
  const cells = await networkService.getCells(params);
  return NextResponse.json(cells);
}
