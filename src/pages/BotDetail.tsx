import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/shared/StatCard';
import { EquityChart } from '../components/charts/EquityChart';
import { WinLossChart } from '../components/charts/WinLossChart';
import { TrendingUp, Activity, ShieldAlert, Zap } from 'lucide-react';
import { useBotStats } from '../hooks/useBotStats';
import { calculateEquityCurve, calculateWinLossDist } from '../utils/chart-helpers';

export const BotDetail: React.FC = () => {
  const { botId } = useParams();
  const { data, isLoading, error } = useBotStats(botId || 'btc15m');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl font-medium animate-pulse">Loading bot analytics...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          Error loading bot data. Please ensure the engine is running.
        </div>
      </div>
    );
  }

  const equityData = calculateEquityCurve(data.trades);
  const winLossData = calculateWinLossDist(data.trades);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Bot: {botId}</h1>
            <p className="text-slate-400">Real-time performance analysis from journal.db</p>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-400">
            Status: <span className="text-green-400">Active</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Net Profit" value={`$${data.totalPnL.toFixed(2)}`} icon={TrendingUp} color="text-green-500" />
          <StatCard title="Win Rate" value={`${data.winRate.toFixed(1)}%`} icon={Zap} color="text-yellow-500" />
          <StatCard title="Total Trades" value={data.totalTrades} icon={Activity} color="text-blue-500" />
          <StatCard title="Max Drawdown" value="Calculated..." icon={ShieldAlert} color="text-red-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6">Equity Curve</h2>
            <EquityChart data={equityData} />
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6">Win/Loss Distribution</h2>
            <WinLossChart data={winLossData} />
          </div>
        </div>

        <div className="mt-8 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold">Live Trade Ledger</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr className="uppercase text-xs tracking-wider">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">PnL</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.trades.slice().reverse().map((trade, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">{trade.timestamp}</td>
                  <td className="p-4 text-slate-300">Trade</td>
                  <td className={`p-4 font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${trade.status === 'win' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
