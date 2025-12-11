import React from 'react';
import { User, Bell, Shield, Eye, EyeOff } from 'lucide-react';

interface SettingsViewProps {
  zenMode: boolean;
  toggleZenMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ zenMode, toggleZenMode }) => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
       <h2 className="text-2xl font-serif font-bold text-[#E3D5CA] mb-8">System Configuration</h2>

       {/* Profile */}
       <div className="bg-[#1A1C19] border border-[#2C2E2B] rounded-xl p-6 flex items-center gap-4">
           <div className="w-16 h-16 bg-[#2C2E2B] rounded-full flex items-center justify-center text-[#D4A373]">
               <User className="w-8 h-8" />
           </div>
           <div>
               <h3 className="font-bold text-[#E3D5CA]">Brett Cook</h3>
               <p className="text-sm text-[#E3D5CA]/60 font-mono">ID: 9402055043086</p>
               <span className="inline-block mt-2 text-[10px] bg-[#D4A373]/10 text-[#D4A373] px-2 py-0.5 rounded border border-[#D4A373]/20 uppercase">Mid-Level Mgmt</span>
           </div>
       </div>

       {/* Zen Mode Toggle */}
       <div className="bg-[#1A1C19] border border-[#2C2E2B] rounded-xl p-6 flex justify-between items-center hover:border-[#D4A373]/50 transition-colors cursor-pointer" onClick={toggleZenMode}>
           <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${zenMode ? 'bg-[#D4A373] text-[#1A1C19]' : 'bg-[#2C2E2B] text-[#E3D5CA]'}`}>
                   {zenMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </div>
               <div>
                   <h3 className="font-bold text-[#E3D5CA]">Zen Mode</h3>
                   <p className="text-xs text-[#E3D5CA]/60">Hide all non-essential metrics. Focus on Net Worth.</p>
               </div>
           </div>
           <div className={`w-12 h-6 rounded-full p-1 transition-colors ${zenMode ? 'bg-[#D4A373]' : 'bg-[#2C2E2B]'}`}>
               <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${zenMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
           </div>
       </div>

       {/* Other Settings placeholders */}
       <div className="grid grid-cols-2 gap-4">
           <div className="bg-[#1A1C19] border border-[#2C2E2B] rounded-xl p-6 opacity-50 cursor-not-allowed">
               <Bell className="w-6 h-6 text-[#E3D5CA] mb-3" />
               <h3 className="font-bold text-[#E3D5CA] text-sm">Notifications</h3>
               <p className="text-xs text-[#E3D5CA]/60 mt-1">Alerts for spending caps.</p>
           </div>
           <div className="bg-[#1A1C19] border border-[#2C2E2B] rounded-xl p-6 opacity-50 cursor-not-allowed">
               <Shield className="w-6 h-6 text-[#E3D5CA] mb-3" />
               <h3 className="font-bold text-[#E3D5CA] text-sm">Security</h3>
               <p className="text-xs text-[#E3D5CA]/60 mt-1">Biometrics & 2FA.</p>
           </div>
       </div>
    </div>
  );
};