export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type DashboardStats = {
  activeSubscribers: number;
  currentCongestedCells: number;
  avgTrustScore: number;
  creditsDisbursedToday: number;
  pendingAlerts: number;
};
