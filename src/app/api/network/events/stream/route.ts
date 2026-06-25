import { networkService } from '@/lib/services/network.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        const [stats, predictions] = await Promise.all([networkService.getDashboardStats(), networkService.getPredictions(5)]);
        controller.enqueue(encoder.encode(`event: smartconnect-update\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stats, predictions, timestamp: new Date().toISOString() })}\n\n`));
      };
      await send();
      const interval = setInterval(send, 5_000);
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 60_000);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}
