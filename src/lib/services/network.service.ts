import { prisma } from '@/lib/db/prisma';
import { NETWORK_THRESHOLDS } from '@/lib/utils/constants';

export class NetworkService {
  async getDashboardStats() {
    const [subscribers, congestedCells, avgTrust, credits, pendingAlerts] = await Promise.all([
      prisma.subscriber.count({ where: { active: true } }),
      prisma.congestionPrediction.count({ where: { probability: { gte: NETWORK_THRESHOLDS.congestionProbability } } }),
      prisma.subscriber.aggregate({ _avg: { trustScore: true } }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: { in: ['CREDIT', 'INSURANCE_PAYOUT'] }, timestamp: { gte: startOfToday() }, status: 'COMPLETED' }
      }),
      prisma.alert.count({ where: { read: false } })
    ]);

    return {
      activeSubscribers: subscribers,
      currentCongestedCells: congestedCells,
      avgTrustScore: Number((avgTrust._avg.trustScore ?? 0).toFixed(1)),
      creditsDisbursedToday: credits._sum.amount ?? 0,
      pendingAlerts
    };
  }

  async getLatestKpis(options: { region?: string; operator?: string; limit?: number } = {}) {
    return prisma.kpiData.findMany({
      where: {
        cellSector: {
          region: options.region,
          operator: options.operator
        }
      },
      include: { cellSector: true },
      orderBy: { timestamp: 'desc' },
      take: options.limit ?? 120
    });
  }

  async getCells(options: { region?: string; operator?: string } = {}) {
    const cells = await prisma.cellSector.findMany({
      where: { region: options.region, operator: options.operator },
      include: {
        kpiData: { orderBy: { timestamp: 'desc' }, take: 1 },
        predictions: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: [{ region: 'asc' }, { cellId: 'asc' }]
    });

    return cells.map((cell) => ({
      ...cell,
      latestKpi: cell.kpiData[0] ?? null,
      latestPrediction: cell.predictions[0] ?? null
    }));
  }

  async getPredictions(limit = 20) {
    return prisma.congestionPrediction.findMany({
      include: { cellSector: true },
      orderBy: [{ probability: 'desc' }, { predictedAt: 'desc' }],
      take: limit
    });
  }

  async getRecentActions(limit = 50) {
    const [alerts, transactions] = await Promise.all([
      prisma.alert.findMany({ include: { subscriber: { include: { user: true } }, cellSector: true }, orderBy: { timestamp: 'desc' }, take: limit }),
      prisma.transaction.findMany({ include: { subscriber: { include: { user: true } } }, orderBy: { timestamp: 'desc' }, take: limit })
    ]);

    return [
      ...alerts.map((alert) => ({
        id: alert.id,
        kind: alert.type.toLowerCase(),
        title: alert.title,
        message: alert.message,
        timestamp: alert.timestamp,
        subscriber: alert.subscriber.msisdn,
        cell: alert.cellSector?.cellId ?? null,
        severity: alert.severity
      })),
      ...transactions.map((transaction) => ({
        id: transaction.id,
        kind: transaction.type.toLowerCase(),
        title: transaction.description,
        message: `${transaction.amount.toLocaleString()} XAF • ${transaction.status}`,
        timestamp: transaction.timestamp,
        subscriber: transaction.subscriber.msisdn,
        cell: null,
        severity: transaction.status === 'FAILED' ? 'CRITICAL' : 'INFO'
      }))
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export const networkService = new NetworkService();
