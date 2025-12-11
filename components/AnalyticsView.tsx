import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, formatCurrency } from '../constants';
import { Transaction } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  AreaChart, Area, PieChart, Pie, Legend
} from 'recharts';
import { 
  BarChart3, Calendar, ChevronDown, TrendingUp, TrendingDown, 
  Wallet, CreditCard, ShoppingBag, Store, Clock, Zap, AlertTriangle, Lightbulb 
} from 'lucide-react';

const COLORS = {
  primary: '#0d9488', // Teal
  secondary: '#3b82f6', // Blue
  tertiary: '#8b5cf6', // Purple
  income: '#10b981', // Green
  expense: '#ef4444', // Red
  neutral: '#64748b', // Gray
  cardBg: '#1e293b',
  mainBg: '#0f172a',
  text: '#f1f5f9',
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

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const AnalyticsView: React.FC = () => {
  // State
  const [timeRange, setTimeRange] = useState<'MONTH' | '3MONTHS' | '6MONTHS' | 'YEAR' | 'ALL'>('3MONTHS');
  const [comparePeriod, setComparePeriod] = useState(false);

  // --- Data Processing Helpers ---

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case 'MONTH': start.setMonth(start.getMonth() - 1); break;
      case '3MONTHS': start.setMonth(start.getMonth() - 3); break;
      case '6MONTHS': start.setMonth(start.getMonth() - 6); break;
      case 'YEAR': start.setFullYear(start.getFullYear() - 1); break;
      case 'ALL': start.setFullYear(2000); break; // Way back
    }
    return { start, end };
  };

  const { start, end } = getDateRange();

  // Filter Data
  const filteredData = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });
  }, [timeRange, start, end]);

  // Comparison Data (Previous Period)
  const prevData = useMemo(() => {
    if (!comparePeriod) return [];
    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime());
    const prevStart = new Date(start.getTime() - duration);
    return MOCK_TRANSACTIONS.filter(t => {
      const d = new Date(t.date);
      return d >= prevStart && d <= prevEnd;
    });
  }, [comparePeriod, start, end]);

  // --- Calculations ---

  const calculateTotals = (data: Transaction[]) => {
    let income = 0;
    let expense = 0;
    data.forEach(t => {
      if (t.amount > 0) income += t.amount;
      else expense += Math.abs(t.amount);
    });
    return { income, expense, net: income - expense, count: data.length };
  };

  const currentTotals = calculateTotals(filteredData);
  const prevTotals = calculateTotals(prevData);

  const getPercentChange = (current: number, prev: number) => {
    if (prev === 0) return 0;
    return ((current - prev) / prev) * 100;
  };

  // Category Breakdown
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    let totalExp = 0;
    filteredData.forEach(t => {
      if (t.amount < 0) {
        const val = Math.abs(t.amount);
        map.set(t.category, (map.get(t.category) || 0) + val);
        totalExp += val;
      }
    });

    const sorted = Array.from(map.entries())
      .map(([name, value]) => ({ name, value, percent: (value / totalExp) * 100 }))
      .sort((a, b) => b.value - a.value);

    // Group Top 11 + Other
    const top11 = sorted.slice(0, 11);
    const otherVal = sorted.slice(11).reduce((acc, curr) => acc + curr.value, 0);
    if (otherVal > 0) {
      top11.push({ name: 'Other', value: otherVal, percent: (otherVal / totalExp) * 100 });
    }
    return top11;
  }, [filteredData]);

  // Monthly Trend
  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number, expense: number }>();
    
    // Sort transactions by date first
    const sortedTx = [...filteredData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTx.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`; // e.g. "Dec 2025"
      
      if (!map.has(key)) map.set(key, { income: 0, expense: 0 });
      const entry = map.get(key)!;
      
      if (t.amount > 0) entry.income += t.amount;
      else entry.expense += Math.abs(t.amount);
    });

    return Array.from(map.entries()).map(([month, vals]) => ({
      month,
      income: vals.income,
      expense: vals.expense,
      net: vals.income - vals.expense
    }));
  }, [filteredData]);

  // Merchant Ranking
  const merchantData = useMemo(() => {
    const map = new Map<string, { count: number, value: number, category: string }>();
    
    filteredData.filter(t => t.amount < 0).forEach(t => {
      // Basic normalization
      let name = t.clean_merchant || t.description;
      name = name.replace(/POS\s+/i, '').replace(/Purchase\s+/i, '').replace(/\d{4,}/, '').trim();
      if (name.length > 20) name = name.substring(0, 20) + '...';

      if (!map.has(name)) map.set(name, { count: 0, value: 0, category: t.category });
      const entry = map.get(name)!;
      entry.count += 1;
      entry.value += Math.abs(t.amount);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data, avg: data.value / data.count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [filteredData]);

  // Day of Week Analysis
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sums = new Array(7).fill(0);
    const counts = new Array(7).fill(0);

    filteredData.filter(t => t.amount < 0).forEach(t => {
      const d = new Date(t.date).getDay();
      sums[d] += Math.abs(t.amount);
      counts[d] += 1;
    });

    return days.map((day, i) => ({
      day,
      avg: counts[i] ? sums[i] / counts[i] : 0,
      total: sums[i]
    }));
  }, [filteredData]);

  // --- Render Components ---

  const TrendIndicator = ({ current, prev, isExpense = false }: { current: number, prev: number, isExpense?: boolean }) => {
    if (!comparePeriod) return null;
    const change = getPercentChange(current, prev);
    if (isNaN(change)) return null;
    
    const isGood = isExpense ? change < 0 : change > 0;
    const Icon = change > 0 ? TrendingUp : TrendingDown;
    const colorClass = isGood ? 'text-green-400' : 'text-red-400';

    return (
      <div className={`flex items-center gap-1 text-xs font-bold ${colorClass}`}>
        <Icon size={12} />
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-[#f1f5f9] animate-fade-in pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur border-b border-[#1e293b] p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0d9488]/20 rounded-lg text-[#0d9488]">
              <BarChart3 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Analytics</h1>
              <p className="text-xs text-slate-400">
                Showing: {formatDate(start)} - {formatDate(end)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {['MONTH', '3MONTHS', '6MONTHS', 'YEAR', 'ALL'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  timeRange === r 
                    ? 'bg-[#0d9488] border-[#0d9488] text-white' 
                    : 'bg-[#1e293b] border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {r === 'MONTH' ? 'This Month' : r === 'ALL' ? 'All Time' : r.replace('MONTHS', ' Months')}
              </button>
            ))}
            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-white">
              <input 
                type="checkbox" 
                checked={comparePeriod} 
                onChange={(e) => setComparePeriod(e.target.checked)}
                className="rounded bg-slate-800 border-slate-600 text-[#0d9488] focus:ring-0" 
              />
              Compare previous
            </label>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
              <TrendIndicator current={currentTotals.expense} prev={prevTotals.expense} isExpense />
            </div>
            <div className="text-2xl font-mono font-bold text-white mb-1">
              {formatCurrency(currentTotals.expense)}
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[70%]"></div>
            </div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income</span>
              <TrendIndicator current={currentTotals.income} prev={prevTotals.income} />
            </div>
            <div className="text-2xl font-mono font-bold text-white mb-1">
              {formatCurrency(currentTotals.income)}
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%]"></div>
            </div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Savings</span>
            </div>
            <div className={`text-2xl font-mono font-bold mb-1 ${currentTotals.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(currentTotals.net)}
            </div>
            <p className="text-xs text-slate-500">
              Savings Rate: <span className="text-white font-bold">{((currentTotals.net / currentTotals.income) * 100).toFixed(1)}%</span>
            </p>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transactions</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white mb-1">
              {currentTotals.count}
            </div>
            <p className="text-xs text-slate-500">
              Avg Transaction: <span className="text-white font-bold">{formatCurrency(currentTotals.expense / currentTotals.count)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 1: Spending by Category */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-xl border border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#0d9488]" /> Spending by Category
              </h3>
              <p className="text-xs text-slate-400">Top expense categories by volume</p>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  cursor={{fill: '#334155', opacity: 0.2}}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 1B: Donut Chart */}
        <div className="lg:col-span-1 bg-[#1e293b] rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center">
           <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 w-full text-left">Distribution</h3>
           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-xs text-slate-500">Total</span>
                <p className="text-sm font-bold text-white">{formatCurrency(currentTotals.expense)}</p>
              </div>
           </div>
           
           <div className="w-full mt-4 space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#64748b' }}></div>
                    <span className="text-slate-300">{cat.name}</span>
                  </div>
                  <span className="font-mono text-slate-400">{cat.percent.toFixed(1)}%</span>
                </div>
              ))}
           </div>
        </div>

        {/* SECTION 2: Monthly Trend */}
        <div className="lg:col-span-3 bg-[#1e293b] rounded-xl border border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar size={18} className="text-[#3b82f6]" /> Monthly Cash Flow
              </h3>
              <p className="text-xs text-slate-400">Income vs Expenses over time</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `R${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 4: Top Merchants */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-xl border border-slate-800 p-6">
           <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Store size={18} className="text-[#eab308]" /> Top Merchants
           </h3>
           <div className="space-y-4">
              {merchantData.map((m, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#0f172a] border border-slate-700 flex items-center justify-center font-bold text-slate-500 text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-200">{m.name}</span>
                      <span className="font-mono font-bold text-white">{formatCurrency(m.value)}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0d9488]" style={{ width: `${(m.value / merchantData[0].value) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                      <span>{m.count} visits • Avg {formatCurrency(m.avg)}</span>
                      <span>{m.category}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* SECTION 5: Averages & Insights */}
        <div className="lg:col-span-1 space-y-6">
           {/* Day of Week */}
           <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Clock size={14} /> Weekly Rhythm
              </h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayOfWeekData}>
                    <XAxis dataKey="day" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#334155', opacity: 0.2}}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: number) => formatCurrency(val)}
                    />
                    <Bar dataKey="avg" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-slate-500 mt-2">Average spending per day</p>
           </div>

           {/* Insights */}
           <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Zap size={18} className="text-[#eab308]" /> Auto-Insights
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start p-3 bg-[#0f172a] rounded-lg border border-slate-800">
                  <Lightbulb size={16} className="text-yellow-500 mt-1 shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white block mb-1">Fixed Cost Alert</strong>
                    Vehicle finance ({formatCurrency(categoryData.find(c => c.name === 'Vehicle Finance')?.value || 0)}) makes up {(categoryData.find(c => c.name === 'Vehicle Finance')?.percent || 0).toFixed(1)}% of your total spend.
                  </p>
                </div>

                <div className="flex gap-3 items-start p-3 bg-[#0f172a] rounded-lg border border-slate-800">
                  <AlertTriangle size={16} className="text-orange-500 mt-1 shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white block mb-1">Subscription Audit</strong>
                    You have {filteredData.filter(t => t.category === 'Subscriptions').length} active subscription transactions totaling {formatCurrency(currentTotals.expense * ((categoryData.find(c => c.name === 'Subscriptions')?.percent || 0) / 100))}.
                  </p>
                </div>

                <div className="flex gap-3 items-start p-3 bg-[#0f172a] rounded-lg border border-slate-800">
                  <Wallet size={16} className="text-blue-500 mt-1 shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white block mb-1">Cash Flow Velocity</strong>
                    On average, you spend <span className="text-white font-bold">{formatCurrency(currentTotals.expense / 30)}</span> per day this period.
                  </p>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};