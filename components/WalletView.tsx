import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, DEFAULT_CATEGORIES, formatCurrency } from '../constants';
import { Transaction, TimeRange } from '../types';

interface WalletViewProps {
    timeRange?: TimeRange;
}

export const WalletView: React.FC<WalletViewProps> = ({ timeRange = 'MONTH' }) => {
  const [activeCard, setActiveCard] = useState<'ALL' | 'Discovery' | 'Absa' | 'Capitec' | 'Amex'>('ALL');
  const [viewMode, setViewMode] = useState<'LEDGER' | 'RECURRING'>('LEDGER');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filters & Editing
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatName, setEditingCatName] = useState<{old: string, new: string} | null>(null);

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const updateCategory = (id: string, newCategory: string) => {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, category: newCategory } : t));
      setEditingId(null);
  };

  const addCategory = () => {
      if (newCatName && !categories.includes(newCatName)) {
          setCategories(prev => [...prev, newCatName]);
          setNewCatName('');
      }
  };

  const updateCategoryName = () => {
      if (editingCatName && editingCatName.new) {
          setCategories(prev => prev.map(c => c === editingCatName.old ? editingCatName.new : c));
          // Update transactions with old category name
          setTransactions(prev => prev.map(t => t.category === editingCatName.old ? { ...t, category: editingCatName.new } : t));
          setEditingCatName(null);
      }
  };

  const filteredTransactions = useMemo(() => {
    let filtered = activeCard === 'ALL' 
      ? transactions 
      : transactions.filter(t => t.source === activeCard);
    
    // Filter by TimeRange
    const now = new Date();
    filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        const diffDays = (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24);
        
        if (timeRange === 'TODAY') return diffDays <= 1;
        if (timeRange === 'WEEK') return diffDays <= 7;
        if (timeRange === 'MONTH') return diffDays <= 30;
        if (timeRange === '3MONTHS') return diffDays <= 90;
        return true;
    });

    if (viewMode === 'RECURRING') {
        filtered = filtered.filter(t => t.is_recurring);
    }

    if (categoryFilter !== 'ALL') {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [activeCard, viewMode, sortField, sortDir, timeRange, categoryFilter, transactions]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in space-y-4">
      
      {/* Filters Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2">
            <button 
                onClick={() => setViewMode('LEDGER')}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'LEDGER' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                MASTER LEDGER
            </button>
            <button 
                onClick={() => setViewMode('RECURRING')}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'RECURRING' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                RECURRING
            </button>
            <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
            <select 
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            >
                <option value="ALL">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button 
                onClick={() => setShowCatManager(true)}
                className="text-xs text-blue-400 font-bold hover:underline px-2"
            >
                Manage Categories
            </button>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full xl:w-auto pb-1">
           {['ALL', 'Discovery', 'Absa', 'Capitec', 'Amex'].map((card) => (
                <button 
                    key={card}
                    onClick={() => { setActiveCard(card as any); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                        activeCard === card 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                >
                    {card.toUpperCase()}
                </button>
           ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl relative">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-950 p-4 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 sticky top-0 z-10">
            <div className="col-span-2 cursor-pointer hover:text-white" onClick={() => handleSort('date')}>Date {sortField === 'date' && (sortDir === 'asc' ? '↑' : '↓')}</div>
            <div className="col-span-3 cursor-pointer hover:text-white" onClick={() => handleSort('clean_merchant')}>Merchant {sortField === 'clean_merchant' && (sortDir === 'asc' ? '↑' : '↓')}</div>
            <div className="col-span-3">Category (Click to Edit)</div>
            <div className="col-span-1">Account</div>
            <div className="col-span-1 text-right">Limit</div>
            <div className="col-span-2 text-right cursor-pointer hover:text-white" onClick={() => handleSort('amount')}>Amount {sortField === 'amount' && (sortDir === 'asc' ? '↑' : '↓')}</div>
        </div>
        
        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
            {paginatedTransactions.length === 0 && (
                <div className="p-8 text-center text-slate-600 italic">No transactions found for current filter.</div>
            )}
            {paginatedTransactions.map((tx) => {
                const budget = tx.budget_cap || 1000;
                const impact = (tx.amount / budget) * 100;
                const isHighImpact = impact > 10; 

                return (
                    <div key={tx.id} className="grid grid-cols-12 items-center p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors group text-sm">
                        <div className="col-span-2 font-mono text-slate-400">{tx.date}</div>
                        
                        <div className="col-span-3">
                            <div className="font-bold text-slate-200">{tx.clean_merchant || tx.description}</div>
                            {tx.clean_merchant && <div className="text-[10px] text-slate-600 truncate">{tx.description}</div>}
                        </div>
                        
                        <div className="col-span-3 relative">
                             {editingId === tx.id ? (
                                 <select 
                                     autoFocus
                                     className="bg-slate-800 text-white text-xs border border-blue-500 rounded p-1 w-full outline-none"
                                     value={tx.category}
                                     onChange={(e) => updateCategory(tx.id, e.target.value)}
                                     onBlur={() => setEditingId(null)}
                                 >
                                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                 </select>
                             ) : (
                                <span 
                                    onClick={() => setEditingId(tx.id)}
                                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:ring-1 hover:ring-white/50
                                    ${tx.category === 'Groceries' ? 'bg-green-900/20 text-green-400 border border-green-900/50' :
                                      tx.category === 'Convenience' ? 'bg-red-900/20 text-red-400 border border-red-900/50' :
                                      tx.category === 'Debt Service' ? 'bg-orange-900/20 text-orange-400 border border-orange-900/50' :
                                      'bg-slate-950 text-slate-400 border border-slate-700'}`}
                                >
                                    {tx.category}
                                </span>
                             )}
                        </div>

                        <div className="col-span-1">
                             <div className={`w-2 h-2 rounded-full ${
                                 tx.source === 'Discovery' ? 'bg-purple-500' : 
                                 tx.source === 'Absa' ? 'bg-red-600' :
                                 tx.source === 'Capitec' ? 'bg-blue-400' : 'bg-slate-200'
                            }`} title={tx.source}></div>
                        </div>

                        <div className="col-span-1 text-right font-mono text-slate-500 text-xs">
                            {formatCurrency(budget)}
                        </div>

                        <div className="col-span-2 text-right relative pl-4">
                            <div className="font-mono font-bold text-white">{formatCurrency(tx.amount)}</div>
                            {/* Variance Visual */}
                            <div className="w-full h-0.5 bg-slate-800 mt-1 flex justify-end">
                                <div 
                                    className={`h-full ${isHighImpact ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${Math.min(100, impact)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* Pagination Controls */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-500">Showing {paginatedTransactions.length} of {filteredTransactions.length}</span>
            <div className="flex gap-2">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-white disabled:opacity-50 hover:bg-slate-800"
                >
                    Prev
                </button>
                <span className="text-xs text-slate-400 flex items-center">Page {currentPage} of {totalPages || 1}</span>
                <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-white disabled:opacity-50 hover:bg-slate-800"
                >
                    Next
                </button>
            </div>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCatManager && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-white">Manage Categories</h3>
                      <button onClick={() => setShowCatManager(false)} className="text-slate-500 hover:text-white">✕</button>
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                      <div className="flex gap-2 mb-4">
                          <input 
                              className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                              placeholder="New Category Name"
                              value={newCatName}
                              onChange={(e) => setNewCatName(e.target.value)}
                          />
                          <button onClick={addCategory} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">Add</button>
                      </div>
                      <div className="space-y-1">
                          {categories.map(cat => (
                              <div key={cat} className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-800">
                                  {editingCatName?.old === cat ? (
                                      <div className="flex gap-2 flex-1">
                                          <input 
                                              className="flex-1 bg-slate-950 border border-blue-500 rounded px-2 py-1 text-xs text-white"
                                              value={editingCatName.new}
                                              onChange={(e) => setEditingCatName({...editingCatName, new: e.target.value})}
                                          />
                                          <button onClick={updateCategoryName} className="text-green-500 text-xs font-bold">Save</button>
                                      </div>
                                  ) : (
                                      <>
                                          <span className="text-sm text-slate-300">{cat}</span>
                                          <button 
                                            onClick={() => setEditingCatName({old: cat, new: cat})}
                                            className="text-xs text-blue-400 hover:text-blue-300"
                                          >
                                              Edit
                                          </button>
                                      </>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};