import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_TRANSACTIONS, DEFAULT_CATEGORIES, formatCurrency } from '../constants';
import { Transaction } from '../types';
import { 
  Search, Filter, Calendar, ChevronDown, ChevronLeft, ChevronRight, 
  Download, Plus, MoreHorizontal, X, Receipt, ArrowUpRight, ArrowDownLeft,
  ShoppingCart, Car, Utensils, PartyPopper, Smartphone, HeartPulse, 
  ShoppingBag, Dog, Shield, Home, Banknote, ArrowLeftRight, Landmark, HelpCircle,
  Briefcase, Edit2, Trash2, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Helper Functions & Constants ---

const COLORS = {
  bg: '#0f172a',
  card: '#1e293b',
  accent: '#0d9488', // Teal
  income: '#10b981',
  expense: '#ef4444',
  text: '#f1f5f9',
  muted: '#94a3b8',
};

const getCategoryIcon = (category: string) => {
  const map: Record<string, any> = {
    'Groceries': { icon: ShoppingCart, color: '#10b981' },
    'Transport': { icon: Car, color: '#3b82f6' },
    'Dining Out': { icon: Utensils, color: '#f97316' },
    'Food & Dining': { icon: Utensils, color: '#f97316' },
    'Entertainment': { icon: PartyPopper, color: '#a855f7' },
    'Subscriptions': { icon: Smartphone, color: '#ec4899' },
    'Healthcare': { icon: HeartPulse, color: '#ef4444' },
    'Shopping': { icon: ShoppingBag, color: '#eab308' },
    'Pets': { icon: Dog, color: '#a16207' },
    'Insurance': { icon: Shield, color: '#64748b' },
    'Vehicle Finance': { icon: Car, color: '#1e3a8a' },
    'Housing': { icon: Home, color: '#14b8a6' },
    'Income': { icon: Banknote, color: '#22c55e' },
    'Transfer': { icon: ArrowLeftRight, color: '#64748b' },
    'Bank Fees': { icon: Landmark, color: '#64748b' },
    'Business/Software': { icon: Briefcase, color: '#6366f1' },
    'Other': { icon: HelpCircle, color: '#94a3b8' }
  };
  return map[category] || { icon: HelpCircle, color: '#94a3b8' };
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// --- Main Component ---

export const WalletView: React.FC = () => {
  // --- State ---
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Income' | 'Expense'>('ALL');
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // --- Initial Data Load / Categories ---
  const accounts = useMemo(() => Array.from(new Set(MOCK_TRANSACTIONS.map(t => t.source))), []);
  const allCategories = useMemo(() => DEFAULT_CATEGORIES, []);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      // Search
      if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase()) && !t.notes?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Date
      if (dateRange.from && new Date(t.date) < new Date(dateRange.from)) return false;
      if (dateRange.to && new Date(t.date) > new Date(dateRange.to)) return false;

      // Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false;

      // Account
      if (selectedAccounts.length > 0 && !selectedAccounts.includes(t.source)) return false;

      // Amount
      const absAmount = Math.abs(t.amount);
      if (amountRange.min && absAmount < parseFloat(amountRange.min)) return false;
      if (amountRange.max && absAmount > parseFloat(amountRange.max)) return false;

      // Type
      if (typeFilter !== 'ALL') {
        const isExpense = t.amount < 0;
        if (typeFilter === 'Expense' && !isExpense) return false;
        if (typeFilter === 'Income' && isExpense) return false;
      }

      return true;
    }).sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === undefined || bVal === undefined) return 0;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, searchTerm, dateRange, selectedCategories, selectedAccounts, amountRange, typeFilter, sortConfig]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Summary Stats Calculation ---
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catBreakdown: Record<string, number> = {};

    filteredData.forEach(t => {
      if (t.amount > 0) {
        income += t.amount;
      } else {
        expense += Math.abs(t.amount);
        catBreakdown[t.category] = (catBreakdown[t.category] || 0) + Math.abs(t.amount);
      }
    });

    const chartData = Object.entries(catBreakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories

    return { total: income - expense, income, expense, count: filteredData.length, chartData };
  }, [filteredData]);

  // --- Handlers ---
  const handleSort = (key: keyof Transaction) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEditSave = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    setIsDetailModalOpen(false);
  };

  const handleAddSave = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    setIsAddModalOpen(false);
  };

  const deleteTransaction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      setIsDetailModalOpen(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount", "Account", "Type", "Notes"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + filteredData.map(e => `${e.date},"${e.description}","${e.category}",${e.amount},"${e.source}",${e.amount > 0 ? 'Income' : 'Expense'},"${e.notes || ''}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={`min-h-screen bg-[#0f172a] text-[#f1f5f9] font-sans flex flex-col`}>
      
      {/* --- HEADER SECTION --- */}
      <div className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur border-b border-[#1e293b] p-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0d9488]/20 rounded-lg text-[#0d9488]">
              <Receipt size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Transactions</h1>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-[#0d9488]/20"
          >
            <Plus size={16} /> Add Transaction
          </button>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider">Filtered Count</span>
            <div className="text-xl font-mono font-bold mt-1 text-white">{stats.count}</div>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider">Income</span>
            <div className="text-xl font-mono font-bold mt-1 text-[#10b981] flex items-center gap-1">
              <ArrowDownLeft size={16} /> {formatCurrency(stats.income)}
            </div>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider">Expenses</span>
            <div className="text-xl font-mono font-bold mt-1 text-[#ef4444] flex items-center gap-1">
              <ArrowUpRight size={16} /> {formatCurrency(stats.expense)}
            </div>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider">Net Flow</span>
            <div className={`text-xl font-mono font-bold mt-1 ${stats.total >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
              {formatCurrency(stats.total)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* --- MAIN CONTENT (Filter + Table) --- */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Filter Bar */}
          <div className="p-4 border-b border-[#1e293b] bg-[#0f172a] space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
                />
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2">
                <Calendar size={14} className="text-slate-400" />
                <input 
                  type="date" 
                  value={dateRange.from}
                  onChange={(e) => setDateRange(p => ({...p, from: e.target.value}))}
                  className="bg-transparent text-xs text-white outline-none w-24"
                />
                <span className="text-slate-500 text-xs">→</span>
                <input 
                  type="date" 
                  value={dateRange.to}
                  onChange={(e) => setDateRange(p => ({...p, to: e.target.value}))}
                  className="bg-transparent text-xs text-white outline-none w-24"
                />
              </div>

              {/* Type Toggle */}
              <div className="flex bg-[#1e293b] rounded-lg p-1 border border-slate-700">
                {['ALL', 'Income', 'Expense'].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${typeFilter === type ? 'bg-[#0d9488] text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Clear Filters */}
              <button 
                onClick={() => { setSearchTerm(''); setDateRange({from:'',to:''}); setSelectedCategories([]); setSelectedAccounts([]); setAmountRange({min:'',max:''}); setTypeFilter('ALL'); }}
                className="text-xs text-slate-400 hover:text-[#0d9488] font-bold underline px-2"
              >
                Clear Filters
              </button>
            </div>

            {/* Expanded Filters Row */}
            <div className="flex flex-wrap gap-2">
               {/* Categories Dropdown Filter */}
               <div className="relative group">
                  <button className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-slate-500 transition-colors">
                    <Filter size={12} /> Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`} <ChevronDown size={12} />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 max-h-64 overflow-y-auto bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl z-50 hidden group-hover:block p-2">
                    {allCategories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 p-2 hover:bg-slate-700/50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                            else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          }}
                          className="rounded border-slate-600 bg-slate-800 text-[#0d9488] focus:ring-0"
                        />
                        <span className="text-xs text-slate-200">{cat}</span>
                      </label>
                    ))}
                  </div>
               </div>

               {/* Accounts Filter */}
               <div className="relative group">
                  <button className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-slate-500 transition-colors">
                    <Banknote size={12} /> Accounts {selectedAccounts.length > 0 && `(${selectedAccounts.length})`} <ChevronDown size={12} />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl z-50 hidden group-hover:block p-2">
                    {accounts.map(acc => (
                      <label key={acc} className="flex items-center gap-2 p-2 hover:bg-slate-700/50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedAccounts.includes(acc)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedAccounts([...selectedAccounts, acc]);
                            else setSelectedAccounts(selectedAccounts.filter(a => a !== acc));
                          }}
                          className="rounded border-slate-600 bg-slate-800 text-[#0d9488] focus:ring-0"
                        />
                        <span className="text-xs text-slate-200">{acc}</span>
                      </label>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1e293b] sticky top-0 z-20 shadow-sm">
                <tr>
                  {[
                    { label: 'Date', key: 'date', width: '15%' },
                    { label: 'Description', key: 'description', width: '30%' },
                    { label: 'Category', key: 'category', width: '20%' },
                    { label: 'Account', key: 'source', width: '15%' },
                    { label: 'Amount', key: 'amount', width: '15%', align: 'right' },
                    { label: '', key: 'id', width: '5%' }
                  ].map((col: any) => (
                    <th 
                      key={col.key} 
                      className={`p-4 text-xs font-bold text-[#94a3b8] uppercase tracking-wider cursor-pointer hover:bg-slate-700/50 transition-colors ${col.align === 'right' ? 'text-right' : ''}`}
                      onClick={() => col.key !== 'id' && handleSort(col.key)}
                      style={{ width: col.width }}
                    >
                      {col.label} {sortConfig.key === col.key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {paginatedData.map((tx) => {
                  const CategoryIcon = getCategoryIcon(tx.category);
                  const isIncome = tx.amount > 0;
                  
                  return (
                    <tr 
                      key={tx.id} 
                      className="group hover:bg-[#1e293b]/50 transition-colors cursor-pointer"
                      onClick={() => { setSelectedTransaction(tx); setIsDetailModalOpen(true); }}
                    >
                      <td className="p-4 text-sm font-mono text-slate-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="p-4">
                        <div className="font-medium text-white truncate max-w-[250px]" title={tx.description}>
                          {tx.clean_merchant || tx.description}
                        </div>
                        {tx.notes && <div className="text-xs text-slate-500 mt-0.5 truncate italic">Note: {tx.notes}</div>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#0f172a] border border-slate-700">
                            <CategoryIcon.icon size={12} color={CategoryIcon.color} />
                          </div>
                          <span className="text-sm text-slate-300">{tx.category}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          tx.source.includes('Discovery') ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' :
                          tx.source.includes('Absa') ? 'bg-red-900/20 border-red-500/30 text-red-300' :
                          'bg-blue-900/20 border-blue-500/30 text-blue-300'
                        }`}>
                          {tx.source}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-mono text-sm ${Math.abs(tx.amount) > 1000 ? 'font-bold' : ''} ${isIncome ? 'text-[#10b981]' : 'text-[#f1f5f9]'}`}>
                        {isIncome ? '+' : ''}{formatCurrency(tx.amount)}
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Empty State */}
            {paginatedData.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Search size={48} className="mb-4 opacity-20" />
                <p>No transactions found matching your filters.</p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-[#1e293b] bg-[#0f172a] flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} transactions
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded bg-[#1e293b] border border-slate-700 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-4 py-2 bg-[#1e293b] border border-slate-700 rounded text-xs font-bold text-white">
                {currentPage}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded bg-[#1e293b] border border-slate-700 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* --- SIDEBAR SUMMARY --- */}
        {sidebarOpen && (
          <div className="w-80 bg-[#1e293b] border-l border-[#0f172a] p-6 hidden md:flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white text-lg">Analysis</h3>
              <button onClick={downloadCSV} className="text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 text-xs font-bold">
                <Download size={14} /> Export
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#0f172a] p-4 rounded-xl">
                <h4 className="text-xs text-[#94a3b8] uppercase font-bold mb-4">Filtered Breakdown</h4>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px'}} />
                      <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]}>
                        {stats.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryIcon(entry.name).color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                {stats.chartData.map((cat, idx) => {
                  const Icon = getCategoryIcon(cat.name);
                  return (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: Icon.color }}></div>
                        <span className="text-sm text-slate-300">{cat.name}</span>
                      </div>
                      <span className="text-sm font-mono text-slate-400">{formatCurrency(cat.value)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- DETAIL MODAL --- */}
      {isDetailModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-700 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Transaction Details</h2>
                <p className="text-sm text-slate-400 font-mono">{selectedTransaction.id}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className={`text-3xl font-mono font-bold mb-2 ${selectedTransaction.amount > 0 ? 'text-[#10b981]' : 'text-white'}`}>
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <div className="px-3 py-1 rounded-full bg-[#0f172a] text-xs text-slate-400 font-mono">
                  {new Date(selectedTransaction.date).toLocaleString()}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <div className="text-white p-3 bg-[#0f172a] rounded-lg border border-slate-700">
                    {selectedTransaction.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account</label>
                    <div className="text-white p-3 bg-[#0f172a] rounded-lg border border-slate-700 text-sm">
                      {selectedTransaction.source}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                    <select 
                      value={selectedTransaction.category}
                      onChange={(e) => setSelectedTransaction({...selectedTransaction, category: e.target.value})}
                      className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 text-sm outline-none focus:border-[#0d9488]"
                    >
                      {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes</label>
                  <textarea 
                    value={selectedTransaction.notes || ''}
                    onChange={(e) => setSelectedTransaction({...selectedTransaction, notes: e.target.value})}
                    placeholder="Add notes..."
                    className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 text-sm outline-none focus:border-[#0d9488] h-24 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="recurring"
                    checked={selectedTransaction.is_recurring || false}
                    onChange={(e) => setSelectedTransaction({...selectedTransaction, is_recurring: e.target.checked})}
                    className="rounded bg-slate-800 border-slate-600 text-[#0d9488]"
                  />
                  <label htmlFor="recurring" className="text-sm text-slate-300">Mark as Recurring Subscription</label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 bg-[#0f172a] flex justify-between">
              <button 
                onClick={() => deleteTransaction(selectedTransaction.id)}
                className="text-[#ef4444] hover:bg-[#ef4444]/10 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                Delete
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-slate-400 hover:text-white px-4 py-2 font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleEditSave(selectedTransaction)}
                  className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-[#0d9488]/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add Transaction</h2>
              <button onClick={() => setIsAddModalOpen(false)}><X size={24} className="text-slate-500 hover:text-white"/></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const amt = parseFloat(formData.get('amount') as string);
              const type = formData.get('type') as string;
              
              const newTx: Transaction = {
                id: Date.now().toString(),
                date: formData.get('date') as string,
                description: formData.get('description') as string,
                amount: type === 'Expense' ? -Math.abs(amt) : Math.abs(amt),
                category: formData.get('category') as string,
                source: formData.get('account') as string,
                type: type as 'Income' | 'Expense',
                notes: formData.get('notes') as string,
                clean_merchant: formData.get('description') as string,
              };
              handleAddSave(newTx);
            }}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                    <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                    <select name="type" className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]">
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <input name="description" required placeholder="e.g. Uber Eats" className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (R)</label>
                    <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                    <select name="category" className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]">
                      {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account</label>
                  <select name="account" className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488]">
                    {accounts.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes</label>
                  <textarea name="notes" placeholder="Optional notes..." className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-[#0d9488] h-20 resize-none" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-700 bg-[#0f172a] flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white px-4 py-2 font-bold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-[#0d9488]/20 transition-all">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};