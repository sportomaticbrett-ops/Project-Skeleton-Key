import React from 'react';
import { ASSETS, LIABILITIES, formatCurrency, THEME } from '../constants';

export const NetWorthWidget: React.FC = () => {
  const totalAssets = ASSETS.reduce((acc, a) => acc + a.value, 0);
  const totalLiabilities = LIABILITIES.reduce((acc, l) => acc + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;
  const solvencyRatio = totalAssets / (totalLiabilities || 1);

  return (
    <div className="h-full flex flex-col">
       {/* Header */}
       <div className="p-6 border-b border-[#2C2E2B] flex justify-between items-start">
           <div>
               <h3 className="font-serif font-bold text-[#E3D5CA] text-lg">Net Worth Ledger</h3>
               <p className="text-xs text-[#E3D5CA]/60 font-mono mt-1">Solvency Ratio: <span className={solvencyRatio >= 1 ? 'text-[#A3B18A]' : 'text-[#BC4749]'}>{solvencyRatio.toFixed(2)}</span></p>
           </div>
           <div className="text-right">
               <p className="text-[10px] uppercase text-[#D4A373] tracking-widest mb-1">Total Equity</p>
               <p className="text-2xl font-mono font-bold text-[#E3D5CA]">{formatCurrency(netWorth)}</p>
           </div>
       </div>

       {/* T-Account Body */}
       <div className="flex-1 grid grid-cols-2 divide-x divide-[#2C2E2B]">
           
           {/* Left Column: Assets */}
           <div className="p-6 bg-[#1A1C19]">
               <h4 className="text-xs text-[#A3B18A] font-bold uppercase tracking-wider mb-4 border-b border-[#2C2E2B] pb-2">Assets (Debit)</h4>
               <div className="space-y-4">
                   {ASSETS.map(asset => (
                       <div key={asset.id} className="flex justify-between items-center group">
                           <span className="text-sm text-[#E3D5CA]/80 group-hover:text-[#E3D5CA] transition-colors">{asset.name}</span>
                           <span className="font-mono text-sm text-[#E3D5CA]">{formatCurrency(asset.value)}</span>
                       </div>
                   ))}
               </div>
               <div className="mt-6 pt-4 border-t border-[#2C2E2B] flex justify-between items-center">
                   <span className="text-xs font-bold text-[#E3D5CA]/50">TOTAL</span>
                   <span className="font-mono text-[#A3B18A] font-bold">{formatCurrency(totalAssets)}</span>
               </div>
           </div>

           {/* Right Column: Liabilities */}
           <div className="p-6 bg-[#212320]"> 
               <h4 className="text-xs text-[#BC4749] font-bold uppercase tracking-wider mb-4 border-b border-[#2C2E2B] pb-2">Liabilities (Credit)</h4>
               <div className="space-y-4">
                   {LIABILITIES.filter(l => l.value > 0).map(liability => (
                       <div key={liability.id} className="flex justify-between items-center group">
                           <span className="text-sm text-[#E3D5CA]/80 group-hover:text-[#E3D5CA] transition-colors">{liability.name}</span>
                           <span className="font-mono text-sm text-[#BC4749]">{formatCurrency(liability.value)}</span>
                       </div>
                   ))}
               </div>
               <div className="mt-6 pt-4 border-t border-[#2C2E2B] flex justify-between items-center">
                   <span className="text-xs font-bold text-[#E3D5CA]/50">TOTAL</span>
                   <span className="font-mono text-[#BC4749] font-bold">{formatCurrency(totalLiabilities)}</span>
               </div>
           </div>
       </div>
    </div>
  );
};