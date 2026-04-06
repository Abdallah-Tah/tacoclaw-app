import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'text-blue-500' }) => (
  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-800 rounded-lg">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-slate-400 text-sm font-medium">{title}</div>
    <div className="text-2xl font-bold text-white mt-1">{value}</div>
  </div>
);
