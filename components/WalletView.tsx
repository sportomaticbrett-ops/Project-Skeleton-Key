import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, formatCurrency } from '../constants';
import { Transaction } from '../types';

export const WalletView: React.FC = () => {
  const [activeCard, setActiveCard] = useState<'ALL' | 'Discovery' | 'Absa'>('ALL');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const transactions = useMemo(() => {
    let filtered = activeCard === 'ALL' 
      ? MOCK_TRANSACTIONS 
      : MOCK_TRANSACTIONS.filter(t => t.source === activeCard);
    
    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [activeCard, sortField, sortDir]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white tracking-wide">MASTER LEDGER</h2>
        <div className="flex gap-2">
           <button 
                onClick={() => setActiveCard('ALL')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeCard === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
                ALL
            </button>
            <button 
                onClick={() => setActiveCard('Discovery')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeCard === 'Discovery' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
                DISCOVERY
            </button>
            <button 
                onClick={() => setActiveCard('Absa')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeCard === 'Absa' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
                ABSA
            </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-950 p-4 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 sticky top-0 z-10">
            <div className="col-span-2 cursor-pointer hover:text-white" onClick={() => handleSort('date')}>Date {sortField === 'date' && (sortDir === 'asc' ? '↑' : '↓')}</div>
            <div className="col-span-3 cursor-pointer hover:text-white" onClick={() => handleSort('clean_merchant')}>Merchant {sortField === 'clean_merchant' && (sortDir === 'asc' ? '↑' : '↓')}</div>
            <div className="col-span-2 cursor-pointer hover:text-white" onClick={() => handleSort('category')}>Category</div>
            <div className="col-span-1">Account</div>
            <div className="col-span-2 text-right">Budget Cap</div>
            <div className="col-span-2 text-right cursor-pointer hover:text-white" onClick={() => handleSort('amount')}>Amount {sortField === 'amount' && (sortDir === 'asc' ? '↑' : '↓')}</div>
        </div>
        
        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
            {transactions.map((tx) => {
                // Calculate Mock Variance: Is this transaction > 10% of the budget?
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
                        
                        <div className="col-span-2">
                             <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                ${tx.category === 'Groceries' ? 'bg-green-900/20 text-green-400 border border-green-900/50' :
                                  tx.category === 'Convenience' ? 'bg-red-900/20 text-red-400 border border-red-900/50' :
                                  tx.category === 'Debt Service' ? 'bg-orange-900/20 text-orange-400 border border-orange-900/50' :
                                  'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                {tx.category}
                            </span>
                        </div>

                        <div className="col-span-1">
                             <div className={`w-2 h-2 rounded-full ${tx.source === 'Discovery' ? 'bg-purple-500' : 'bg-red-500'}`} title={tx.source}></div>
                        </div>

                        <div className="col-span-2 text-right font-mono text-slate-500 text-xs">
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
             {/* Infinite Scroll Mock */}
             <div className="p-8 text-center text-slate-600 text-xs italic">
                End of cached records. Scroll to load history.
             </div>
        </div>
      </div>
    </div>
  );
};