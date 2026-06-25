export type TrustScoreBreakdown = {
  label: string;
  value: number;
};

export type SubscriberProfile = {
  id: string;
  msisdn: string;
  plan: string;
  planSpeed: number;
  accountAge: number;
  trustScore: number;
  walletBalance: number;
  dataCreditBalance: number;
  airtimeBalance: number;
  user: {
    name: string | null;
    email: string;
  };
};
