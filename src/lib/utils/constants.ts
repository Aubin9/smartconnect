export const APP_NAME = 'SmartConnect';
export const WAT_TIME_ZONE = 'Africa/Douala';

export const CAMEROON_CENTER = {
  latitude: 5.9631,
  longitude: 10.1591
};

export const NETWORK_THRESHOLDS = {
  congestionProbability: 0.75,
  minimumThroughputMbps: 0.512,
  degradationMinutes: 15,
  dailyCreditCapXaf: 500,
  creditPerWindowXaf: 100
};

export const CDWM_RULES = {
  insurancePremiumXaf: 50,
  insurancePayoutXaf: 500,
  insuranceOutageHours: 3,
  bridgeTrustScore: 40,
  loanTrustScore: 70,
  loanAccountAgeMonths: 6,
  maxLoanXaf: 25000,
  bridgeFeePercent: 5.5,
  loanInterestWeeklyPercent: 3.5
};

export const DASHBOARD_NAVIGATION = [
  { href: '/dashboard', label: 'Live Network Overview', icon: 'Activity' },
  { href: '/dashboard/network', label: 'Congestion Prediction Map', icon: 'Map' },
  { href: '/dashboard/subscribers', label: 'Subscriber Analytics', icon: 'Users' },
  { href: '/dashboard/financial', label: 'Financial Dashboard', icon: 'Wallet' },
  { href: '/dashboard/ml-model', label: 'ML Model Performance', icon: 'Bot' },
  { href: '/dashboard/settings', label: 'System Configuration', icon: 'Settings' },
  { href: '/dashboard/reports', label: 'Reports & Compliance', icon: 'ClipboardList' }
] as const;

export const MOBILE_NAVIGATION = [
  { href: '/mobile', label: 'Home', icon: 'Home' },
  { href: '/mobile/quality', label: 'Quality', icon: 'BarChart3' },
  { href: '/mobile/wallet', label: 'Wallet', icon: 'CreditCard' },
  { href: '/mobile/alerts', label: 'Alerts', icon: 'Bell' },
  { href: '/mobile/profile', label: 'Profile', icon: 'UserCircle' }
] as const;
