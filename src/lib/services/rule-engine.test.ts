import { describe, expect, test } from 'vitest';
import { evaluateSmartConnectRules } from './rule-engine';

describe('CDWM Rule Engine', () => {
  test('approves SME loan eligibility', () => {
    const decisions = evaluateSmartConnectRules({ trustScore: 72, accountAge: 7, hasOutstandingLoan: false });
    expect(decisions.some((decision) => decision.action === 'SME_MICRO_LOAN' && decision.approved)).toBe(true);
  });

  test('rejects airtime bridge below trust threshold', () => {
    const decisions = evaluateSmartConnectRules({ trustScore: 35, accountAge: 12, balanceXaf: 0, hasOutstandingBridge: false });
    const bridge = decisions.find((decision) => decision.action === 'AIRTIME_BRIDGE');
    expect(bridge?.approved).toBe(false);
  });

  test('triggers automatic credit for degraded QoE', () => {
    const decisions = evaluateSmartConnectRules({ trustScore: 55, accountAge: 9, throughputMbps: 0.42, degradationMinutes: 16 });
    expect(decisions.some((decision) => decision.action === 'AUTO_CREDIT' && decision.amountXaf === 100)).toBe(true);
  });
});
