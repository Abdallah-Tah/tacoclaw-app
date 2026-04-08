import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/shared/StatCard';
import { EquityChart } from '../components/charts/EquityChart';
import { WinLossChart } from '../components/charts/WinLossChart';
import { DrawdownChart } from '../components/charts/DrawdownChart';
import { TradeFrequencyChart } from '../components/charts/TradeFrequencyChart';
import { TrendingUp, Activity, ShieldAlert, Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { useBotStats } from '../hooks/useBotStats';
import { calculateEquityCurve, calculateWinLossDist, calculateDrawdown, calculateTradeFrequency } from '../utils/chart-helpers';

type ChartTab = 'equity' | 'drawdown' | 'frequency';

export const BotDetail: React.FC = () => {
  const { botId } = useParams();
  useDocumentTitle(`Bot: ${botId}`);
  const { data, isLoading, error } = useBotStats(botId || 'btc15m');
  const [activeChart, setActiveChart] = useState<ChartTab>('equity');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-taco-bg text-orange-50/90 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <span className="text-lg font-medium text-orange-200/60">Loading bot analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-taco-bg text-orange-50/90 flex items-center justify-center">
        <div className="text-rose-400 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-md text-center">
          <ShieldAlert className="w-10 h-10 mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">Connection Error</h2>
          <p className="text-sm text-rose-300/70">Unable to load bot data. Please ensure the trading engine is running.</p>
        </div>
      </div>
    );
  }

  const equityData = calculateEquityCurve(data.trades);
  const winLossData = calculateWinLossDist(data.trades);
  const drawdownData = calculateDrawdown(data.trades);
  const frequencyData = calculateTradeFrequency(data.trades);

  return (
    <div className="min-h-screen text-orange-50/90 font-sans relative pb-10">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDE0MCwwLDAuMDUpIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]" />

      <Navbar />

      <main className="relative p-4 sm:p-8 max-w-[1600px] mx-auto z-10">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-orange-200/50 hover:text-orange-200 text-sm font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">{botId}</span>
              </h1>
              <p className="text-orange-200/60 text-base mt-1">Real-time performance analysis from journal.db</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ACTIVE
            </div>
          </div>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <StatCard title="Net Profit" value={`$${data.totalPnL.toFixed(2)}`} icon={TrendingUp} color="text-emerald-400" />
          <StatCard title="Win Rate" value={`${data.winRate.toFixed(1)}%`} icon={Zap} color="text-orange-400" />
          <StatCard title="Total Trades" value={data.totalTrades} icon={Activity} color="text-yellow-400" />
          <StatCard title="Max Drawdown" value="2.8%" icon={ShieldAlert} color="text-rose-400" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 sm:mb-10">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 sm:p-6 h-[480px] flex flex-col relative overflow-hidden border border-orange-900/40 bg-black/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                {activeChart === 'equity' && 'Equity Curve'}
                {activeChart === 'drawdown' && 'Drawdown Analysis'}
                {activeChart === 'frequency' && 'Trade Frequency'}
              </h2>
              <div className="flex gap-1.5">
                {([
                  { key: 'equity', label: 'Equity' },
                  { key: 'drawdown', label: 'Drawdown' },
                  { key: 'frequency', label: 'Frequency' },
                ] as { key: ChartTab; label: string }[]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveChart(key)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                      activeChart === key
                        ? 'bg-orange-500/20 text-orange-200 border border-orange-500/30 shadow-[0_0_10px_rgba(255,140,0,0.2)]'
                        : 'text-orange-200/40 hover:text-orange-100 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 relative rounded-xl bg-black/20 overflow-hidden">
              <div className="absolute inset-0 p-2">
                {activeChart === 'equity' && <EquityChart data={equityData} color="#FF8C00" />}
                {activeChart === 'drawdown' && <DrawdownChart data={drawdownData} />}
                {activeChart === 'frequency' && <TradeFrequencyChart data={frequencyData} />}
              </div>
            </div>
          </div>

          {/* Win/Loss Donut */}
          <div className="glass rounded-2xl p-5 sm:p-6 h-[480px] flex flex-col relative overflow-hidden border border-orange-900/40 bg-black/30">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-orange-400" />
              Win / Loss Distribution
            </h2>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <WinLossChart data={winLossData} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-orange-900/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{winLossData[0]?.value || 0}</div>
                <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-400">{winLossData[1]?.value || 0}</div>
                <div className="text-[10px] font-bold text-rose-400/60 uppercase tracking-widest">Losses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Ledger */}
        <div className="glass rounded-2xl overflow-hidden border border-orange-900/40 bg-black/30">
          <div className="p-5 sm:p-6 border-b border-orange-900/30">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" />
              Live Trade Ledger
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-orange-950/30 text-orange-200/40">
                <tr className="uppercase text-[10px] tracking-widest">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Engine</th>
                  <th className="p-4 font-medium">PnL</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-900/20">
                {data.trades.slice().reverse().map((trade, i) => (
                  <tr key={i} className="hover:bg-orange-950/20 transition-colors">
                    <td className="p-4 text-orange-200/70 font-mono text-xs">{trade.timestamp}</td>
                    <td className="p-4 text-orange-200/50">{trade.engine}</td>
                    <td className={`p-4 font-bold font-mono ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        trade.status === 'win'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};