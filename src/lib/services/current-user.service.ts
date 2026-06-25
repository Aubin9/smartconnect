import type { Session } from 'next-auth';
import { subscriberService } from '@/lib/services/subscriber.service';

export async function getCurrentOrDemoSubscriber(session: Session) {
  const byPhone = session.user.phoneNumber ? await subscriberService.getSubscriber(session.user.phoneNumber) : null;
  if (byPhone) return byPhone;
  const subscribers = await subscriberService.listSubscribers({ limit: 1 });
  return subscribers[0] ? subscriberService.getSubscriber(subscribers[0].id) : null;
}
