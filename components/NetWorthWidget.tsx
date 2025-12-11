import React from 'react';
import { ASSETS, LIABILITIES, formatCurrency } from '../constants';

export const NetWorthWidget: React.FC = () => {
  const totalAssets = ASSETS.reduce((acc, a) => acc + a.value, 0);
  const totalLiabilities = LIABILITIES.reduce((acc, l) => acc + l.value, 0);
  const solvencyRatio = totalAssets / (totalLiabilities || 1);
  const isSolvent = solvencyRatio >= 1;

  return (
    <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 animate-fade-in relative overflow-hidden h-full flex flex-col">
       <div className="flex justify-between items-center mb-6 z-10 relative">
          <h3 className="text-[#D4A373] text-xs font-bold uppercase tracking-wider">Asset Allocation</h3>
          <div className={`flex items-center gap-2 px-2 py-1 rounded border ${isSolvent ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
              <span className={`text-xs font-bold ${isSolvent ? 'text-green-500' : 'text-red-500'}`}>
                  Ratio: {solvencyRatio.toFixed(2)}
              </span>
          </div>
       </div>

       <div className="flex-1 grid grid-cols-2 gap-0 border border-slate-700 rounded-lg overflow-hidden relative z-10">
           {/* Left: Assets */}
           <div className="border-r border-slate-700 bg-slate-900/50 p-3">
               <h4 className="text-xs text-slate-500 font-bold uppercase mb-3 border-b border-slate-800 pb-1">Assets</h4>
               <div className="space-y-3">
                   {ASSETS.map(asset => (
                       <div key={asset.id}>
                           <p className="text-[10px] text-slate-400 truncate" title={asset.name}>{asset.name}</p>
                           <p className="text-sm font-mono text-green-400">{formatCurrency(asset.value)}</p>
                       </div>
                   ))}
               </div>
           </div>

           {/* Right: Liabilities */}
           <div className="bg-slate-900/50 p-3">
                <h4 className="text-xs text-slate-500 font-bold uppercase mb-3 border-b border-slate-800 pb-1">Liabilities</h4>
                <div className="space-y-3">
                    {LIABILITIES.filter(l => l.value > 0).map(liability => (
                        <div key={liability.id}>
                            <p className="text-[10px] text-slate-400 truncate" title={liability.name}>{liability.name}</p>
                            <p className="text-sm font-mono text-red-400">{formatCurrency(liability.value)}</p>
                        </div>
                    ))}
                </div>
           </div>
       </div>
       
       <div className="mt-4 flex justify-between items-end border-t border-slate-800 pt-3 z-10 relative">
           <div className="text-right w-full">
               <p className="text-[10px] text-slate-500 uppercase">Net Position</p>
               <p className={`text-xl font-black font-mono ${totalAssets >= totalLiabilities ? 'text-white' : 'text-red-500'}`}>
                   {formatCurrency(totalAssets - totalLiabilities)}
               </p>
           </div>
       </div>

       {/* Background Decoration */}
       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-800/30 rounded-full blur-3xl z-0"></div>
    </div>
  );
};