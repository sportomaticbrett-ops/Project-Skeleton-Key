import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { formatCurrency } from '../constants';

export const ConciergeAgent: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'INSURANCE' | 'DIET'>('INSURANCE');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const runInsuranceHunter = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      // Convert image/pdf to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Stronger model for "Analysis"
            contents: {
                parts: [
                    { inlineData: { mimeType: file.type, data: base64Data } },
                    { text: "Analyze this insurance schedule. Extract: Vehicle, Premium, Excess. Compare to South African market averages for 2025. Is this a good deal? Output JSON: { vehicle, premium, excess, verdict, recommendation }" }
                ]
            },
            config: { responseMimeType: "application/json" }
        });
        
        if (response.text) {
             setResult(JSON.parse(response.text));
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);

    } catch (e) {
        console.error(e);
        setResult({ verdict: "Error analyzing document. Please upload a clear image." });
        setLoading(false);
    }
  };

  const runDietHunter = async () => {
      setLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Simulated "Leaflet Scraping" context
      const currentSpecials = `
        Checkers Specials:
        - Bulk Lean Mince 2kg: R179.00
        - Chicken Breast Fillets 1kg: R89.00
        - Broccoli Pre-pack: R19.00
        - Eggs 30s: R69.00
      `;

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context: ${currentSpecials}. 
            User Goal: High Protein, Low Budget (<R500).
            Task: Identify the best deals matching the goal. Output JSON: { deals: [{item, price, reason}] }`,
            config: { responseMimeType: "application/json" }
        });
        if (response.text) {
            setResult(JSON.parse(response.text));
        }
      } catch(e) { console.error(e); }
      setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Mode Switcher */}
      <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
          <button 
             onClick={() => { setActiveMode('INSURANCE'); setResult(null); }}
             className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeMode === 'INSURANCE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
              Insurance Hunter
          </button>
          <button 
             onClick={() => { setActiveMode('DIET'); setResult(null); }}
             className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeMode === 'DIET' ? 'bg-green-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
              Diet Hunter
          </button>
      </div>

      {activeMode === 'INSURANCE' && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div>
                      <h2 className="text-xl font-bold text-white">Policy Analyzer</h2>
                      <p className="text-slate-400 text-sm">Upload your insurance schedule. The Agent will benchmark it against market rates.</p>
                  </div>
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-slate-300 font-bold mb-2">
                          {file ? file.name : "Drop PDF or Image here"}
                      </div>
                      <span className="text-blue-500 text-sm font-bold uppercase tracking-wider">Browse Files</span>
                  </label>
              </div>

              <button 
                 onClick={runInsuranceHunter}
                 disabled={!file || loading}
                 className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-bold transition-colors"
              >
                  {loading ? 'AGENT ANALYZING...' : 'RUN BENCHMARK'}
              </button>

              {result && result.vehicle && (
                  <div className="mt-8 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden animate-fade-in">
                      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between">
                          <span className="text-slate-400 font-bold">Analysis Result</span>
                          <span className="text-blue-400 font-mono font-bold">{result.vehicle}</span>
                      </div>
                      <div className="p-6 grid grid-cols-2 gap-6">
                          <div>
                              <p className="text-xs text-slate-500 uppercase font-bold">Your Premium</p>
                              <p className="text-xl text-white font-mono">{result.premium}</p>
                          </div>
                          <div>
                              <p className="text-xs text-slate-500 uppercase font-bold">Market Benchmark</p>
                              <p className="text-xl text-green-400 font-mono">~R 950.00</p>
                          </div>
                          <div className="col-span-2 bg-blue-900/10 p-4 rounded border border-blue-500/20">
                              <p className="text-sm text-blue-200 font-medium">Verdict: {result.verdict}</p>
                              <p className="text-xs text-slate-400 mt-1">{result.recommendation}</p>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )}

      {activeMode === 'DIET' && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-900/20 rounded-xl flex items-center justify-center text-green-500">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A8 8 0 1 1 6 10a7 7 0 0 1 15.18 2.39 9 9 0 1 1-2.91 3.55"/><path d="M12 2v20"/></svg>
                  </div>
                  <div>
                      <h2 className="text-xl font-bold text-white">Deal Hunter</h2>
                      <p className="text-slate-400 text-sm">Scans Checkers leaflets to match your diet profile.</p>
                  </div>
              </div>

              <div className="flex gap-4 mb-6">
                  <div className="flex-1 p-4 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-500 uppercase font-bold">Active Profile</span>
                      <p className="text-white font-bold">High Protein / Budget</p>
                  </div>
                  <div className="flex-1 p-4 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-500 uppercase font-bold">Weekly Budget</span>
                      <p className="text-white font-bold">R 500.00</p>
                  </div>
              </div>

              <button 
                 onClick={runDietHunter}
                 disabled={loading}
                 className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-colors"
              >
                  {loading ? 'SCANNING LEAFLETS...' : 'FIND DEALS'}
              </button>

              {result && result.deals && (
                  <div className="mt-6 space-y-3 animate-fade-in">
                      {result.deals.map((deal: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-lg">
                              <div>
                                  <p className="font-bold text-white">{deal.item}</p>
                                  <p className="text-xs text-slate-500">{deal.reason}</p>
                              </div>
                              <div className="text-right">
                                  <span className="block text-green-400 font-bold font-mono">{formatCurrency(deal.price)}</span>
                                  <span className="text-[10px] text-slate-600 uppercase">Save ~R30</span>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      )}
    </div>
  );
};