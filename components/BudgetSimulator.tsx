import React, { useState } from 'react';
import { INSIGHTS } from '../constants';

export const BudgetSimulator: React.FC = () => {
  const [uberCut, setUberCut] = useState(50);
  const [subCut, setSubCut] = useState(20);
  const [interestRate, setInterestRate] = useState(22);
  const [totalDebt, setTotalDebt] = useState(195000); // Estimated from "Total balance" logs

  const monthlyUber = INSIGHTS.uberEatsTotal / 12;
  const monthlySubs = INSIGHTS.subscriptionsTotal / 12;
  const monthlyInterest = (totalDebt * (interestRate / 100)) / 12;

  const savingsUber = monthlyUber * (uberCut / 100);
  const savingsSubs = monthlySubs * (subCut / 100);
  const totalMonthlySavings = savingsUber + savingsSubs;
  
  // Snowball calculation: How much faster to pay off debt with savings
  const monthsToPayoffCurrent = -Math.log(1 - (monthlyInterest * totalDebt) / 5000) / Math.log(1 + monthlyInterest); // Assuming 5k payment
  const newPayment = 5000 + totalMonthlySavings;
  const monthsToPayoffNew = totalDebt / newPayment; // Simplified linear for visualization

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-600 pb-2">
        Debt Destruction Simulator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-orange-400 mb-2">
              Cut "Convenience" Spending (Uber Eats/Rides) by {uberCut}%
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={uberCut} 
              onChange={(e) => setUberCut(Number(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-right text-xs text-slate-400 mt-1">
              Saving: <span className="text-green-400 font-bold">R{savingsUber.toFixed(0)}</span> / month
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-400 mb-2">
              Optimize Subscriptions (USD fees) by {subCut}%
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={subCut} 
              onChange={(e) => setSubCut(Number(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-right text-xs text-slate-400 mt-1">
              Saving: <span className="text-green-400 font-bold">R{savingsSubs.toFixed(0)}</span> / month
            </p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Projected Impact</h3>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Monthly 'Found' Money:</span>
            <span className="text-2xl font-bold text-green-400">R{totalMonthlySavings.toFixed(0)}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Current Interest Burn:</span>
            <span className="text-xl font-bold text-red-400">~R{(totalDebt * 0.22 / 12).toFixed(0)}/pm</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-300">
              If you divert this <strong>R{totalMonthlySavings.toFixed(0)}</strong> directly to your credit card debt, you effectively earn a guaranteed <strong>22% return</strong> (by saving interest).
            </p>
            <div className="mt-3 bg-blue-900/30 p-3 rounded border border-blue-800 text-sm text-blue-200">
              <strong>Strategist Tip:</strong> Do not invest this money. No investment guarantees 22% returns like paying off this debt does.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};