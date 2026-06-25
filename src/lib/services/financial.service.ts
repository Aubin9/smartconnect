import { LoanStatus, TransactionStatus, TransactionType } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { CDWM_RULES } from '@/lib/utils/constants';

export class FinancialService {
  async getTransactions(options: { subscriberId?: string; limit?: number } = {}) {
    return prisma.transaction.findMany({
      where: { subscriberId: options.subscriberId },
      include: { subscriber: { include: { user: true } } },
      orderBy: { timestamp: 'desc' },
      take: options.limit ?? 50
    });
  }

  async getFinancialSummary() {
    const [credits, loansApproved, loansRejected, insurancePayouts, transactions] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'CREDIT', status: 'COMPLETED' } }),
      prisma.loan.count({ where: { status: 'APPROVED' } }),
      prisma.loan.count({ where: { status: 'REJECTED' } }),
      prisma.insurancePayout.aggregate({ _sum: { amount: true } }),
      this.getTransactions({ limit: 25 })
    ]);

    return {
      totalCreditsDisbursed: credits._sum.amount ?? 0,
      loansApproved,
      loansRejected,
      insurancePayouts: insurancePayouts._sum.amount ?? 0,
      transactions,
      trustTopupScatter: await prisma.subscriber.findMany({
        select: { msisdn: true, trustScore: true, topUpAmount: true },
        orderBy: { trustScore: 'desc' },
        take: 30
      })
    };
  }

  async applyCredit(input: { subscriberId: string; amount: number; reason: string; degradationMinutes?: number; congestionProbability?: number }) {
    return prisma.$transaction(async (tx) => {
      const credit = await tx.credit.create({
        data: {
          subscriberId: input.subscriberId,
          amount: input.amount,
          type: 'DATA',
          reason: input.reason,
          degradationMinutes: input.degradationMinutes,
          congestionProbability: input.congestionProbability,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000)
        }
      });

      await tx.subscriber.update({
        where: { id: input.subscriberId },
        data: { dataCreditBalance: { increment: input.amount }, walletBalance: { increment: input.amount } }
      });

      await tx.transaction.create({
        data: {
          subscriberId: input.subscriberId,
          amount: input.amount,
          type: TransactionType.CREDIT,
          status: TransactionStatus.COMPLETED,
          description: input.reason,
          creditId: credit.id,
          mobileMoneyRef: `SC-CREDIT-${Date.now()}`,
          mobileMoneyProvider: 'OPERATOR_BILLING'
        }
      });

      await tx.alert.create({
        data: {
          subscriberId: input.subscriberId,
          type: 'CREDIT_ADDED',
          title: 'Data credit added',
          message: `${input.amount} XAF data credit was added because of network quality degradation.`,
          severity: 'INFO',
          sentVia: ['PUSH', 'SMS', 'USSD']
        }
      });

      return credit;
    });
  }

  async processLoan(input: { subscriberId: string; amount: number; termWeeks: number }) {
    const subscriber = await prisma.subscriber.findUnique({ where: { id: input.subscriberId }, include: { loans: true } });
    if (!subscriber) throw new Error('Subscriber not found');

    const outstandingLoan = subscriber.loans.some((loan) => loan.status === LoanStatus.APPROVED || loan.status === LoanStatus.PENDING);
    const eligible = subscriber.trustScore > CDWM_RULES.loanTrustScore && subscriber.accountAge > CDWM_RULES.loanAccountAgeMonths && !outstandingLoan;

    return prisma.$transaction(async (tx) => {
      const loan = await tx.loan.create({
        data: {
          subscriberId: input.subscriberId,
          amount: input.amount,
          termWeeks: input.termWeeks,
          interestRate: CDWM_RULES.loanInterestWeeklyPercent,
          status: eligible ? LoanStatus.APPROVED : LoanStatus.REJECTED,
          trustScoreAtApproval: subscriber.trustScore,
          approvedAt: eligible ? new Date() : null,
          dueDate: eligible ? new Date(Date.now() + input.termWeeks * 7 * 24 * 60 * 60_000) : null
        }
      });

      if (eligible) {
        await tx.subscriber.update({ where: { id: input.subscriberId }, data: { walletBalance: { increment: input.amount } } });
        await tx.transaction.create({
          data: {
            subscriberId: input.subscriberId,
            type: TransactionType.LOAN_DISBURSEMENT,
            amount: input.amount,
            status: TransactionStatus.COMPLETED,
            description: 'SME micro-loan disbursed via Mobile Money bridge',
            loanId: loan.id,
            mobileMoneyProvider: 'MTN_MOMO',
            mobileMoneyRef: `SC-LOAN-${Date.now()}`
          }
        });
        await tx.alert.create({
          data: {
            subscriberId: input.subscriberId,
            type: 'LOAN_APPROVED',
            title: 'SME micro-loan approved',
            message: `${input.amount.toLocaleString()} XAF has been approved and sent to your linked wallet.`,
            severity: 'INFO',
            sentVia: ['PUSH', 'SMS']
          }
        });
      }

      return { loan, eligible };
    });
  }

  async insuranceAction(input: { subscriberId: string; action: 'OPT_IN' | 'OPT_OUT' | 'CLAIM'; outageHours?: number }) {
    if (input.action === 'OPT_IN') {
      return prisma.insurancePolicy.create({ data: { subscriberId: input.subscriberId, active: true } });
    }

    if (input.action === 'OPT_OUT') {
      return prisma.insurancePolicy.updateMany({ where: { subscriberId: input.subscriberId, active: true }, data: { active: false } });
    }

    const policy = await prisma.insurancePolicy.findFirst({ where: { subscriberId: input.subscriberId, active: true }, orderBy: { createdAt: 'desc' } });
    if (!policy) throw new Error('No active insurance policy');
    if ((input.outageHours ?? 0) < CDWM_RULES.insuranceOutageHours) throw new Error('Outage threshold not reached');

    return prisma.$transaction(async (tx) => {
      const payout = await tx.insurancePayout.create({
        data: {
          policyId: policy.id,
          amount: CDWM_RULES.insurancePayoutXaf,
          outageHours: input.outageHours ?? CDWM_RULES.insuranceOutageHours,
          reason: 'Connectivity insurance payout for 3+ hours of degraded service'
        }
      });
      await tx.subscriber.update({ where: { id: input.subscriberId }, data: { walletBalance: { increment: CDWM_RULES.insurancePayoutXaf } } });
      await tx.transaction.create({
        data: {
          subscriberId: input.subscriberId,
          type: TransactionType.INSURANCE_PAYOUT,
          amount: CDWM_RULES.insurancePayoutXaf,
          status: TransactionStatus.COMPLETED,
          description: payout.reason,
          insuranceId: policy.id,
          mobileMoneyProvider: 'OPERATOR_BILLING',
          mobileMoneyRef: `SC-INS-${Date.now()}`
        }
      });
      await tx.insurancePolicy.update({ where: { id: policy.id }, data: { lastPayoutAt: new Date(), dailyCoverageUsed: input.outageHours ?? 3 } });
      return payout;
    });
  }
}

export const financialService = new FinancialService();
