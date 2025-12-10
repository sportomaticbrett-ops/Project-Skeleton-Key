import { Transaction, CategorySummary } from './types';

// Parsing insights from the provided CSV logs (Simulated aggregation for the UI)
export const INSIGHTS = {
  totalDebtService: 38500, // Approx annual interest + fees based on logs
  uberEatsTotal: 42000, // Significant drain identified
  groceriesTotal: 85000,
  subscriptionsTotal: 18000, // Dollar based SaaS + Streaming
  vapingLegacy: 12000, // To be ignored for future, but noted as savings
  googleAds: 45000, // Business expense on personal card?
};

export const CATEGORY_DATA: CategorySummary[] = [
  { name: 'Debt Service (Interest/Fees)', value: 38500, color: '#ef4444' }, // Red - Critical
  { name: 'Convenience (Uber Eats/Rides)', value: 54000, color: '#f97316' }, // Orange - Warning
  { name: 'Groceries (Checkers/Woolies)', value: 85000, color: '#10b981' }, // Green - Essential
  { name: 'Business Tools (Ads/SaaS)', value: 65000, color: '#3b82f6' }, // Blue - Business
  { name: 'Lifestyle & Subs', value: 25000, color: '#8b5cf6' }, // Purple
  { name: 'Fuel', value: 32000, color: '#64748b' }, // Gray
];

export const MONTHLY_SPEND_TREND = [
  { month: 'Sep', spend: 42000, debt: 105000 },
  { month: 'Oct', spend: 45000, debt: 108000 },
  { month: 'Nov', spend: 52000, debt: 112000 },
  { month: 'Dec', spend: 68000, debt: 125000 }, // Holiday spike
  { month: 'Jan', spend: 38000, debt: 122000 },
  { month: 'Feb', spend: 41000, debt: 120000 },
];
