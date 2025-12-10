export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  source: 'Discovery' | 'Absa';
}

export interface CategorySummary {
  name: string;
  value: number;
  color: string;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  FORENSIC = 'FORENSIC',
  POINTS_STRATEGY = 'POINTS_STRATEGY',
  BUDGET_TOOL = 'BUDGET_TOOL'
}