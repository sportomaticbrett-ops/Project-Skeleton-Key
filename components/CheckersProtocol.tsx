import React, { useState } from 'react';
import { DIET_PLANS, formatCurrency } from '../constants';
import { GoogleGenAI } from "@google/genai";

export const CheckersProtocol: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState(DIET_PLANS[0]);
  const [loading, setLoading] = useState(false);
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const generatePlan = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Simulate generation for demo speed, or use AI
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a shopping list for diet: ${selectedPlan.name} (${selectedPlan.description}). 
            Budget: R${selectedPlan.budget_weekly}. 
            Items should be common South African grocery items.
            Output JSON: { items: [{name, price, category, swap_suggestion: {name, price}}] }`,
            config: { responseMimeType: "application/json" }
        });
        
        if (response.text) {
            const data = JSON.parse(response.text);
            setShoppingList(data.items);
            const total = data.items.reduce((acc: number, item: any) => acc + item.price, 0);
            setTotalCost(total);
        }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const swapItem = (index: number) => {
      const newList = [...shoppingList];
      const item = newList[index];
      if (item.swap_suggestion) {
          const swap = item.swap_suggestion;
          // Perform swap
          newList[index] = { 
              ...item, 
              name: swap.name, 
              price: swap.price, 
              swap_suggestion: { name: item.name, price: item.price } // Allow swap back
          };
          setShoppingList(newList);
          setTotalCost(newList.reduce((acc, i) => acc + i.price, 0));
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-[calc(100vh-140px)]">
        {/* Left: Setup */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-4">Protocol Setup</h2>
                <div className="space-y-3">
                    {DIET_PLANS.map((plan) => (
                        <div 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPlan.id === plan.id ? 'bg-orange-900/20 border-orange-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-bold">{plan.name}</span>
                                {selectedPlan.id === plan.id && <span className="text-orange-500">●</span>}
                            </div>
                            <p className="text-xs mt-1 opacity-70">{plan.description}</p>
                            <p className="text-xs font-mono font-bold mt-2 text-orange-400">Target: R{plan.budget_weekly}/wk</p>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={generatePlan}
                    disabled={loading}
                    className="w-full mt-6 bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold transition-colors"
                >
                    {loading ? 'GENERATING PROTOCOL...' : 'GENERATE SHOPPING LIST'}
                </button>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A8 8 0 1 1 6 10a7 7 0 0 1 15.18 2.39 9 9 0 1 1-2.91 3.55"/><path d="M12 2v20"/></svg>
                 </div>
                 <h3 className="text-slate-500 text-xs font-bold uppercase mb-2">Projected Spend</h3>
                 <div className={`text-3xl font-mono font-bold ${totalCost > selectedPlan.budget_weekly ? 'text-red-500' : 'text-green-500'}`}>
                     {formatCurrency(totalCost)}
                 </div>
                 <p className="text-xs text-slate-500 mt-1">vs Budget: {formatCurrency(selectedPlan.budget_weekly)}</p>
            </div>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <h3 className="font-bold text-white">Checkers List (Generated)</h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">Xtra Savings Enabled</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {shoppingList.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <p>Select a protocol to initialize.</p>
                    </div>
                )}
                {shoppingList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg group">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded border border-slate-600"></div>
                            <div>
                                <p className="text-slate-200 font-medium">{item.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase">{item.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-white text-sm">{formatCurrency(item.price)}</span>
                            {item.swap_suggestion && (
                                <button 
                                   onClick={() => swapItem(idx)}
                                   className="text-[10px] bg-slate-800 hover:bg-slate-700 text-orange-400 px-2 py-1 rounded border border-slate-700 transition-colors"
                                >
                                    SWAP FOR {item.swap_suggestion.name.toUpperCase()} ({formatCurrency(item.swap_suggestion.price)})
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};