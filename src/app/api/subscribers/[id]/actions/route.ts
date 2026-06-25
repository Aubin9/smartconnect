import { NextResponse } from 'next/server';
import { subscriberService } from '@/lib/services/subscriber.service';
import { simulateActionSchema } from '@/lib/validations/subscriber.schema';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = simulateActionSchema.parse(await req.json());
    const result = await subscriberService.simulateAction(params.id, body);
    if (!result) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Simulation failed' }, { status: 400 });
  }
}
