import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, TooltipProps, LineChart, Line } from 'recharts';
import { TabView, TimeRange } from './types';
import { CATEGORY_DATA, MONTHLY_SPEND_TREND, INSIGHTS, MOCK_TRANSACTIONS, formatCurrency } from './constants';
import { DebtManager } from './components/DebtManager';
import { FinancialChat } from './components/FinancialChat';
import { WalletView } from './components/WalletView';
import { ConciergeAgent } from './components/ConciergeAgent';
import { NutritionProtocol } from './components/NutritionProtocol';
import { NetWorthWidget } from './components/NetWorthWidget';
import { StrategyMatrix } from './components/StrategyMatrix';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DASHBOARD);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('MONTH');

  // Dashboard Data Mocking based on TimeRange
  const burnRateData = MONTHLY_SPEND_TREND.slice(-3); // Last 3 months for sparkline
  const lazinessData = MONTHLY_SPEND_TREND.map(m => ({ name: m.month, value: m.laziness }));
  
  // Savings Rate Calculation
  const savingsRate = ((INSIGHTS.monthlyIncome - (INSIGHTS.uberEatsTotal/12 + INSIGHTS.groceriesTotal/12 + INSIGHTS.totalDebtService/12)) / INSIGHTS.monthlyIncome) * 100;

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* KPI 1: Burn Rate (Sparkline) */}
      <div className={`lg:col-span-1 p-6 rounded-2xl border flex flex-col justify-between ${zenMode ? 'bg-black/95 border-slate-900 grayscale' : 'bg-slate-900/80 border-slate-800'}`}>
         <div className="flex justify-between items-start mb-4">
             <div>
                 <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Burn Rate</h3>
                 <p className="text-2xl font-black text-white mt-1">R 41,000<span className="text-sm font-normal text-slate-500">/mo</span></p>
             </div>
             <span className="text-green-500 text-xs font-bold bg-green-900/20 px-2 py-1 rounded">↓ 5% vs Avg</span>
         </div>
         <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnRateData}>
                    <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} itemStyle={{ display: 'none' }} labelStyle={{ display: 'none' }} formatter={(val: number) => formatCurrency(val)} />
                </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* KPI 2: Savings Rate (Progress) */}
      <div className={`lg:col-span-1 p-6 rounded-2xl border flex flex-col justify-between ${zenMode ? 'bg-black/95 border-slate-900 grayscale' : 'bg-slate-900/80 border-slate-800'}`}>
         <div>
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Wealth Velocity</h3>
             <p className="text-2xl font-black text-white mt-1">{savingsRate.toFixed(1)}%</p>
             <p className="text-xs text-slate-500 mt-1">Target: >20%</p>
         </div>
         <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mt-4">
             <div className="bg-purple-600 h-full rounded-full" style={{ width: `${savingsRate}%` }}></div>
         </div>
         <div className="flex justify-between text-[10px] text-slate-500 mt-2">
             <span>0%</span>
             <span>50%</span>
             <span>100%</span>
         </div>
      </div>

      {/* NEW: Net Worth Widget */}
      <div className={`lg:col-span-1 ${zenMode ? 'bg-black/95 border-slate-900' : ''}`}>
         <NetWorthWidget />
      </div>

      {/* KPI 3: Laziness Tax (Bar Chart) - HIDDEN IN ZEN MODE */}
      {!zenMode && (
          <div className="lg:col-span-1 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Laziness Tax Index</h3>
             <div className="h-32">
                 <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={lazinessData.slice(-4)}>
                         <Bar dataKey="value" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                         <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} formatter={(val: number) => formatCurrency(val)} />
                         <XAxis dataKey="name" tick={{fontSize: 10}} stroke="#475569" axisLine={false} tickLine={false} />
                     </BarChart>
                 </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-center text-slate-500 mt-2">Uber Eats + Delivery Fees + Markups</p>
          </div>
      )}

      {/* Main Chart - HIDDEN IN ZEN MODE */}
      {!zenMode && (
          <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 h-96">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-200 font-bold text-sm uppercase tracking-wide">Capital Conservation Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SPEND_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis stroke="#475569" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `R${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="spend" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Monthly Spend" barSize={40} />
                <Bar dataKey="debt" fill="#ef4444" radius={[2, 2, 0, 0]} name="Total Debt" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen text-slate-200 font-sans selection:bg-[#D4A373] selection:text-black flex flex-col md:flex-row ${zenMode ? 'bg-[#050505]' : 'bg-[#0f1214]'}`}>
      
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 border-r h-screen sticky top-0 p-4 transition-colors ${zenMode ? 'bg-black border-slate-900' : 'bg-[#0f1214] border-slate-800'}`}>
          <div className="flex items-center gap-3 px-2 mb-10">
              {/* Skeleton Key Icon */}
              <div className="w-8 h-8 flex items-center justify-center text-[#D4A373]">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                       <circle cx="9" cy="12" r="4" />
                       <line x1="13" y1="12" x2="21" y2="12" />
                       <line x1="18" y1="12" x2="18" y2="16" />
                       <line x1="21" y1="12" x2="21" y2="16" />
                   </svg>
              </div>
              <h1 className="text-xs font-bold tracking-widest text-[#D4A373] uppercase leading-tight">Project<br/>Skeleton Key</h1>
          </div>
          
          <nav className="flex-1 space-y-1">
              {[
                  { id: TabView.DASHBOARD, label: 'Command Center', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
                  { id: TabView.WALLET, label: 'Master Ledger', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg> },
                  { id: TabView.CONCIERGE, label: 'The Concierge', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                  { id: TabView.NUTRITION, label: 'Nutrition Protocol', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a5 5 0 0 1 5-5z"/><path d="M8 11h8"/><path d="M8 15h8"/></svg> },
                  { id: TabView.DEBT_MANAGER, label: 'Debt Manager', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
                  { id: TabView.PARTNER_MATRIX, label: 'Partner Matrix', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
              ].map((item) => (
                  <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeTab === item.id 
                            ? 'bg-[#D4A373]/10 text-[#D4A373] border border-[#D4A373]/20 shadow-[0_0_10px_rgba(212,163,115,0.1)]' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }`}
                  >
                      {item.icon}
                      {item.label}
                  </button>
              ))}
          </nav>

          <div className="mt-auto space-y-4">
               <button onClick={() => setZenMode(!zenMode)} className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${zenMode ? 'bg-[#D4A373] text-black' : 'bg-slate-900 text-slate-500'}`}>
                  Zen Mode
                  <div className={`w-2 h-2 rounded-full ${zenMode ? 'bg-black' : 'bg-slate-700'}`}></div>
               </button>
          </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 relative scroll-smooth">
        {/* Header with Global Time Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <div className="md:hidden flex items-center gap-2 w-full">
                <div className="w-8 h-8 text-[#D4A373]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                       <circle cx="9" cy="12" r="4" />
                       <line x1="13" y1="12" x2="21" y2="12" />
                       <line x1="18" y1="12" x2="18" y2="16" />
                       <line x1="21" y1="12" x2="21" y2="16" />
                   </svg>
                </div>
                <h1 className="text-lg font-bold text-[#D4A373] tracking-widest uppercase">Skeleton Key</h1>
            </div>

            {/* Global Filter */}
            {!zenMode && (
                <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex overflow-x-auto max-w-full md:ml-auto sticky top-0 z-20 shadow-xl">
                     {(['TODAY', 'WEEK', 'MONTH', '3MONTHS'] as TimeRange[]).map((range) => (
                         <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${timeRange === range ? 'bg-[#D4A373] text-black shadow' : 'text-slate-500 hover:text-slate-300'}`}
                         >
                             {range.replace('3', '3 ')}
                         </button>
                     ))}
                </div>
            )}
        </div>

        {/* Tab Content */}
        {activeTab === TabView.DASHBOARD && renderDashboard()}
        {activeTab === TabView.WALLET && <WalletView timeRange={timeRange} />}
        {activeTab === TabView.CONCIERGE && <ConciergeAgent />}
        {activeTab === TabView.NUTRITION && <NutritionProtocol />}
        {activeTab === TabView.PARTNER_MATRIX && <StrategyMatrix />}
        {activeTab === TabView.DEBT_MANAGER && <DebtManager />}
        
        {/* FAB */}
        <button 
           onClick={() => setIsChatOpen(!isChatOpen)}
           className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-[#D4A373] hover:bg-[#c29265] text-black rounded-full shadow-2xl shadow-[#D4A373]/20 flex items-center justify-center transition-transform hover:scale-105 z-40 border-2 border-slate-900"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>

        {/* Chat Widget */}
        <FinancialChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1214] border-t border-slate-800 p-2 flex justify-around z-30 pb-safe">
        {[
            { id: TabView.DASHBOARD, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
            { id: TabView.WALLET, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg> },
            { id: TabView.DEBT_MANAGER, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
            { id: TabView.NUTRITION, icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a5 5 0 0 1 5-5z"/><path d="M8 11h8"/><path d="M8 15h8"/></svg> },
        ].map((item) => (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-3 rounded-xl transition-colors ${
                    activeTab === item.id ? 'bg-[#D4A373] text-black' : 'text-slate-500'
                }`}
            >
                {item.icon}
            </button>
        ))}
      </div>
    </div>
  );
};
export default App;