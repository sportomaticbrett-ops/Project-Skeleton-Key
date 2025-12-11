import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { INSIGHTS, CATEGORY_DATA, MONTHLY_SPEND_TREND } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface FinancialChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialChat: React.FC<FinancialChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Systems online. I am your Strategic Sentinel. Spending patterns analyzed. What is your command?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const initChat = () => {
    if (!chatSession.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contextData = JSON.stringify({
        insights: INSIGHTS,
        categories: CATEGORY_DATA,
        monthly_trend: MONTHLY_SPEND_TREND
      });

      chatSession.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are 'Skeleton Key', a Stoic Financial Strategist. 
          You have access to the user's financial summary: ${contextData}. 
          Tone: High-performance, concise, military-grade precision. Avoid fluff.
          Philosophy: "The 4-Hour Work Week" meets "The Art of War".
          Goal: Ruthless efficiency in wealth accumulation.`,
        },
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      initChat();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatSession.current.sendMessage({ message: userMsg });
      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } catch (error) {
      console.error("Chat failed", error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection unstable. Retrying protocol..." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#0f1214] rounded-2xl border border-slate-700 shadow-2xl flex flex-col z-50 animate-fade-in overflow-hidden">
      <div className="bg-[#1a1e23] p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Geometric Cat Icon */}
          <div className="w-8 h-8 text-blue-500 bg-blue-900/20 rounded-lg flex items-center justify-center p-1">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
               <path d="M12 2c.6 0 1.2.2 1.7.5l3 1.8c.8.5 1.3 1.3 1.3 2.2v.5l3 1.8c.8.5 1.3 1.3 1.3 2.2v6c0 1.7-1.3 3-3 3H5c-1.7 0-3-1.3-3-3v-6c0-.9.5-1.7 1.3-2.2l3-1.8v-.5c0-.9.5-1.7 1.3-2.2l3-1.8c.5-.3 1.1-.5 1.7-.5z"/>
               <path d="M9 13l3 3 3-3"/>
               <path d="M9 10h.01"/>
               <path d="M15 10h.01"/>
             </svg>
          </div>
          <div>
              <h3 className="text-white font-bold text-sm tracking-wide">SENTINEL AI</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-slate-400 uppercase">Online</span>
              </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#1a1e23] text-slate-300 border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1e23] text-slate-500 rounded-lg px-4 py-2 text-xs italic border border-slate-800">
              Calculating strategic probabilities...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#0f1214] border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for intelligence..."
            className="flex-1 bg-[#1a1e23] border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-3 py-2 font-bold transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};