import { describe, it, expect, vi } from "vitest";
import { evaluateSmartConnectRules } from "./rule-engine";
import type { SubscriberRuleState } from "./rule-engine";

// Mock the constants if needed, or use the actual ones
vi.mock("@/lib/utils/constants", async () => {
  const actual = await vi.importActual("@/lib/utils/constants");
  return {
    ...actual,
    // Override any values for testing if needed
  };
});

describe("SmartConnect Rule Engine", () => {
  it("should return MONITOR_ONLY when no rules are triggered", () => {
    const state: SubscriberRuleState = {
      trustScore: 50,
      accountAge: 12,
      balanceXaf: 100,
    };

    const result = evaluateSmartConnectRules(state);
    expect(result).toHaveLength(1);
    expect(result[0].action).toBe("MONITOR_ONLY");
  });

  it("should trigger AUTO_CREDIT when congestion probability is high", () => {
    const state: SubscriberRuleState = {
      trustScore: 50,
      accountAge: 12,
      congestionProbability: 0.85,
      degradationMinutes: 20,
      throughputMbps: 0.3,
    };

    const result = evaluateSmartConnectRules(state);
    const creditRule = result.find((r) => r.action === "AUTO_CREDIT");
    expect(creditRule).toBeDefined();
    expect(creditRule?.approved).toBe(true);
    expect(creditRule?.amountXaf).toBe(100);
  });

  it("should trigger AIRTIME_BRIDGE when balance is zero and trust score is sufficient", () => {
    const state: SubscriberRuleState = {
      trustScore: 50,
      accountAge: 12,
      balanceXaf: 0,
      hasOutstandingBridge: false,
    };

    const result = evaluateSmartConnectRules(state);
    const bridgeRule = result.find((r) => r.action === "AIRTIME_BRIDGE");
    expect(bridgeRule).toBeDefined();
    expect(bridgeRule?.approved).toBe(true);
    expect(bridgeRule?.amountXaf).toBe(200);
  });

  it("should reject AIRTIME_BRIDGE when trust score is too low", () => {
    const state: SubscriberRuleState = {
      trustScore: 30,
      accountAge: 12,
      balanceXaf: 0,
      hasOutstandingBridge: false,
    };

    const result = evaluateSmartConnectRules(state);
    const bridgeRule = result.find((r) => r.action === "AIRTIME_BRIDGE");
    expect(bridgeRule).toBeDefined();
    expect(bridgeRule?.approved).toBe(false);
  });

  it("should trigger INSURANCE_PAYOUT when eligible", () => {
    const state: SubscriberRuleState = {
      trustScore: 50,
      accountAge: 12,
      optedInInsurance: true,
      outageHoursToday: 4,
    };

    const result = evaluateSmartConnectRules(state);
    const insuranceRule = result.find((r) => r.action === "INSURANCE_PAYOUT");
    expect(insuranceRule).toBeDefined();
    expect(insuranceRule?.approved).toBe(true);
    expect(insuranceRule?.amountXaf).toBe(500);
  });
});
