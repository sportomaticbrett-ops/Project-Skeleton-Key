import { Transaction, CategorySummary, Budget, DietPlan } from './types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Parsing insights from the provided CSV logs (Simulated aggregation for the UI)
export const INSIGHTS = {
  totalDebtService: 38500, // Approx annual interest + fees based on logs
  uberEatsTotal: 42000, // Significant drain identified
  groceriesTotal: 85000,
  subscriptionsTotal: 18000, // Dollar based SaaS + Streaming
  vapingLegacy: 12000, // To be ignored for future, but noted as savings
  googleAds: 45000, // Business expense on personal card?
  safeToSpend: 12500, // Calculated metric
  monthlyIncome: 65000, // Estimated
};

export const CATEGORY_DATA: CategorySummary[] = [
  { name: 'Debt Service', value: 38500, color: '#ef4444' }, // Red - Critical
  { name: 'Convenience', value: 54000, color: '#b91c1c' }, // Highbury Red
  { name: 'Groceries', value: 85000, color: '#65a30d' }, // Sage Green
  { name: 'Business Tools', value: 65000, color: '#3b82f6' }, // Blue - Business
  { name: 'Lifestyle & Subs', value: 25000, color: '#8b5cf6' }, // Purple
  { name: 'Fuel', value: 32000, color: '#64748b' }, // Gray
];

export const MONTHLY_SPEND_TREND = [
  { month: 'Sep', spend: 42000, debt: 105000, laziness: 4500 },
  { month: 'Oct', spend: 45000, debt: 108000, laziness: 5200 },
  { month: 'Nov', spend: 52000, debt: 112000, laziness: 6100 },
  { month: 'Dec', spend: 68000, debt: 125000, laziness: 8500 },
  { month: 'Jan', spend: 38000, debt: 122000, laziness: 3200 },
  { month: 'Feb', spend: 41000, debt: 120000, laziness: 3500 },
];

export const BUDGET_LIMITS: Budget[] = [
  { category: 'Groceries', limit: 8000 },
  { category: 'Convenience', limit: 2500 },
  { category: 'Fuel', limit: 3000 },
  { category: 'Business Tools', limit: 5000 },
  { category: 'Lifestyle & Subs', limit: 1500 },
  { category: 'Debt Service', limit: 4000 },
  { category: 'Food & Dining', limit: 2000 },
];

export const DIET_PLANS: DietPlan[] = [
  { id: 'keto', name: 'The Budget Keto', description: '<20g Carbs, High Fat', budget_weekly: 800 },
  { id: 'protein', name: 'Lean Protein Bulk', description: '180g Protein, Rice & Chicken', budget_weekly: 1000 },
  { id: 'balanced', name: 'Mediterranean Balanced', description: 'Whole grains, fish, oils', budget_weekly: 1200 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-02-28', description: 'POS DEBIT TST* TOAST INC', clean_merchant: 'Toast POS', amount: 450.00, category: 'Food & Dining', source: 'Discovery', budget_cap: 2000 },
  { id: '2', date: '2024-02-27', description: 'Uber Eats SA Help.Uber.com', clean_merchant: 'Uber Eats', amount: 235.50, category: 'Convenience', source: 'Absa', budget_cap: 2500 },
  { id: '3', date: '2024-02-27', description: 'CHECKERS HYPER SANDTON', clean_merchant: 'Checkers Hyper', amount: 1850.00, category: 'Groceries', source: 'Discovery', budget_cap: 8000 },
  { id: '4', date: '2024-02-26', description: 'GOOGLE *ADS34857', clean_merchant: 'Google Ads', amount: 4500.00, category: 'Business Tools', source: 'Discovery', is_recurring: true, budget_cap: 5000 },
  { id: '5', date: '2024-02-25', description: 'Netflix.com', clean_merchant: 'Netflix', amount: 199.00, category: 'Lifestyle & Subs', source: 'Absa', is_recurring: true, budget_cap: 1500 },
  { id: '6', date: '2024-02-25', description: 'Uber Trip', clean_merchant: 'Uber Ride', amount: 120.00, category: 'Convenience', source: 'Absa', budget_cap: 2500 },
  { id: '7', date: '2024-02-24', description: 'ENGEN 1 STOP', clean_merchant: 'Engen', amount: 850.00, category: 'Fuel', source: 'Discovery', budget_cap: 3000 },
  { id: '8', date: '2024-02-23', description: 'Midjourney Inc', clean_merchant: 'Midjourney', amount: 600.00, category: 'Business Tools', source: 'Discovery', is_recurring: true, budget_cap: 5000 },
  { id: '9', date: '2024-02-22', description: 'Uber Eats SA', clean_merchant: 'Uber Eats', amount: 185.00, category: 'Convenience', source: 'Absa', budget_cap: 2500 },
  { id: '10', date: '2024-02-20', description: 'Mr D Food', clean_merchant: 'Mr D Food', amount: 285.00, category: 'Convenience', source: 'Absa', budget_cap: 2500 },
  { id: '11', date: '2024-02-18', description: 'CHECKERS LIQUOR', clean_merchant: 'Checkers Liquor', amount: 450.00, category: 'Groceries', source: 'Discovery', budget_cap: 8000 },
  { id: '12', date: '2024-02-15', description: 'DISCHEM PHARMACY', clean_merchant: 'Dis-Chem', amount: 340.00, category: 'Healthcare', source: 'Discovery', budget_cap: 1500 },
  { id: '13', date: '2024-02-14', description: 'WOOLWORTHS FOOD', clean_merchant: 'Woolworths', amount: 560.00, category: 'Groceries', source: 'Discovery', budget_cap: 8000 },
  { id: '14', date: '2024-02-12', description: 'CALTEX VREDEHOEK', clean_merchant: 'Caltex', amount: 400.00, category: 'Fuel', source: 'Absa', budget_cap: 3000 },
];