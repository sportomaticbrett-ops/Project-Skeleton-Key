import React from 'react';
import { PARTNER_STRATEGIES } from '../constants';

export const StrategyMatrix: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8 pb-20">
       
       {/* Header Section */}
       <div className="bg-gradient-to-r from-[#D4A373]/20 to-transparent p-8 rounded-2xl border-l-4 border-[#D4A373] relative overflow-hidden">
           <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">The Triad Protocol: Partner Matrix</h2>
                <p className="text-slate-300 max-w-3xl">
                    Operational Directive: Deploy specific financial instruments for maximum yield arbitrage. 
                    This protocol acknowledges the "Bad Driver" constraint and leverages Amex for general spend volume.
                </p>
           </div>
           <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0f1214] to-transparent"></div>
       </div>

       {/* Execution Protocols - High Priority Actions */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
               </div>
               <h3 className="text-[#D4A373] font-bold uppercase tracking-wider text-sm mb-3">Protocol A: Split Trolley</h3>
               <div className="space-y-3 text-sm">
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">IF</span>
                       <span className="text-white">Veg, Fruit, Lean Meat</span>
                       <span className="text-slate-500">→</span>
                       <span className="text-purple-400 font-bold">Discovery Bank</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">IF</span>
                       <span className="text-white">Wine, Household, Chips</span>
                       <span className="text-slate-500">→</span>
                       <span className="text-blue-400 font-bold">Amex Platinum</span>
                   </div>
               </div>
               <p className="text-xs text-slate-500 mt-4 italic border-t border-slate-800 pt-2">Maximizes HealthyFood 75% while capturing 2% on general goods.</p>
           </div>

           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
               </div>
               <h3 className="text-green-500 font-bold uppercase tracking-wider text-sm mb-3">Protocol B: Dis-Chem Pivot</h3>
               <div className="space-y-3 text-sm">
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">BUY</span>
                       <span className="text-white">Toothpaste, Vitamins, Baby</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">AT</span>
                       <span className="text-white">Dis-Chem ONLY</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">USE</span>
                       <span className="text-blue-400 font-bold">Capitec Global One</span>
                   </div>
               </div>
               <p className="text-xs text-slate-500 mt-4 italic border-t border-slate-800 pt-2">15% Instant Discount beats any points system.</p>
           </div>

           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a5 5 0 0 1 5-5z"/><path d="M8 11h8"/><path d="M8 15h8"/></svg>
               </div>
               <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-3">Protocol C: Fuel Safety Net</h3>
               <div className="space-y-3 text-sm">
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">LOC</span>
                       <span className="text-white">BP (Midrand/Waterfall)</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">STEP 1</span>
                       <span className="text-white">Swipe Greenbacks (Earn 25c/L)</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <span className="text-slate-500 font-mono">STEP 2</span>
                       <span className="text-white">Pay with Amex (Earn 2%)</span>
                   </div>
               </div>
               <p className="text-xs text-slate-500 mt-4 italic border-t border-slate-800 pt-2">Guaranteed ~3.5% yield without driving behavior constraints.</p>
           </div>
       </div>

       {/* Detailed Matrix Table */}
       <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
           <div className="grid grid-cols-12 bg-slate-950 p-4 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-500">
               <div className="col-span-3">Category</div>
               <div className="col-span-3">Primary Instrument</div>
               <div className="col-span-2">Secondary</div>
               <div className="col-span-4">Strategic Rationale</div>
           </div>
           
           <div className="divide-y divide-slate-800">
               {PARTNER_STRATEGIES.map((strat, idx) => (
                   <div key={idx} className="grid grid-cols-12 p-4 items-start hover:bg-slate-800/30 transition-colors">
                       <div className="col-span-3">
                           <p className="font-bold text-white text-sm">{strat.category}</p>
                           <p className="text-xs text-slate-500">{strat.partner}</p>
                       </div>
                       
                       <div className="col-span-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                                strat.card.includes('Amex') ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' :
                                strat.card.includes('Discovery') ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' :
                                'bg-slate-800 text-white border border-slate-600'
                            }`}>
                                {strat.card}
                            </span>
                       </div>

                       <div className="col-span-2 text-xs text-slate-400">
                           {strat.secondary_action || '-'}
                       </div>

                       <div className="col-span-4">
                           <p className="text-sm text-[#D4A373] font-medium">{strat.benefit}</p>
                           <p className="text-xs text-slate-500 mt-1 leading-relaxed">{strat.rationale}</p>
                       </div>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
};