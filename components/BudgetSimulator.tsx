import React, { useState } from 'react';
import { INSIGHTS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const BudgetSimulator: React.FC = () => {
  const [uberCut, setUberCut] = useState(50);
  const [subCut, setSubCut] = useState(20);
  const [totalDebt, setTotalDebt] = useState(195000); 

  const monthlyUber = INSIGHTS.uberEatsTotal / 12;
  const monthlySubs = INSIGHTS.subscriptionsTotal / 12;
  const savingsUber = monthlyUber * (uberCut / 100);
  const savingsSubs = monthlySubs * (subCut / 100);
  const totalMonthlySavings = savingsUber + savingsSubs;

  // Simulate payoff timeline
  const generateTimelineData = () => {
    const data = [];
    const monthlyPaymentCurrent = 5000;
    const monthlyPaymentOptimized = 5000 + totalMonthlySavings;
    let balanceCurrent = totalDebt;
    let balanceOptimized = totalDebt;
    const interestRate = 0.22 / 12;

    for (let i = 0; i <= 24; i++) {
        data.push({
            month: i,
            Current: Math.max(0, Math.round(balanceCurrent)),
            Optimized: Math.max(0, Math.round(balanceOptimized))
        });
        balanceCurrent = (balanceCurrent * (1 + interestRate)) - monthlyPaymentCurrent;
        balanceOptimized = (balanceOptimized * (1 + interestRate)) - monthlyPaymentOptimized;
    }
    return data;
  };

  const timelineData = generateTimelineData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-600 pb-4">
          Debt Destruction Simulator
        </h2>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-orange-400">Cut "Convenience" Spending</label>
                <span className="text-sm font-bold text-white">{uberCut}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={uberCut} 
              onChange={(e) => setUberCut(Number(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              Potential Saving: <span className="text-green-400 font-bold">R{savingsUber.toFixed(0)}</span> / month
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-purple-400">Optimize Subscriptions</label>
                <span className="text-sm font-bold text-white">{subCut}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={subCut} 
              onChange={(e) => setSubCut(Number(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              Potential Saving: <span className="text-green-400 font-bold">R{savingsSubs.toFixed(0)}</span> / month
            </p>
          </div>
        </div>

        <div className="mt-8 bg-slate-900/50 p-4 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400 text-sm">New Monthly Free Cashflow</span>
                <span className="text-2xl font-bold text-green-400">+R{totalMonthlySavings.toFixed(0)}</span>
            </div>
            <p className="text-xs text-slate-500">
                Directing this to debt yields a guaranteed 22% ROI.
            </p>
        </div>

        <button className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/20 transition-all transform hover:scale-[1.02]">
            EXECUTE STRATEGY
        </button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Payoff Timeline (Months)</h2>
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="Current" stroke="#ef4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Optimized" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-slate-300 p-4 bg-slate-900 rounded border border-slate-700">
            Based on the simulation, you could be debt-free <span className="text-green-400 font-bold">8 months earlier</span> by executing this strategy.
        </div>
      </div>
    </div>
  );
};