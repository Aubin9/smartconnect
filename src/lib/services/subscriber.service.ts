import { prisma } from "@/lib/db/prisma";
import { evaluateSmartConnectRules } from "@/lib/services/rule-engine";

export class SubscriberService {
  async listSubscribers(options: { query?: string; limit?: number } = {}) {
    const q = options.query?.trim();
    return prisma.subscriber.findMany({
      where: q
        ? {
            OR: [
              { msisdn: { contains: q, mode: "insensitive" } },
              { id: { contains: q, mode: "insensitive" } },
              { user: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: {
        user: true,
        loans: { orderBy: { createdAt: "desc" }, take: 1 },
        insurancePolicies: { orderBy: { createdAt: "desc" }, take: 1 },
        bridgeAdvances: { orderBy: { createdAt: "desc" }, take: 1 },
        transactions: { orderBy: { timestamp: "desc" }, take: 3 },
        networkQualityEvents: {
          orderBy: { timestamp: "desc" },
          take: 20,
          include: { cellSector: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: options.limit ?? 25,
    });
  }

  async getSubscriber(id: string) {
    return prisma.subscriber.findFirst({
      where: { OR: [{ id }, { msisdn: id }] },
      include: {
        user: true,
        networkQualityEvents: {
          orderBy: { timestamp: "desc" },
          take: 20,
          include: { cellSector: true },
        },
        trustScoreHistory: { orderBy: { createdAt: "asc" }, take: 12 },
        transactions: { orderBy: { timestamp: "desc" }, take: 25 },
        alerts: { orderBy: { timestamp: "desc" }, take: 20 },
        loans: { orderBy: { createdAt: "desc" }, take: 5 },
        insurancePolicies: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { payouts: true },
        },
        bridgeAdvances: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
  }

  async getTrustScore(id: string) {
    const subscriber = await prisma.subscriber.findFirst({
      where: { OR: [{ id }, { msisdn: id }] },
      select: {
        id: true,
        msisdn: true,
        trustScore: true,
        topUpFrequency: true,
        topUpAmount: true,
        accountAge: true,
        trustScoreHistory: { orderBy: { createdAt: "asc" }, take: 12 },
      },
    });

    if (!subscriber) return null;

    return {
      ...subscriber,
      breakdown: [
        {
          label: "Top-up regularity",
          value: Math.min(100, subscriber.topUpFrequency * 16),
        },
        {
          label: "Account age",
          value: Math.min(100, subscriber.accountAge * 4),
        },
        {
          label: "Repayment history",
          value: subscriber.trustScore > 70 ? 88 : subscriber.trustScore + 10,
        },
        {
          label: "Churn stability",
          value: Math.max(30, 100 - Math.abs(70 - subscriber.trustScore)),
        },
      ],
    };
  }

  async simulateAction(id: string, scenario: Record<string, unknown>) {
    const subscriber = await this.getSubscriber(id);
    if (!subscriber) return null;

    const activeBridge = subscriber.bridgeAdvances.some(
      (bridge) => bridge.status === "ACTIVE",
    );
    const activeLoan = subscriber.loans.some(
      (loan) => loan.status === "APPROVED" || loan.status === "PENDING",
    );
    const activeInsurance = subscriber.insurancePolicies.some(
      (policy) => policy.active,
    );

    return evaluateSmartConnectRules({
      trustScore: subscriber.trustScore,
      accountAge: subscriber.accountAge,
      balanceXaf: Number(scenario.balanceXaf ?? subscriber.airtimeBalance),
      hasOutstandingBridge: activeBridge,
      hasOutstandingLoan: activeLoan,
      optedInInsurance: activeInsurance,
      outageHoursToday: Number(scenario.outageHours ?? 0),
      roaming: Boolean(scenario.roaming),
      lowSignalBorderZone: Boolean(scenario.lowSignalBorderZone),
      sharedBundlePercent: Number(scenario.sharedBundlePercent ?? 100),
      familyBundleConfigured: Boolean(scenario.familyBundleConfigured),
      throughputMbps: Number(scenario.throughputMbps ?? 5),
      degradationMinutes: Number(scenario.degradationMinutes ?? 0),
      congestionProbability: Number(scenario.congestionProbability ?? 0),
    });
  }
}

export const subscriberService = new SubscriberService();
