import React, { useState } from 'react';
import { LIABILITIES, formatCurrency } from '../constants';

export const DebtWarRoom: React.FC = () => {
  const [extraCash, setExtraCash] = useState<string>('');
  
  // Sort liabilities by Interest Rate (Avalanche Method)
  const sortedLiabilities = [...LIABILITIES].sort((a, b) => b.interestRate - a.interestRate);
  
  const cashValue = parseFloat(extraCash) || 0;
  
  // Simulate Impact
  const topEnemy = sortedLiabilities[0];
  const monthsToKill = Math.ceil(topEnemy.value / (topEnemy.minPayment + cashValue));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in h-[calc(100vh-140px)]">
        
        {/* Left: The Avalanche */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider border-b border-slate-800 pb-4">
                Enemy Forces (Avalanche)
            </h2>
            
            <div className="flex-1 flex flex-col justify-end space-y-2">
                {sortedLiabilities.map((debt, index) => {
                    const isTop = index === 0;
                    // Calculate relative height for visual
                    const heightPercent = Math.max(15, (debt.value / 100000) * 100); 
                    
                    return (
                        <div key={debt.id} className="w-full relative group">
                            <div 
                                className={`w-full rounded-lg flex items-center justify-between px-6 transition-all duration-500 ${isTop ? 'bg-[#b91c1c] shadow-[0_0_20px_rgba(185,28,28,0.3)] animate-pulse' : 'bg-orange-700/60'}`}
                                style={{ height: `${heightPercent}px`, minHeight: '60px' }}
                            >
                                <span className="font-bold text-white text-lg">{debt.name}</span>
                                <div className="text-right">
                                    <span className="block font-mono font-bold text-white">{formatCurrency(debt.value)}</span>
                                    <span className="text-xs text-white/70">{debt.interestRate}% Interest</span>
                                </div>
                            </div>
                            {isTop && cashValue > 0 && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                                    ATTACKING WITH +{formatCurrency(cashValue)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">Highest Interest Rate = Priority Target</p>
        </div>

        {/* Right: Tactical Control */}
        <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                 <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Tactical Console</h2>
                 
                 <div className="mb-6">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Extra Cash Deployment</label>
                     <div className="flex gap-2">
                        <input 
                            type="number" 
                            value={extraCash}
                            onChange={(e) => setExtraCash(e.target.value)}
                            placeholder="2000"
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono focus:border-[#D4A373] outline-none"
                        />
                        <button className="bg-[#b91c1c] text-white font-bold px-6 rounded-lg uppercase tracking-wider hover:bg-red-700 transition-colors">
                            Fire
                        </button>
                     </div>
                 </div>

                 <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                     <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">Battle Projection</h3>
                     <p className="text-lg text-slate-200">
                         At this rate, <span className="text-white font-bold">{topEnemy.name}</span> will be eliminated in <span className="text-[#D4A373] font-bold text-2xl">{monthsToKill} Months</span>.
                     </p>
                     <p className="text-sm text-slate-500 mt-2">
                         Victory frees up <span className="text-green-500 font-bold">{formatCurrency(topEnemy.minPayment)}/pm</span> to attack the next target.
                     </p>
                 </div>
            </div>

            {/* Kill List */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Current Month Orders</h2>
                <div className="space-y-3">
                    {sortedLiabilities.map((debt, index) => {
                        const isTop = index === 0;
                        const payment = isTop ? debt.minPayment + cashValue : debt.minPayment;
                        return (
                            <div key={debt.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
                                <div className={`w-6 h-6 rounded border flex items-center justify-center ${isTop ? 'border-[#b91c1c]' : 'border-slate-600'}`}></div>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${isTop ? 'text-white' : 'text-slate-400'}`}>Pay {debt.name}</p>
                                </div>
                                <span className={`font-mono font-bold ${isTop ? 'text-[#b91c1c]' : 'text-slate-500'}`}>
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