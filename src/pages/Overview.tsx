import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/shared/StatCard';
import { TrendingUp, Activity, ShieldAlert, Zap } from 'lucide-react';
import { useSSE } from '../hooks/useSSE';
import { useDashboardStore } from '../store/useDashboardStore';

export const Overview: React.FC = () => {
  useSSE();
  const events = useDashboardStore((state) => state.events);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">System Overview</h1>
          <p className="text-slate-400">Real-time trading performance across all active bots.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total PnL" value="$1,240.50" icon={TrendingUp} trend={12.5} color="text-green-500" />
          <StatCard title="Win Rate" value="68.2%" icon={Zap} trend={2.1} color="text-yellow-500" />
          <StatCard title="Active Bots" value="4" icon={Activity} color="text-blue-500" />
          <StatCard title="Max Drawdown" value="4.2%" icon={ShieldAlert} trend={-0.5} color="text-red-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6">Performance Overview</h2>
            <div className="h-64 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
              Equity Chart Integration (Recharts) Coming Soon
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-[calc(100%-1rem)]">
            <h2 className="text-xl font-bold mb-6">Live Events</h2>
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-2">
              {events.length === 0 && <div className="text-slate-600 text-center py-10">Waiting for trade events...</div>}
              {events.map((event, i) => (
                <div key={i} className="p-3 bg-slate-800 rounded-lg border-l-4 border-blue-500 animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>{event.engine || 'SYSTEM'}</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="text-sm text-white font-medium">{event.message || 'Trade Event Detected'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
