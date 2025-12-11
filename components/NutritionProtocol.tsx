import React, { useState } from 'react';
import { GROCERY_DATABASE, MEAL_OPTIONS, formatCurrency } from '../constants';
import { GroceryItem, Meal } from '../types';

export const NutritionProtocol: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'MEALS'>('ITEMS');
  const [isTrainingDay, setIsTrainingDay] = useState(true);
  const [budgetTarget, setBudgetTarget] = useState(1500);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<GroceryItem[]>([]);

  // Filter grocery database
  const filteredGroceries = GROCERY_DATABASE.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeals = MEAL_OPTIONS.filter(meal => 
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item: GroceryItem) => {
    setCart(prev => [...prev, item]);
  };

  const addMealToCart = (meal: Meal) => {
      // Treat a meal as a single item for simplicity in cart, or add its ingredients? 
      // Strategy: Add the Meal object as a GroceryItem typed 'Meal'
      const mealItem: GroceryItem = {
          id: `meal-${Date.now()}`, // temp id
          name: `[MEAL] ${meal.name}`,
          price: meal.price,
          macros: meal.macros,
          category: 'Meal'
      };
      setCart(prev => [...prev, mealItem]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const totalCost = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-[calc(100vh-140px)]">
        
        {/* Left: Inventory Manager */}
        <div className="lg:col-span-2 flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-[#D4A373]">♦</span> Nutrition Logistics
                    </h2>
                    
                    {/* Training Mode Toggle */}
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button 
                            onClick={() => setIsTrainingDay(true)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${isTrainingDay ? 'bg-orange-600 text-white' : 'text-slate-500'}`}
                        >
                            TRAINING
                        </button>
                        <button 
                            onClick={() => setIsTrainingDay(false)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${!isTrainingDay ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                        >
                            REST DAY
                        </button>
                    </div>
                </div>

                {/* Sub Tabs */}
                <div className="flex gap-4 mb-4 text-sm font-bold text-slate-400 border-b border-slate-800 pb-2">
                    <button onClick={() => setActiveTab('ITEMS')} className={`hover:text-white ${activeTab === 'ITEMS' ? 'text-[#D4A373]' : ''}`}>Raw Items</button>
                    <button onClick={() => setActiveTab('MEALS')} className={`hover:text-white ${activeTab === 'MEALS' ? 'text-[#D4A373]' : ''}`}>Meal Kits</button>
                </div>

                {/* Search Bar */}
                <input 
                    type="text" 
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-[#D4A373] outline-none"
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeTab === 'ITEMS' ? (
                        filteredGroceries.map((item) => (
                            <div 
                                key={item.id}
                                className="flex justify-between items-center p-3 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-950/50 transition-colors group cursor-pointer"
                                onClick={() => addToCart(item)}
                            >
                                <div>
                                    <p className="font-bold text-slate-200">{item.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.category} • {item.macros}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-slate-300 font-bold">{formatCurrency(item.price)}</span>
                                    <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-slate-400 group-hover:bg-[#D4A373] group-hover:text-black transition-colors">
                                        +
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredMeals.map((meal) => (
                            <div 
                                key={meal.id}
                                className="flex justify-between items-center p-3 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-950/50 transition-colors group cursor-pointer"
                                onClick={() => addMealToCart(meal)}
                            >
                                <div>
                                    <p className="font-bold text-slate-200">{meal.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider text-blue-400">Meal Kit • {meal.macros}</p>
                                    <p className="text-[10px] text-slate-600 italic truncate w-48">{meal.ingredients.join(', ')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-slate-300 font-bold">{formatCurrency(meal.price)}</span>
                                    <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-slate-400 group-hover:bg-[#D4A373] group-hover:text-black transition-colors">
                                        +
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* Right: Shopping List & Budget */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden">
             <div className="p-6 border-b border-slate-800 bg-slate-950">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-3">Logistics Manifest</h3>
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-xs text-slate-500">Weekly Target</span>
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500">R</span>
                        <input 
                            type="number" 
                            value={budgetTarget}
                            onChange={(e) => setBudgetTarget(Number(e.target.value))}
                            className="bg-transparent text-right w-16 text-white font-mono font-bold outline-none border-b border-transparent focus:border-[#D4A373]"
                        />
                    </div>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {cart.length === 0 ? (
                     <div className="text-center text-slate-600 mt-10">
                         <p className="text-sm italic">Inventory empty.</p>
                     </div>
                 ) : (
                     cart.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0 group">
                             <div>
                                <span className={`text-sm block ${item.category === 'Meal' ? 'text-blue-300 font-bold' : 'text-slate-300'}`}>{item.name}</span>
                                <span className="text-xs text-slate-500 font-mono">{formatCurrency(item.price)}</span>
                             </div>
                             <button 
                                onClick={() => removeFromCart(idx)}
                                className="text-slate-600 hover:text-red-500 px-2"
                             >
                                 ×
                             </button>
                         </div>
                     ))
                 )}
             </div>

             <div className="p-6 bg-slate-950 border-t border-slate-800">
                 <div className="flex justify-between items-end mb-4">
                     <span className="text-xs text-slate-500 uppercase">Total Cargo Cost</span>
                     <span className={`text-2xl font-mono font-bold ${totalCost > budgetTarget ? 'text-red-500' : 'text-green-500'}`}>
                         {formatCurrency(totalCost)}
                     </span>
                 </div>
                 <button 
                    onClick={() => {navigator.clipboard.writeText(cart.map(i => `${i.name} - ${formatCurrency(i.price)}`).join('\n')); alert('List Copied');}}
                    disabled={cart.length === 0}
                    className="w-full bg-[#D4A373] hover:bg-[#c29265] text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    COPY MANIFEST
                 </button>
             </div>
        </div>
    </div>
  );
};