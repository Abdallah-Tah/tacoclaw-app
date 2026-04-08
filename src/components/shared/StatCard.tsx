import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'text-orange-500' }) => {
  // Map standard colors to Taco-branded variations if needed, or extract base
  const baseColorMatch = color.match(/text-([a-z]+)-/);
  const baseColor = baseColorMatch ? baseColorMatch[1] : 'orange';
  
  return (
    <div className="relative group">
      {/* Animated glow effect behind the card */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br from-${baseColor}-500/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none`} />
      
      <div className="relative glass-card p-5 sm:p-6 h-full flex flex-col justify-between overflow-hidden">
        {/* Ambient top glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${baseColor}-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16`} />
        
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className={`p-3 rounded-xl bg-${baseColor}-500/10 border border-${baseColor}-500/20 relative`}>
            <Icon className={`w-5 h-5 ${color} relative z-10`} />
            <div className={`absolute inset-0 bg-${baseColor}-500/20 blur-md rounded-xl`} />
          </div>
          {trend !== undefined && (
            <div className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold border flex items-center gap-1 ${
              trend >= 0 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <span>{trend >= 0 ? '▲' : '▼'}</span>
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="relative z-10">
          <h3 className="text-orange-200/50 text-xs sm:text-sm font-medium mb-1 uppercase tracking-wider">{title}</h3>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</div>
        </div>
      </div>
    </div>
  );
};