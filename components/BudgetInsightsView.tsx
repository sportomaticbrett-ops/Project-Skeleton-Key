import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_TRANSACTIONS, formatCurrency, DEFAULT_CATEGORIES } from '../constants';
import { Transaction, Budget } from '../types';
import { 
  Lightbulb, ChevronLeft, ChevronRight, Plus, Info, 
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle,
  Car, ShoppingCart, Utensils, Smartphone, PartyPopper, Dog, HeartPulse, ShoppingBag, Shield, Home, Banknote, HelpCircle, Phone, Wallet
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';

const COLORS = {
  green: '#10b981',
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  gray: '#64748b',
  teal: '#0d9488',
  bg: '#0f172a',
  card: '#1e293b'
};

const getCategoryIcon = (category: string) => {
  const map: Record<string, any> = {
    'Groceries': ShoppingCart,
    'Transport': Car,
    'Dining Out': Utensils,
    'Entertainment': PartyPopper,
    'Subscriptions': Smartphone,
    'Healthcare': HeartPulse,
    'Shopping': ShoppingBag,
    'Pets': Dog,
    'Insurance': Shield,
    'Vehicle Finance': Car,
    'Housing': Home,
    'Income': Banknote,
    'Telecommunications': Phone,
    'Other': HelpCircle
  };
  return map[category] || HelpCircle;
};

const CATEGORY_COLORS: Record<string, string> = {
  'Vehicle Finance': '#1e3a8a',
  'Groceries': '#10b981',
  'Transport': '#3b82f6',
  'Subscriptions': '#ec4899',
  'Shopping': '#eab308',
  'Housing': '#14b8a6',
  'Entertainment': '#a855f7',
  'Pets': '#a16207',
  'Dining Out': '#f97316',
  'Telecommunications': '#6366f1',
  'Healthcare': '#ef4444',
  'Other': '#64748b'
};

export const BudgetInsightsView: React.FC = () => {
  // --- State ---
  const [currentDate, setCurrentDate] = useState(new Date('2025-11-01')); // Default to Nov 2025 as per prompt
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBudget, setNewBudget] = useState<{ category: string, limit: string }>({ category: DEFAULT_CATEGORIES[0], limit: '' });

  // --- Load Budgets ---
  useEffect(() => {
    const saved = localStorage.getItem('sk_budgets');
    if (saved) setBudgets(JSON.parse(saved));
  }, []);

  const saveBudget = () => {
    if (!newBudget.limit) return;
    const updated = [...budgets.filter(b => b.category !== newBudget.category), { category: newBudget.category, limit: parseFloat(newBudget.limit) }];
    setBudgets(updated);
    localStorage.setItem('sk_budgets', JSON.stringify(updated));
    setShowCreateModal(false);
    setNewBudget({ category: DEFAULT_CATEGORIES[0], limit: '' });
  };

  // --- Data Calculations ---
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  const monthlyTransactions = MOCK_TRANSACTIONS.filter(t => {
    const d = new Date(t.date);
    return d >= monthStart && d <= monthEnd;
  });

  const prevMonthlyTransactions = MOCK_TRANSACTIONS.filter(t => {
    const d = new Date(t.date);
    return d >= prevMonthStart && d <= prevMonthEnd;
  });

  // Totals
  const calculateTotals = (txs: Transaction[]) => {
    let income = 0;
    let expense = 0;
    txs.forEach(t => {
      if (t.amount > 0) income += t.amount;
      else expense += Math.abs(t.amount);
    });
    return { income, expense, net: income - expense };
  };

  const currentTotals = calculateTotals(monthlyTransactions);
  const prevTotals = calculateTotals(prevMonthlyTransactions);

  // Category Breakdown
  const getCategoryData = (txs: Transaction[]) => {
    const map = new Map<string, { value: number, count: number, transactions: Transaction[] }>();
    txs.forEach(t => {
      if (t.amount < 0) {
        const val = Math.abs(t.amount);
        if (!map.has(t.category)) map.set(t.category, { value: 0, count: 0, transactions: [] });
        const entry = map.get(t.category)!;
        entry.value += val;
        entry.count += 1;
        entry.transactions.push(t);
      }
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.value - a.value);
  };

  const categorySpending = getCategoryData(monthlyTransactions);
  
  // 3-Month Average for comparison
  const getAverageSpending = (category: string) => {
    const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
    const relevantTxs = MOCK_TRANSACTIONS.filter(t => {
        const d = new Date(t.date);
        return d >= threeMonthsAgo && d < monthStart && t.category === category && t.amount < 0;
    });
    const total = relevantTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return total / 3;
  };

  // --- Handlers ---
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // --- Render Components ---

  const ProgressBar = ({ value, max, color }: { value: number, max: number, color: string }) => {
    const percent = Math.min((value / max) * 100, 100);
    return (
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] font-sans pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur border-b border-[#1e293b] p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0d9488]/20 rounded-lg text-[#0d9488]">
              <Lightbulb size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Budget Insights</h1>
              <p className="text-xs text-slate-400">Understand your spending and take control</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1e293b] rounded-lg p-1 border border-slate-700">
                <button onClick={prevMonth} className="p-1 hover:bg-slate-700 rounded"><ChevronLeft size={16} /></button>
                <span className="text-sm font-bold w-32 text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={nextMonth} className="p-1 hover:bg-slate-700 rounded"><ChevronRight size={16} /></button>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0d9488]/20"
            >
              <Plus size={16} /> Create Budget
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Hero: Financial Health Score */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0d9488]/10 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="#334155" strokeWidth="8" fill="none" />
                        <circle cx="64" cy="64" r="60" stroke="#0d9488" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset={377 - (377 * 0.67)} />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">67</span>
                        <span className="text-[10px] text-slate-400 uppercase">Score</span>
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Your Financial Health Score</h2>
                        <p className="text-sm text-slate-400">You're spending more than you earn. Focus on reducing discretionary expenses.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Spending</span>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full"><div className="h-full bg-yellow-500 w-[58%] rounded-full"></div></div>
                            <span className="text-xs text-yellow-500 font-bold mt-1 block">58/100</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Savings</span>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full"><div className="h-full bg-orange-500 w-[45%] rounded-full"></div></div>
                            <span className="text-xs text-orange-500 font-bold mt-1 block">45/100</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Budget</span>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full"><div className="h-full bg-green-500 w-[72%] rounded-full"></div></div>
                            <span className="text-xs text-green-500 font-bold mt-1 block">72/100</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Debt</span>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full"><div className="h-full bg-green-500 w-[93%] rounded-full"></div></div>
                            <span className="text-xs text-green-500 font-bold mt-1 block">93/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Overview Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
                <div className="text-2xl font-mono font-bold text-white mt-1 mb-2">{formatCurrency(currentTotals.expense)}</div>
                <div className="flex items-center gap-1 text-xs text-red-400 font-bold">
                    <TrendingUp size={12} />
                    <span>{formatCurrency(currentTotals.expense - prevTotals.expense)} vs last month</span>
                </div>
            </div>
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income</span>
                <div className="text-2xl font-mono font-bold text-white mt-1 mb-2">{formatCurrency(currentTotals.income)}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                    <Minus size={12} />
                    <span>Stable income</span>
                </div>
            </div>
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 border-l-4 border-l-red-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net This Month</span>
                <div className="text-2xl font-mono font-bold text-red-400 mt-1 mb-2">{formatCurrency(currentTotals.net)}</div>
                <div className="flex items-center gap-1 text-xs text-red-400 font-bold">
                    <AlertTriangle size={12} />
                    <span>Deficit Alert</span>
                </div>
            </div>
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days Until Payday</span>
                <div className="text-2xl font-mono font-bold text-white mt-1 mb-2">15 Days</div>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                    <span>Est. daily allowance: R830</span>
                </div>
            </div>
        </div>

        {/* Section 1: Where Money Went */}
        <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Wallet size={18} className="text-[#0d9488]" /> Where Your Money Went
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySpending.map((cat, idx) => {
                    const avg = getAverageSpending(cat.name);
                    const variance = avg > 0 ? ((cat.value - avg) / avg) * 100 : 0;
                    const Icon = getCategoryIcon(cat.name);
                    const isHigh = variance > 20;
                    
                    return (
                        <div key={idx} className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isHigh ? 'bg-red-900/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                                        <p className="text-xs text-slate-500">{cat.count} txns</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${isHigh ? 'bg-red-900/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {isHigh ? `↑ ${variance.toFixed(0)}%` : 'Normal'}
                                </span>
                            </div>
                            <div className="mb-2">
                                <span className="text-xl font-mono font-bold text-white">{formatCurrency(cat.value)}</span>
                                <span className="text-xs text-slate-500 ml-2">({((cat.value / currentTotals.expense) * 100).toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${isHigh ? 'bg-red-500' : 'bg-[#0d9488]'}`} 
                                    style={{ width: `${Math.min((cat.value / (avg * 1.5 || cat.value)) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 truncate">
                                Avg: {formatCurrency(avg)} • Top: {cat.transactions[0].clean_merchant || cat.transactions[0].description.substring(0,15)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Section 2: AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <span className="text-xl">🤖</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">AI Financial Insights</h3>
                        <p className="text-xs text-slate-400">Personalized observations from your data</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Critical */}
                    {currentTotals.net < 0 && (
                        <div className="bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-red-500 shrink-0 mt-1" size={18} />
                                <div>
                                    <h4 className="font-bold text-red-200 text-sm">Overspending Alert</h4>
                                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                        You've spent <span className="font-bold text-white">{formatCurrency(Math.abs(currentTotals.net))}</span> more than you earned this month. 
                                        At this rate, you'll deplete savings by ~{formatCurrency(Math.abs(currentTotals.net) * 12)} per year.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subscription Creep */}
                    <div className="bg-orange-900/10 border-l-4 border-orange-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <Smartphone className="text-orange-500 shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-orange-200 text-sm">Subscription Audit</h4>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                    Your subscription costs are <span className="font-bold text-white">R 3,234.56</span> this month. 
                                    Found 9 active recurring charges including Elementor, Netflix, and Claude AI.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Positive */}
                    <div className="bg-green-900/10 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-green-500 shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-green-200 text-sm">Consistent Income</h4>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                    Your salary from SolarAfrica Energy has been consistent for 6+ months. This stability builds a strong budgeting foundation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations Column */}
            <div className="space-y-4">
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-white text-sm mb-3">50/30/20 Analysis</h4>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Needs (Target 50%)</span>
                                <span className="text-red-400 font-bold">67%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-red-500 w-[67%] rounded-full"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Wants (Target 30%)</span>
                                <span className="text-green-400 font-bold">28%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-green-500 w-[28%] rounded-full"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Savings (Target 20%)</span>
                                <span className="text-orange-400 font-bold">5%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-orange-500 w-[5%] rounded-full"></div></div>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-3 italic">Vehicle finance is inflating your 'Needs'.</p>
                </div>

                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-white text-sm mb-3">Quick Wins</h4>
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded border border-slate-700">
                            <span className="text-slate-300">Cancel unused subs</span>
                            <span className="text-green-400 font-mono font-bold">+R747</span>
                        </li>
                        <li className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded border border-slate-700">
                            <span className="text-slate-300">Pack lunch 2x/week</span>
                            <span className="text-green-400 font-mono font-bold">+R400</span>
                        </li>
                        <li className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded border border-slate-700">
                            <span className="text-slate-300">Switch bank account</span>
                            <span className="text-green-400 font-mono font-bold">+R200</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Section 4: Budget Tracking */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield size={18} className="text-[#0d9488]" /> Budget Tracking
                </h3>
            </div>

            {budgets.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-8 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                        <Banknote size={32} />
                    </div>
                    <h3 className="text-white font-bold mb-2">No Budgets Set</h3>
                    <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                        Based on your spending, we suggest starting with a Grocery budget of R2,500 and Dining Out budget of R1,200.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => {
                                const defaults = [
                                    { category: 'Groceries', limit: 2500 },
                                    { category: 'Dining Out', limit: 1200 },
                                    { category: 'Transport', limit: 2000 },
                                    { category: 'Entertainment', limit: 1500 }
                                ];
                                setBudgets(defaults);
                                localStorage.setItem('sk_budgets', JSON.stringify(defaults));
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
                        >
                            Use Suggested
                        </button>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg font-bold text-sm"
                        >
                            Create Custom
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {budgets.map((budget, idx) => {
                        const spent = categorySpending.find(c => c.name === budget.category)?.value || 0;
                        const remaining = budget.limit - spent;
                        const percent = (spent / budget.limit) * 100;
                        const isOver = spent > budget.limit;

                        return (
                            <div key={idx} className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white">{budget.category}</span>
                                    <span className="text-xs text-slate-500 font-mono">Limit: {formatCurrency(budget.limit)}</span>
                                </div>
                                <div className="mb-2">
                                    <span className={`text-2xl font-mono font-bold ${isOver ? 'text-red-400' : 'text-white'}`}>
                                        {formatCurrency(spent)}
                                    </span>
                                </div>
                                <ProgressBar value={spent} max={budget.limit} color={isOver ? COLORS.red : percent > 80 ? COLORS.yellow : COLORS.green} />
                                <div className="flex justify-between items-center mt-3 text-xs">
                                    <span className={isOver ? 'text-red-400 font-bold' : 'text-slate-400'}>
                                        {isOver ? `Over by ${formatCurrency(Math.abs(remaining))}` : `${formatCurrency(remaining)} left`}
                                    </span>
                                    <span className="text-slate-500">{percent.toFixed(0)}%</span>
                                </div>
                            </div>
                        );
                    })}
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#1e293b] border-2 border-dashed border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center text-slate-500 hover:text-[#0d9488] hover:border-[#0d9488] transition-colors"
                    >
                        <Plus size={24} className="mb-2" />
                        <span className="text-sm font-bold">Add Budget</span>
                    </button>
                </div>
            )}
        </div>

      </div>

      {/* Create Budget Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-4">Create New Budget</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                        <select 
                            value={newBudget.category}
                            onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                            className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]"
                        >
                            {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Limit (R)</label>
                        <input 
                            type="number"
                            value={newBudget.limit}
                            onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                            placeholder="e.g. 2000"
                            className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]"
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowCreateModal(false)} className="flex-1 text-slate-400 hover:text-white py-2 font-bold text-sm">Cancel</button>
                    <button onClick={saveBudget} className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white py-2 rounded-lg font-bold text-sm">Save Budget</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};