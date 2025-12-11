import React, { useState } from 'react';
import { TabView } from './types';
import { DebtManager } from './components/DebtManager';
import { FinancialChat } from './components/FinancialChat';
import { WalletView } from './components/WalletView';
import { AnalyticsView } from './components/AnalyticsView';
import { BudgetInsightsView } from './components/BudgetInsightsView';
import { ConciergeAgent } from './components/ConciergeAgent';
import { NutritionProtocol } from './components/NutritionProtocol';
import { StrategyMatrix } from './components/StrategyMatrix';
import { Dashboard } from './components/Dashboard';
import { SettingsView } from './components/SettingsView';
import { LayoutDashboard, Wallet, Zap, ShieldAlert, UtensilsCrossed, Briefcase, Settings, Menu, X, BarChart3, Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.COMMAND_CENTER);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ id, label, icon: Icon }: { id: TabView, label: string, icon: any }) => (
    <button
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        activeTab === id
          ? 'bg-[#D4A373]/10 text-[#D4A373] border-l-2 border-[#D4A373]'
          : 'text-[#E3D5CA]/60 hover:text-[#E3D5CA] hover:bg-[#2C2E2B]'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen font-mono flex ${zenMode ? 'bg-black' : 'bg-[#1A1C19]'} text-[#E3D5CA] transition-colors duration-500`}>
      
      {/* Sidebar (Desktop) */}
      <aside className={`hidden md:flex flex-col w-72 border-r border-[#2C2E2B] h-screen sticky top-0 p-6 ${zenMode ? 'opacity-20 hover:opacity-100 transition-opacity' : ''}`}>
          <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 flex items-center justify-center text-[#D4A373] border border-[#D4A373] rounded-full p-2">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                       <circle cx="9" cy="12" r="4" />
                       <line x1="13" y1="12" x2="21" y2="12" />
                       <line x1="18" y1="12" x2="18" y2="16" />
                       <line x1="21" y1="12" x2="21" y2="16" />
                   </svg>
              </div>
              <div>
                  <h1 className="text-sm font-serif font-bold text-[#E3D5CA]">PROJECT</h1>
                  <h1 className="text-sm font-serif font-bold text-[#D4A373] tracking-widest">SKELETON KEY</h1>
              </div>
          </div>
          
          <nav className="flex-1 space-y-1">
              <NavItem id={TabView.COMMAND_CENTER} label="Command Center" icon={LayoutDashboard} />
              <NavItem id={TabView.ANALYTICS} label="Analytics" icon={BarChart3} />
              <NavItem id={TabView.BUDGET_INSIGHTS} label="Budget Insights" icon={Lightbulb} />
              <NavItem id={TabView.MASTER_LEDGER} label="Master Ledger" icon={Wallet} />
              <NavItem id={TabView.PARTNER_STRATEGY} label="Partner Strategy" icon={Zap} />
              <NavItem id={TabView.DEBT_MANAGER} label="Debt Manager" icon={ShieldAlert} />
              <NavItem id={TabView.NUTRITION_PROTOCOL} label="Nutrition Protocol" icon={UtensilsCrossed} />
              <NavItem id={TabView.CONCIERGE} label="The Concierge" icon={Briefcase} />
          </nav>

          <div className="mt-auto pt-6 border-t border-[#2C2E2B]">
               <NavItem id={TabView.SETTINGS} label="Settings" icon={Settings} />
               {/* Quick Zen Toggle */}
               <div className="mt-4 px-4 flex items-center justify-between">
                   <span className="text-xs text-[#E3D5CA]/50 uppercase">Zen Mode</span>
                   <button 
                    onClick={() => setZenMode(!zenMode)} 
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${zenMode ? 'bg-[#D4A373]' : 'bg-[#2C2E2B]'}`}
                   >
                       <div className={`w-3 h-3 bg-[#E3D5CA] rounded-full shadow transition-transform ${zenMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                   </button>
               </div>
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-[#2C2E2B] sticky top-0 bg-[#1A1C19] z-40">
               <div className="flex items-center gap-2">
                   <div className="w-8 h-8 text-[#D4A373]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                           <circle cx="9" cy="12" r="4" />
                           <line x1="13" y1="12" x2="21" y2="12" />
                       </svg>
                   </div>
                   <span className="font-serif font-bold text-[#D4A373]">SKELETON KEY</span>
               </div>
               <button onClick={() => setMobileMenuOpen(true)} className="text-[#E3D5CA]">
                   <Menu />
               </button>
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 bg-[#1A1C19] p-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-8">
                      <span className="font-serif font-bold text-[#D4A373]">COMMAND MODULES</span>
                      <button onClick={() => setMobileMenuOpen(false)}><X /></button>
                  </div>
                  <nav className="space-y-4">
                      <NavItem id={TabView.COMMAND_CENTER} label="Command Center" icon={LayoutDashboard} />
                      <NavItem id={TabView.ANALYTICS} label="Analytics" icon={BarChart3} />
                      <NavItem id={TabView.BUDGET_INSIGHTS} label="Budget Insights" icon={Lightbulb} />
                      <NavItem id={TabView.MASTER_LEDGER} label="Master Ledger" icon={Wallet} />
                      <NavItem id={TabView.PARTNER_STRATEGY} label="Partner Strategy" icon={Zap} />
                      <NavItem id={TabView.DEBT_MANAGER} label="Debt Manager" icon={ShieldAlert} />
                      <NavItem id={TabView.NUTRITION_PROTOCOL} label="Nutrition Protocol" icon={UtensilsCrossed} />
                      <NavItem id={TabView.CONCIERGE} label="The Concierge" icon={Briefcase} />
                      <NavItem id={TabView.SETTINGS} label="Settings" icon={Settings} />
                  </nav>
              </div>
          )}

          <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* View Rendering */}
              {zenMode ? (
                  <Dashboard /> /* Zen Mode only shows Command Center metrics */
              ) : (
                  <>
                      {activeTab === TabView.COMMAND_CENTER && <Dashboard />}
                      {activeTab === TabView.ANALYTICS && <AnalyticsView />}
                      {activeTab === TabView.BUDGET_INSIGHTS && <BudgetInsightsView />}
                      {activeTab === TabView.MASTER_LEDGER && <WalletView />}
                      {activeTab === TabView.PARTNER_STRATEGY && <StrategyMatrix />}
                      {activeTab === TabView.DEBT_MANAGER && <DebtManager />}
                      {activeTab === TabView.NUTRITION_PROTOCOL && <NutritionProtocol />}
                      {activeTab === TabView.CONCIERGE && <ConciergeAgent />}
                      {activeTab === TabView.SETTINGS && <SettingsView zenMode={zenMode} toggleZenMode={() => setZenMode(!zenMode)} />}
                  </>
              )}
          </div>
      </main>

      {/* AI Officer Button */}
      <button 
           onClick={() => setIsChatOpen(true)}
           className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-[#D4A373] hover:bg-[#c29265] text-[#1A1C19] rounded-full shadow-[0_0_20px_rgba(212,163,115,0.3)] flex items-center justify-center transition-transform hover:scale-105 z-40 border-2 border-[#1A1C19]"
      >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>

      {/* Chat Widget */}
      <FinancialChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
export default App;