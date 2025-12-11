import { Transaction, CategorySummary, Budget, Asset, Liability, PartnerStrategy, DietPlan, GroceryItem, Meal } from './types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const INSIGHTS = {
  totalDebtService: 38500,
  uberEatsTotal: 42000,
  groceriesTotal: 85000,
  subscriptionsTotal: 18000,
  vapingLegacy: 12000,
  googleAds: 45000,
  safeToSpend: 12500,
  grossIncome: 65000, // User stated Gross
  netIncome: 47180.19, // From Payslip
  monthlyIncome: 47180.19, // Using Net for calculations
};

export const DEFAULT_CATEGORIES = [
  'Housing', 
  'Transport', 
  'Food & Dining', 
  'Groceries', 
  'Utilities', 
  'Insurance', 
  'Healthcare', 
  'Savings', 
  'Entertainment', 
  'Personal Care', 
  'Business Tools',
  'Fuel',
  'Debt Service',
  'Convenience',
  'Lifestyle & Subs'
];

// Data Correction: Updated Assets
export const ASSETS: Asset[] = [
  { id: '1', name: 'Momentum Provident Fund', value: 255307.00, type: 'Investment' },
  { id: '2', name: 'Renault Clio IV (Hollard)', value: 164600.00, type: 'Vehicle' },
  { id: '3', name: 'Discovery Invest', value: 99113.00, type: 'Investment' },
  { id: '4', name: 'Allan Gray Investment', value: 1067.00, type: 'Investment' },
];

// Data Correction: Updated Liabilities
export const LIABILITIES: Liability[] = [
  { id: '1', name: 'Discovery Revolving Credit', value: 119000.00, interestRate: 20.25, minPayment: 4500 },
  { id: '2', name: 'Capitec Credit', value: 104329.35, interestRate: 16.5, minPayment: 3800 },
  { id: '3', name: 'Absa Vehicle Finance', value: 4000.00, interestRate: 11.5, minPayment: 900 },
  { id: '4', name: 'Absa Credit Card', value: 0.00, interestRate: 0.0, minPayment: 0 },
];

export const CATEGORY_DATA: CategorySummary[] = [
  { name: 'Debt Service', value: 38500, color: '#ef4444' },
  { name: 'Convenience', value: 54000, color: '#b91c1c' },
  { name: 'Groceries', value: 85000, color: '#65a30d' },
  { name: 'Business Tools', value: 65000, color: '#3b82f6' },
  { name: 'Lifestyle & Subs', value: 25000, color: '#8b5cf6' },
  { name: 'Fuel', value: 32000, color: '#64748b' },
];

export const MONTHLY_SPEND_TREND = [
  { month: 'Sep', spend: 42000, debt: 215000, laziness: 4500 },
  { month: 'Oct', spend: 45000, debt: 218000, laziness: 5200 },
  { month: 'Nov', spend: 52000, debt: 222000, laziness: 6100 },
  { month: 'Dec', spend: 68000, debt: 235000, laziness: 8500 },
  { month: 'Jan', spend: 38000, debt: 230000, laziness: 3200 },
  { month: 'Feb', spend: 41000, debt: 227329, laziness: 3500 },
];

export const BUDGET_LIMITS: Budget[] = [
  { category: 'Groceries', limit: 8000 },
  { category: 'Convenience', limit: 2500 },
  { category: 'Fuel', limit: 3000 },
  { category: 'Business Tools', limit: 5000 },
  { category: 'Lifestyle & Subs', limit: 1500 },
  { category: 'Debt Service', limit: 8000 },
  { category: 'Food & Dining', limit: 2000 },
];

export const GROCERY_DATABASE: GroceryItem[] = [
  // Proteins
  { id: '1', name: 'Lean Mince 1kg', price: 129.00, macros: 'P:20g F:10g', category: 'Protein' },
  { id: '2', name: 'Chicken Breast 1kg', price: 89.00, macros: 'P:31g F:3g', category: 'Protein' },
  { id: '3', name: 'Large Eggs 30s', price: 79.00, macros: 'P:6g F:5g (per egg)', category: 'Protein' },
  { id: '4', name: 'Whey Protein 900g', price: 350.00, macros: 'P:24g', category: 'Protein' },
  { id: '12', name: 'Hake Fillets 800g', price: 119.00, macros: 'P:18g F:1g', category: 'Protein' },
  { id: '13', name: 'Sirloin Steak 200g', price: 65.00, macros: 'P:40g F:12g', category: 'Protein' },
  { id: '14', name: 'Championship Boerewors', price: 89.00, macros: 'P:16g F:18g', category: 'Protein' },
  
  // Carbs
  { id: '5', name: 'Jungle Oats 1kg', price: 35.00, macros: 'C:60g F:6g', category: 'Carb' },
  { id: '6', name: 'Basmati Rice 2kg', price: 65.00, macros: 'C:78g', category: 'Carb' },
  { id: '7', name: 'Sweet Potato 1kg', price: 25.00, macros: 'C:20g', category: 'Carb' },
  { id: '15', name: 'Pasta (Durum Wheat) 500g', price: 18.00, macros: 'C:70g', category: 'Carb' },
  { id: '16', name: 'Wholewheat Bread', price: 19.00, macros: 'C:40g', category: 'Carb' },
  { id: '17', name: 'Potatoes Washing 2kg', price: 45.00, macros: 'C:17g', category: 'Carb' },

  // Veg & Fats
  { id: '8', name: 'Broccoli Pre-pack', price: 19.00, macros: 'Micros', category: 'Veg' },
  { id: '9', name: 'Spinach Bunch', price: 12.00, macros: 'Micros', category: 'Veg' },
  { id: '10', name: 'Olive Oil 1L', price: 140.00, macros: 'F:100g', category: 'Fat' },
  { id: '11', name: 'Almonds 100g', price: 45.00, macros: 'F:50g P:20g', category: 'Fat' },
  { id: '18', name: 'Avocado (Ripe)', price: 15.00, macros: 'F:15g', category: 'Fat' },
  { id: '19', name: 'Peanut Butter 400g', price: 42.00, macros: 'F:50g P:25g', category: 'Fat' },
  { id: '20', name: 'Mixed Veg Frozen 1kg', price: 39.00, macros: 'Micros', category: 'Veg' },
];

export const MEAL_OPTIONS: Meal[] = [
  { id: 'm1', name: 'Steak & Eggs Breakfast', price: 85.00, macros: 'P:50g F:30g', ingredients: ['Sirloin Steak', '2 Eggs', 'Butter'] },
  { id: 'm2', name: 'Chicken & Broccoli Bowl', price: 45.00, macros: 'P:40g C:10g', ingredients: ['Chicken Breast', 'Broccoli', 'Rice'] },
  { id: 'm3', name: 'Oats & Whey', price: 25.00, macros: 'P:30g C:40g', ingredients: ['Jungle Oats', 'Whey Protein', 'Water'] },
  { id: 'm4', name: 'Mince & Potato', price: 55.00, macros: 'P:35g C:50g', ingredients: ['Lean Mince', 'Potato', 'Mixed Veg'] },
];

// Updated Triad Protocol Strategies
export const PARTNER_STRATEGIES: PartnerStrategy[] = [
  {
    category: 'Groceries (Healthy)',
    partner: 'Woolworths / Checkers',
    card: 'Discovery Bank',
    secondary_action: 'Swipe Vitality Card',
    benefit: 'Yield: Up to 75% on "HealthyFood" items.',
    rationale: 'Strictly for items with the "HealthyFood" tag.'
  },
  {
    category: 'Groceries (General)',
    partner: 'Checkers',
    card: 'Amex Platinum',
    secondary_action: 'Checkers Xtra Savings',
    benefit: 'Yield: 2% (Greenbacks).',
    rationale: 'Use for "Center Aisle" items (chips, household, wine). Beats standard bank rates.'
  },
  {
    category: 'Fuel',
    partner: 'BP',
    card: 'Amex Platinum',
    secondary_action: 'Swipe Greenbacks Card',
    benefit: 'Yield: ~3.5% (2% Amex + 25c/L Fixed).',
    rationale: 'Vitality Drive Diamond is unattainable (Bad Driver constraint). This is the Safety Net.'
  },
  {
    category: 'Toiletries/Baby',
    partner: 'Dis-Chem',
    card: 'Capitec Global One',
    secondary_action: 'Shop In-Store',
    benefit: 'Yield: 15% Instant Discount.',
    rationale: 'Mathematically superior to points. Includes baby & personal care.'
  },
  {
    category: 'Dining & Retail',
    partner: 'All High Volume',
    card: 'Amex Platinum',
    secondary_action: 'N/A',
    benefit: 'Yield: 2% Uncapped.',
    rationale: 'Amex is the vacuum for all general high-volume spend to hit Greenbacks Level 5 goals.'
  },
  {
    category: 'International',
    partner: 'Foreign Merchants',
    card: 'Capitec Global One',
    secondary_action: 'N/A',
    benefit: 'Saves ~2.75% in Forex Fees.',
    rationale: 'Zero currency conversion fees. Use for coffee, retail, and Uber abroad.'
  },
  {
    category: 'Flights',
    partner: 'Discovery Travel',
    card: 'Discovery Bank',
    secondary_action: 'Pay taxes with Amex',
    benefit: 'Yield: Up to 75% Discount.',
    rationale: 'Book via Discovery for discount. Pay taxes with Amex for superior travel insurance.'
  }
];

export const DIET_PLANS: DietPlan[] = [
  { id: '1', name: 'High Protein / Low Carb', description: 'Max muscle retention, fat loss.', budget_weekly: 1500 },
  { id: '2', name: 'Balanced / Volume', description: 'Satiety focused, moderate carbs.', budget_weekly: 1200 },
];

const today = new Date();
const formatDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: formatDate(0), description: 'POS DEBIT TST* TOAST INC', clean_merchant: 'Toast POS', amount: 450.00, category: 'Food & Dining', source: 'Discovery', budget_cap: 2000 },
  { id: '2', date: formatDate(1), description: 'Uber Eats SA Help.Uber.com', clean_merchant: 'Uber Eats', amount: 235.50, category: 'Convenience', source: 'Absa', budget_cap: 2500 },
  { id: '3', date: formatDate(2), description: 'CHECKERS HYPER SANDTON', clean_merchant: 'Checkers Hyper', amount: 1850.00, category: 'Groceries', source: 'Discovery', budget_cap: 8000 },
  { id: '4', date: formatDate(5), description: 'GOOGLE *ADS34857', clean_merchant: 'Google Ads', amount: 4500.00, category: 'Business Tools', source: 'Discovery', is_recurring: true, budget_cap: 5000 },
  { id: '5', date: formatDate(12), description: 'Netflix.com', clean_merchant: 'Netflix', amount: 199.00, category: 'Lifestyle & Subs', source: 'Absa', is_recurring: true, budget_cap: 1500 },
  { id: '6', date: formatDate(15), description: 'Uber Trip', clean_merchant: 'Uber Ride', amount: 120.00, category: 'Convenience', source: 'Absa', budget_cap: 2500 },
  { id: '7', date: formatDate(20), description: 'ENGEN 1 STOP', clean_merchant: 'Engen', amount: 850.00, category: 'Fuel', source: 'Discovery', budget_cap: 3000 },
  { id: '8', date: formatDate(25), description: 'Midjourney Inc', clean_merchant: 'Midjourney', amount: 600.00, category: 'Business Tools', source: 'Discovery', is_recurring: true, budget_cap: 5000 },
  { id: '9', date: formatDate(2), description: 'Checkers Sixty60', clean_merchant: 'Checkers', amount: 350.00, category: 'Groceries', source: 'Capitec', budget_cap: 8000 },
  { id: '10', date: formatDate(45), description: 'APPLE.COM/BILL', clean_merchant: 'Apple Services', amount: 149.00, category: 'Lifestyle & Subs', source: 'Amex', is_recurring: true, budget_cap: 1500 },
  { id: '11', date: formatDate(3), description: 'CHECKERS LIQUOR', clean_merchant: 'Checkers Liquor', amount: 450.00, category: 'Groceries', source: 'Discovery', budget_cap: 8000 },
  { id: '12', date: formatDate(6), description: 'WOOLWORTHS FOOD', clean_merchant: 'Woolworths', amount: 560.00, category: 'Groceries', source: 'Discovery', budget_cap: 8000 },
  { id: '13', date: formatDate(8), description: 'DIS-CHEM PHARMACY', clean_merchant: 'Dis-Chem', amount: 890.00, category: 'Personal Care', source: 'Capitec', budget_cap: 2000 },
  { id: '14', date: formatDate(10), description: 'VIRGIN ACTIVE', clean_merchant: 'Virgin Active', amount: 1100.00, category: 'Healthcare', source: 'Discovery', is_recurring: true, budget_cap: 1500 },
  { id: '15', date: formatDate(18), description: 'VIDALIA RESTAURANT', clean_merchant: 'Vidalia', amount: 850.00, category: 'Food & Dining', source: 'Amex', budget_cap: 2000 },
];