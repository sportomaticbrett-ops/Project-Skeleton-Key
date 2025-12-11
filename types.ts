export type TimeRange = 'TODAY' | 'WEEK' | 'MONTH' | '3MONTHS' | 'CUSTOM';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  clean_merchant?: string;
  amount: number;
  category: string;
  source: 'Discovery' | 'Absa' | 'Capitec' | 'Amex';
  is_recurring?: boolean;
  budget_cap?: number;
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

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'Investment' | 'Vehicle' | 'Property';
}

export interface Liability {
  id: string;
  name: string;
  value: number;
  interestRate: number;
  minPayment: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  macros: string; // e.g. "P:20g C:0g F:5g"
  category: 'Protein' | 'Carb' | 'Fat' | 'Veg' | 'Other' | 'Meal';
}

export interface Meal {
  id: string;
  name: string;
  price: number;
  macros: string;
  ingredients: string[];
}

export interface PartnerStrategy {
  category: string;
  partner: string;
  card: string;
  secondary_action?: string;
  benefit: string;
  rationale: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  budget_weekly: number;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  WALLET = 'WALLET',
  PARTNER_MATRIX = 'PARTNER_MATRIX',
  DEBT_MANAGER = 'DEBT_MANAGER',
  CONCIERGE = 'CONCIERGE',
  NUTRITION = 'NUTRITION'
}