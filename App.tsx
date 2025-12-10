import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TabView } from './types';
import { CATEGORY_DATA, MONTHLY_SPEND_TREND, INSIGHTS } from './constants';
import { ForensicCard } from './components/ForensicCard';
import { BudgetSimulator } from './components/BudgetSimulator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DASHBOARD);

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* High Level Metrics */}
      <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-900/10">
          <h3 className="text-slate-400 text-sm uppercase font-semibold">Total Debt Exposure</h3>
          <p className="text-3xl font-bold text-white mt-2">R 195,495</p>
          <p className="text-red-400 text-xs mt-1">Interest avg 21.75%</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-orange-500/30">
          <h3 className="text-slate-400 text-sm uppercase font-semibold">Convenience Leakage</h3>
          <p className="text-3xl font-bold text-white mt-2">R ~3,500<span className="text-sm text-slate-500">/mo</span></p>
          <p className="text-orange-400 text-xs mt-1">Uber Eats & Rides</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30">
          <h3 className="text-slate-400 text-sm uppercase font-semibold">Projected Points Value</h3>
          <p className="text-3xl font-bold text-white mt-2">R 850<span className="text-sm text-slate-500">/mo</span></p>
          <p className="text-blue-400 text-xs mt-1">If optimized on AMEX</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-96">
        <h3 className="text-lg font-bold mb-4 text-slate-200">Expense Categorization (Annualized)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CATEGORY_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {CATEGORY_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-96">
        <h3 className="text-lg font-bold mb-4 text-slate-200">Debt vs Spend Trend (6 Months)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_SPEND_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="spend" fill="#3b82f6" name="Monthly Spend" />
            <Bar dataKey="debt" fill="#ef4444" name="Total Debt Balance" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderForensicReport = () => (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-red-500 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">The Auditor's Verdict</h2>
        <p className="text-slate-300 leading-relaxed">
          You are currently running a high-turnover personal economy that is bleeding efficiency. 
          While you have successfully cut the vaping expense (approx R12k/year savings - well done), 
          that saving is being instantly consumed by high-interest debt servicing and convenience spending.
        </p>
      </div>

      <div className="grid gap-4">
        <ForensicCard 
          title="The Smoking Gun: Uber Eats & Rides"
          severity="critical"
          value={`R${(INSIGHTS.uberEatsTotal / 1000).toFixed(1)}k+ Annualized`}
          description="You are using Uber Eats not as a treat, but as a lifestyle. The delivery fees, service fees, and menu markups constitute a 'Laziness Tax' of roughly 30% over home cooking."
          actionItem="Delete the app. Meal prep on Sundays. This single habit change pays for your medical aid."
        />

        <ForensicCard 
          title="The Interest Trap"
          severity="critical"
          value="21.75% - 22.25%"
          description="Your logs show repetitive 'Interest Charged' entries. You are carrying a revolving balance. Earning 1-3% in points while paying 22% in interest is a mathematical loss. No rewards program can outrun this interest rate."
          actionItem="Stop using the credit cards for new purchases immediately until balance is zero. Switch to Debit."
        />

        <ForensicCard 
          title="Business vs. Personal Bleed"
          severity="warning"
          value="Google Ads / SaaS"
          description="You have heavy business expenses (Google Ads, Midjourney, Figma) on personal cards. This muddies your credit utilization ratio and makes tax returns a nightmare."
          actionItem="Open a separate business account. Move all USD SaaS and Ad spend there."
        />
      </div>
    </div>
  );

  const renderPointsStrategy = () => (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-4">
            The AMEX Platinum Strategy
          </h2>
          <p className="text-slate-300 mb-6">
            You are acquiring the AMEX Platinum. This is a powerful tool, but dangerous in your current debt state. 
            Here is the South African playbook for 2025.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-3">1. The "Checkers" Pivot</h3>
          <p className="text-sm text-slate-400 mb-4">
            Your logs show massive Checkers/Sixty60 volume.
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            <li><strong>Current State:</strong> Likely earning minimal cash back on Absa/Discovery relative to potential.</li>
            <li><strong>2025 Strategy:</strong> If AMEX is Nedbank-linked, use Greenbacks for general spend. BUT, for Checkers specifically, nothing beats <strong>Standard Bank UCount</strong> (if you switch) or <strong>Discovery Miles</strong> (if you optimize health).</li>
            <li><strong>AMEX Role:</strong> Use for fuel (BP/Engen usually higher earn) and bulk online purchases.</li>
          </ul>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-3">2. Currency Conversion Hack</h3>
          <p className="text-sm text-slate-400 mb-4">
            You are paying international transaction fees on Google Ads, Midjourney, Figma.
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            <li><strong>The Leak:</strong> Banks charge ~2.75% spread + flat fees on USD spend.</li>
            <li><strong>The Fix:</strong> If your AMEX is the global dollar card, pay directly in USD. If local, consider a specialized business card like <strong>Payoneer</strong> or <strong>Shyft</strong> (Standard Bank) to pre-load Dollars at better rates for your SaaS stack.</li>
          </ul>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-3">3. Vitality vs. AMEX</h3>
          <p className="text-sm text-slate-400 mb-4">
            Your Discovery Status is fluctuating.
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            <li><strong>Advice:</strong> AMEX Membership Rewards are superior for <em>Travel</em> (1:1 airline transfers). Discovery Miles are superior for <em>Lifestyle/Cash</em> (Nando's, Takealot, Dis-Chem) specifically on "Miles D-Day" (15th of the month).</li>
            <li><strong>Protocol:</strong> Use AMEX for travel/business spend. Use Discovery for HealthyFood (Woolies/Pick n Pay) and Medicine to keep status alive.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">SK</div>
              <h1 className="text-xl font-bold tracking-tight text-white">PROJECT SKELETON KEY</h1>
            </div>
            <div className="hidden md:flex space-x-1">
              {Object.values(TabView).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto p-4 space-x-2 bg-slate-900 border-b border-slate-800">
        {Object.values(TabView).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === TabView.DASHBOARD && renderDashboard()}
        {activeTab === TabView.FORENSIC && renderForensicReport()}
        {activeTab === TabView.POINTS_STRATEGY && renderPointsStrategy()}
        {activeTab === TabView.BUDGET_TOOL && <BudgetSimulator />}
      </main>
    </div>
  );
};

export default App;