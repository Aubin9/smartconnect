import { CDWM_RULES, NETWORK_THRESHOLDS } from '@/lib/utils/constants';

export type SubscriberRuleState = {
  trustScore: number;
  accountAge: number;
  balanceXaf?: number;
  hasOutstandingBridge?: boolean;
  hasOutstandingLoan?: boolean;
  optedInInsurance?: boolean;
  outageHoursToday?: number;
  roaming?: boolean;
  lowSignalBorderZone?: boolean;
  sharedBundlePercent?: number;
  familyBundleConfigured?: boolean;
  throughputMbps?: number;
  degradationMinutes?: number;
  congestionProbability?: number;
};

export type RuleDecision = {
  action: 'AUTO_CREDIT' | 'INSURANCE_PAYOUT' | 'AIRTIME_BRIDGE' | 'SME_MICRO_LOAN' | 'TRAVEL_BOOSTER' | 'FAMILY_BUNDLE_GUARD' | 'MONITOR_ONLY';
  approved: boolean;
  amountXaf?: number;
  reason: string;
  channel: Array<'PUSH' | 'SMS' | 'USSD' | 'MOMO'>;
};

export function evaluateSmartConnectRules(state: SubscriberRuleState): RuleDecision[] {
  const decisions: RuleDecision[] = [];

  const congestionExceeded = (state.congestionProbability ?? 0) >= NETWORK_THRESHOLDS.congestionProbability;
  const throughputExceeded =
    (state.throughputMbps ?? Number.POSITIVE_INFINITY) < NETWORK_THRESHOLDS.minimumThroughputMbps &&
    (state.degradationMinutes ?? 0) >= NETWORK_THRESHOLDS.degradationMinutes;

  if (congestionExceeded || throughputExceeded) {
    decisions.push({
      action: 'AUTO_CREDIT',
      approved: true,
      amountXaf: NETWORK_THRESHOLDS.creditPerWindowXaf,
      reason: congestionExceeded
        ? 'Congestion probability exceeded the 75% PNQM threshold.'
        : 'Measured throughput stayed below 512 Kbps for at least 15 minutes.',
      channel: ['PUSH', 'SMS', 'USSD']
    });
  }

  if (state.optedInInsurance && (state.outageHoursToday ?? 0) >= CDWM_RULES.insuranceOutageHours) {
    decisions.push({
      action: 'INSURANCE_PAYOUT',
      approved: true,
      amountXaf: CDWM_RULES.insurancePayoutXaf,
      reason: 'Subscriber opted into connectivity insurance and crossed 3 hours of degraded service today.',
      channel: ['PUSH', 'SMS', 'MOMO']
    });
  }

  if ((state.balanceXaf ?? 0) <= 0) {
    decisions.push({
      action: 'AIRTIME_BRIDGE',
      approved: state.trustScore >= CDWM_RULES.bridgeTrustScore && !state.hasOutstandingBridge,
      amountXaf: 200,
      reason:
        state.trustScore >= CDWM_RULES.bridgeTrustScore && !state.hasOutstandingBridge
          ? 'Zero balance detected with sufficient trust score and no outstanding bridge.'
          : 'Airtime bridge rejected because trust score is below 40 or an active bridge exists.',
      channel: ['PUSH', 'USSD']
    });
  }

  if (state.trustScore > CDWM_RULES.loanTrustScore && state.accountAge > CDWM_RULES.loanAccountAgeMonths) {
    decisions.push({
      action: 'SME_MICRO_LOAN',
      approved: !state.hasOutstandingLoan,
      amountXaf: CDWM_RULES.maxLoanXaf,
      reason: !state.hasOutstandingLoan
        ? 'Trust score and account age meet SME micro-loan criteria.'
        : 'Loan rejected because an outstanding loan exists.',
      channel: ['PUSH', 'MOMO']
    });
  }

  if (state.roaming || state.lowSignalBorderZone) {
    decisions.push({
      action: 'TRAVEL_BOOSTER',
      approved: true,
      amountXaf: 500,
      reason: 'Roaming or low-signal border-zone context detected.',
      channel: ['PUSH', 'SMS']
    });
  }

  if ((state.sharedBundlePercent ?? 100) < 10 && state.familyBundleConfigured) {
    decisions.push({
      action: 'FAMILY_BUNDLE_GUARD',
      approved: true,
      reason: 'Shared family bundle is below 10%; notify bundle owner before service interruption.',
      channel: ['PUSH', 'SMS']
    });
  }

  if (decisions.length === 0) {
    decisions.push({ action: 'MONITOR_ONLY', approved: true, reason: 'No threshold or product rule was triggered.', channel: ['PUSH'] });
  }

  return decisions;
}
