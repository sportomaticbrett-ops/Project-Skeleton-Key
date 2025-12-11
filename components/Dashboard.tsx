import React from 'react';
import { NetWorthWidget } from './NetWorthWidget';
import { INSIGHTS, THEME } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info, Battery, Zap, Shield, ShoppingCart, CreditCard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const safeToSpend = INSIGHTS.safeToSpend;
  
  // Safe to Spend Data for Dial
  const dialData = [
    { name: 'Safe', value: safeToSpend, color: THEME.brass },
    { name: 'Used', value: 1000 - safeToSpend, color: '#2C2E2B' }, // Assumed daily baseline of 1000 for visual
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in pb-20">
      
      {/* 1. Net Worth T-Account (Left/Main Panel) */}
      <div className="lg:col-span-8 bg-[#1A1C19] border border-[#2C2E2B] rounded-2xl p-0 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4A373]"></div>
          <NetWorthWidget />
      </div>

      {/* 2. Safe-To-Spend Dial (Right Top) */}
      <div className="lg:col-span-4 bg-[#1A1C19] border border-[#2C2E2B] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
              <h3 className="font-serif font-bold text-[#E3D5CA]">Safe-to-Spend</h3>
              <Info className="w-4 h-4 text-[#D4A373]" />
          </div>
          
          <div className="flex-1 flex items-center justify-center relative z-10">
             <div className="w-full h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dialData}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {dialData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 w-full text-center mb-2">
                    <p className="text-3xl font-mono font-bold text-[#E3D5CA]">R {safeToSpend.toFixed(0)}</p>
                    <p className="text-[10px] uppercase text-[#A3B18A] tracking-wider">Daily Allocation</p>
                </div>
             </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#2C2E2B] z-10">
              <div className="flex justify-between items-center">
                  <span className="text-xs text-[#E3D5CA]/60">Fixed Costs Covered</span>
                  <span className="text-xs font-mono text-[#A3B18A]">YES</span>
              </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A373]/5 rounded-full blur-2xl z-0"></div>
      </div>

      {/* 3. Partner Status Rack (Full Width) */}
      <div className="lg:col-span-12 bg-[#2C2E2B]/30 border border-[#2C2E2B] rounded-xl p-4 flex flex-wrap gap-4 justify-between items-center">
          <span className="text-xs font-bold uppercase text-[#E3D5CA]/50 tracking-widest hidden md:block">System Status</span>
          
          {/* Discovery */}
          <div className="flex items-center gap-3 bg-[#1A1C19] px-4 py-2 rounded-lg border border-[#2C2E2B]">
              <div className="w-2 h-2 rounded-full bg-[#BC4749]"></div> {/* Red status implied by Brief */}
              <Zap className="w-4 h-4 text-[#E3D5CA]" />
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#E3D5CA]">Discovery</span>
                  <span className="text-[9px] text-[#E3D5CA]/60 font-mono">Vitality: Bronze</span>
              </div>
          </div>

          {/* Amex */}
          <div className="flex items-center gap-3 bg-[#1A1C19] px-4 py-2 rounded-lg border border-[#2C2E2B]">
              <div className="w-2 h-2 rounded-full bg-[#A3B18A]"></div>
              <Shield className="w-4 h-4 text-[#E3D5CA]" />
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#E3D5CA]">Amex Plat</span>
                  <span className="text-[9px] text-[#E3D5CA]/60 font-mono">Yield: 2.0%</span>
              </div>
          </div>

          {/* Capitec */}
          <div className="flex items-center gap-3 bg-[#1A1C19] px-4 py-2 rounded-lg border border-[#2C2E2B]">
              <div className="w-2 h-2 rounded-full bg-[#A3B18A]"></div>
              <CreditCard className="w-4 h-4 text-[#E3D5CA]" />
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#E3D5CA]">Capitec</span>
                  <span className="text-[9px] text-[#E3D5CA]/60 font-mono">Liquid Floor</span>
              </div>
          </div>

          {/* Checkers */}
          <div className="flex items-center gap-3 bg-[#1A1C19] px-4 py-2 rounded-lg border border-[#2C2E2B]">
              <div className="w-2 h-2 rounded-full bg-[#D4A373]"></div>
              <ShoppingCart className="w-4 h-4 text-[#E3D5CA]" />
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#E3D5CA]">Checkers</span>
                  <span className="text-[9px] text-[#E3D5CA]/60 font-mono">Protocol Active</span>
              </div>
          </div>
      </div>

      {/* 4. Nutrition Snapshot (Left Bottom) */}
      <div className="lg:col-span-6 bg-[#1A1C19] border border-[#2C2E2B] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold text-[#E3D5CA]">Nutrition Snapshot</h3>
              <Battery className="w-4 h-4 text-[#A3B18A]" />
          </div>
          <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#2C2E2B]/50 rounded border border-[#2C2E2B]">
                  <span className="text-xs text-[#E3D5CA]/80">Current Protocol</span>
                  <span className="text-sm font-bold text-[#D4A373]">Rest Day: Low Carb</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-[#1A1C19] border border-[#2C2E2B] rounded">
                      <span className="block text-[10px] text-[#E3D5CA]/50 uppercase">Protein</span>
                      <span className="block font-mono text-[#E3D5CA]">180g</span>
                  </div>
                  <div className="p-2 bg-[#1A1C19] border border-[#2C2E2B] rounded">
                      <span className="block text-[10px] text-[#E3D5CA]/50 uppercase">Carbs</span>
                      <span className="block font-mono text-[#E3D5CA]">50g</span>
                  </div>
                  <div className="p-2 bg-[#1A1C19] border border-[#2C2E2B] rounded">
                      <span className="block text-[10px] text-[#E3D5CA]/50 uppercase">Budget</span>
                      <span className="block font-mono text-[#A3B18A]">On Track</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 5. Placeholder for Debt Snapshot (Right Bottom) */}
      <div className="lg:col-span-6 bg-[#1A1C19] border border-[#2C2E2B] rounded-2xl p-6 flex flex-col justify-center items-center text-center">
           <h3 className="font-serif font-bold text-[#BC4749] mb-2">Priority Threat</h3>
           <p className="text-3xl font-mono font-bold text-[#E3D5CA] mb-2">Discovery Credit</p>
           <p className="text-sm text-[#E3D5CA]/60">Interest Rate: 20.25%</p>
           <div className="mt-4 bg-[#BC4749]/20 text-[#BC4749] px-4 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[#BC4749]/30">
               Avalanche Target
           </div>
      </div>

    </div>
  );
};