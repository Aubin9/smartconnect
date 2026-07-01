import { auth } from "@/lib/auth/client";
import { subscriberService } from "./subscriber.service";
import type { Session } from "next-auth";

// 1. Explicitly allow Session, null, or undefined in the parameter type
export async function getCurrentOrDemoSubscriber(session?: Session | null) {
  // If session is not passed or is null, fetch it
  if (!session) {
    session = await auth();
  }

  if (!session?.user) return null;

  try {
    const byPhone = await subscriberService.getSubscriber(
      session.user.phoneNumber,
    );
    if (byPhone) return byPhone;

    const subscribers = await subscriberService.listSubscribers({ limit: 1 });
    if (subscribers[0]) {
      return await subscriberService.getSubscriber(subscribers[0].id);
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch subscriber:", error);
    return null;
  }
}
