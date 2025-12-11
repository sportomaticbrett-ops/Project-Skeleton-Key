import React, { useState } from 'react';
import { LIABILITIES, INSIGHTS, formatCurrency } from '../constants';

export const DebtManager: React.FC = () => {
  const [extraCash, setExtraCash] = useState<string>('');
  
  const income = INSIGHTS.netIncome; // Use NET income for calculations
  const grossIncome = INSIGHTS.grossIncome;
  const fixedCosts = 32000; // Est. Fixed Costs (Rent/Insurance/Utilities)
  const nutrition = 6000; // Est. Nutrition

  const availableForDebt = income - fixedCosts - nutrition;

  // Sort liabilities by Interest Rate (Strategic Payoff)
  const sortedLiabilities = [...LIABILITIES].sort((a, b) => b.interestRate - a.interestRate);
  
  const cashValue = parseFloat(extraCash) || 0;
  
  // Projection Logic
  const topPriority = sortedLiabilities[0];
  const monthsToClear = Math.ceil(topPriority.value / (topPriority.minPayment + cashValue + (availableForDebt > 0 ? availableForDebt * 0.5 : 0))); // Assuming 50% of free cashflow goes here

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in h-[calc(100vh-140px)]">
        
        {/* Left: Liability Overview */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider border-b border-slate-800 pb-4">
                Liability Overview
            </h2>
            
            <div className="flex-1 flex flex-col justify-end space-y-2">
                {sortedLiabilities.map((debt, index) => {
                    const isTop = index === 0;
                    // Calculate relative height for visual
                    const heightPercent = Math.max(15, (debt.value / 120000) * 100); 
                    
                    return (
                        <div key={debt.id} className="w-full relative group">
                            <div 
                                className={`w-full rounded-lg flex items-center justify-between px-6 transition-all duration-500 ${isTop ? 'bg-red-900/50 border border-red-500/50' : 'bg-slate-800/80'}`}
                                style={{ height: `${heightPercent}px`, minHeight: '60px' }}
                            >
                                <span className="font-bold text-white text-lg">{debt.name}</span>
                                <div className="text-right">
                                    <span className="block font-mono font-bold text-white">{formatCurrency(debt.value)}</span>
                                    <span className="text-xs text-slate-400">{debt.interestRate}% Interest</span>
                                </div>
                            </div>
                            {isTop && (
                                <div className="absolute -top-3 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-lg z-10">
                                    Priority Target
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Right: Cash Flow & Controls */}
        <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                 <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Cash Flow Projection</h2>
                 
                 <div className="space-y-4 mb-6">
                     <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                         <span className="text-slate-400 text-sm">Gross Income</span>
                         <span className="text-slate-500 font-mono font-bold">{formatCurrency(grossIncome)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800 border-l-4 border-l-green-500">
                         <span className="text-white text-sm font-bold">Net Pay (Credited)</span>
                         <span className="text-green-400 font-mono font-bold">{formatCurrency(income)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                         <span className="text-slate-400 text-sm">Fixed Costs (Est.)</span>
                         <span className="text-red-400 font-mono font-bold">-{formatCurrency(fixedCosts)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                         <span className="text-slate-400 text-sm">Nutrition (Est.)</span>
                         <span className="text-orange-400 font-mono font-bold">-{formatCurrency(nutrition)}</span>
                     </div>
                     <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                         <span className="text-white font-bold uppercase text-sm">Available for Debt Repayment</span>
                         <span className="text-[#D4A373] font-mono font-bold text-xl">{formatCurrency(availableForDebt)}</span>
                     </div>
                 </div>

                 <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                     <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">Strategy Projection</h3>
                     <p className="text-lg text-slate-200">
                         Targeting <span className="text-white font-bold">{topPriority.name}</span>.
                     </p>
                     <p className="text-sm text-slate-400 mt-2">
                         Estimated clearance in <span className="text-[#D4A373] font-bold">{monthsToClear} Months</span> based on current allocation.
                     </p>
                 </div>
            </div>

            {/* Repayment List */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Repayment Allocation</h2>
                <div className="space-y-3">
                    {sortedLiabilities.map((debt, index) => {
                        const isTop = index === 0;
                        const payment = isTop ? debt.minPayment + (availableForDebt * 0.5) : debt.minPayment;
                        return (
                            <div key={debt.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-800/50 bg-slate-950/50">
                                <div className={`w-2 h-2 rounded-full ${isTop ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${isTop ? 'text-white' : 'text-slate-400'}`}>Allocated to {debt.name}</p>
                                </div>
                                <span className={`font-mono font-bold ${isTop ? 'text-green-400' : 'text-slate-500'}`}>
                                    {formatCurrency(payment)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};