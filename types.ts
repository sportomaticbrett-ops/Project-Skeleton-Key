export type TimeRange = 'TODAY' | 'WEEK' | 'MONTH' | '3MONTHS' | 'CUSTOM';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  clean_merchant?: string;
  amount: number;
  category: string;
  source: 'Discovery' | 'Absa';
  is_recurring?: boolean;
  budget_cap?: number; // For the Ledger view
}

export interface CategorySummary {
  name: string;
  value: number;
  color: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  budget_weekly: number;
}

export interface ShoppingItem {
  name: string;
  price: number;
  category: string;
  swap_suggestion?: {
    name: string;
    price: number;
  };
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  WALLET = 'WALLET',
  FORENSIC = 'FORENSIC',
  POINTS_STRATEGY = 'POINTS_STRATEGY',
  BUDGET_TOOL = 'BUDGET_TOOL',
  CONCIERGE = 'CONCIERGE',
  CHECKERS = 'CHECKERS'
}