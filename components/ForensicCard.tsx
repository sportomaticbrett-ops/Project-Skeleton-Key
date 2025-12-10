import React from 'react';

interface ForensicCardProps {
  title: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  value: string;
  description: string;
  actionItem?: string;
}

export const ForensicCard: React.FC<ForensicCardProps> = ({ title, severity, value, description, actionItem }) => {
  const getColors = () => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-900/10 text-red-100';
      case 'warning': return 'border-orange-500 bg-orange-900/10 text-orange-100';
      case 'success': return 'border-green-500 bg-green-900/10 text-green-100';
      default: return 'border-blue-500 bg-blue-900/10 text-blue-100';
    }
  };

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${getColors()} mb-4`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="font-mono text-xl font-bold">{value}</span>
      </div>
      <p className="text-sm mt-2 opacity-90">{description}</p>
      {actionItem && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs font-bold uppercase tracking-wider">Required Action:</p>
          <p className="text-sm">{actionItem}</p>
        </div>
      )}
    </div>
  );
};