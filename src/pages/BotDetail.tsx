import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/shared/StatCard';
import { EquityChart } from '../components/charts/EquityChart';
import { TrendingUp, Activity, ShieldAlert, Zap } from 'lucide-react';

export const BotDetail: React.FC = () => {
  const { botId } = useParams();

  // Mock data for now - will be replaced by API calls in the next phase
  const mockEquityData = [
    { time: 'Jan', value: 1000 },
    { time: 'Feb', value: 1200 },
    { time: 'Mar', value: 1100 },
    { time: 'Apr', value: 1500 },
    { time: 'May', value: 1400 },
    { time: 'Jun', value: 1800 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Bot: {botId}</h1>
            <p className="text-slate-400">Detailed performance analysis and trade history.</p>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-400">
            Status: <span className="text-green-400">Active</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Net Profit" value="$420.50" icon={TrendingUp} trend={12.5} color="text-green-500" />
          <StatCard title="Win Rate" value="62.1%" icon={Zap} trend={2.1} color="text-yellow-500" />
          <StatCard title="Total Trades" value="124" icon={Activity} color="text-blue-500" />
          <StatCard title="Max Drawdown" value="2.8%" icon={ShieldAlert} trend={-0.5} color="text-red-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6">Equity Curve</h2>
            <EquityChart data={mockEquityData} />
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6">Bot Metadata</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Strategy</span>
                <span className="font-medium">Scalper-V2</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Timeframe</span>
                <span className="font-medium">15m</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Asset</span>
                <span className="font-medium">BTC/USD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold">Trade History</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">PnL</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[1,2,3,4,5].map(i => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">2026-04-0{i} 12:00</td>
                  <td className="p-4 text-slate-300">Long</td>
                  <td className="p-4 text-green-400">+$42.00</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">WIN</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
