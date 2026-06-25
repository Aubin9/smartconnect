export type FinancialProductStatus = {
  name: string;
  active: boolean;
  eligibility: 'eligible' | 'not_eligible' | 'active';
  amountXaf?: number;
  description: string;
};
