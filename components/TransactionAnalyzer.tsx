import React, { useState } from 'react';
import { GoogleGenAI, Type, Schema } from "@google/genai";

export const TransactionAnalyzer: React.FC = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const analyzeTransaction = async () => {
    if (!description) return;
    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          clean_merchant: { type: Type.STRING, description: "The identified merchant name in Title Case" },
          category: { type: Type.STRING, description: "One of: Housing, Transport, Food & Dining, Utilities, Insurance, Healthcare, Savings, Entertainment, Personal Care" },
          is_subscription_suspected: { type: Type.BOOLEAN, description: "True if this looks like a recurring subscription" },
          insight: { type: Type.STRING, description: "A very brief 5-word comment on the spend" }
        },
        required: ["clean_merchant", "category", "is_subscription_suspected", "insight"]
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this transaction: Description: "${description}", Amount: ${amount || 'N/A'}.`,
        config: {
          systemInstruction: "Role: You are 'Skeleton Key', an elite personal finance assistant. Your goal is to help users optimize their cash flow, reduce waste, and build wealth without being judgmental. Analyze the transaction string provided.",
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      });

      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Analysis failed", error);
      setResult({ insight: "Error analyzing transaction. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 shadow-lg mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">AI</div>
        <div>
          <h2 className="text-xl font-bold text-white">Transaction Forensic Engine</h2>
          <p className="text-sm text-slate-400">Powered by Gemini 1.5 Flash</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Raw Bank Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. POS DEBIT TST* TOAST INC"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount (Optional)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 150.00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
          />
        </div>
      </div>

      <button
        onClick={analyzeTransaction}
        disabled={loading || !description}
        className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${
          loading || !description 
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
        }`}
      >
        {loading ? 'ANALYZING PATTERNS...' : 'RUN FORENSIC ANALYSIS'}
      </button>

      {result && (
        <div className="mt-6 animate-fade-in border-t border-slate-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-500 uppercase font-bold">Clean Merchant</span>
              <p className="text-xl font-bold text-white mt-1">{result.clean_merchant}</p>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-500 uppercase font-bold">Category</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-3 h-3 rounded-full ${
                  result.category === 'Food & Dining' ? 'bg-orange-500' :
                  result.category === 'Transport' ? 'bg-yellow-500' :
                  result.category === 'Housing' ? 'bg-purple-500' : 'bg-blue-500'
                }`}></span>
                <p className="text-xl font-bold text-white">{result.category}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-4">
             <div className={`flex-1 p-4 rounded-lg border ${
               result.is_subscription_suspected 
                 ? 'bg-red-900/20 border-red-500/50 text-red-200' 
                 : 'bg-green-900/20 border-green-500/50 text-green-200'
             }`}>
               <span className="text-xs font-bold uppercase block mb-1">Subscription Status</span>
               <span className="font-bold flex items-center gap-2">
                 {result.is_subscription_suspected ? '⚠️ RECURRING SUSPECTED' : '✅ ONE-OFF TRANSACTION'}
               </span>
             </div>
             
             <div className="flex-[2] bg-blue-900/20 p-4 rounded-lg border border-blue-500/50 text-blue-100">
                <span className="text-xs font-bold uppercase block mb-1 text-blue-300">Skeleton Key Insight</span>
                <p className="italic">"{result.insight}"</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};