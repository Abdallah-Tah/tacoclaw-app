import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/shared/StatCard';
import { EquityChart } from '../components/charts/EquityChart';
import { TrendingUp, Activity, ShieldAlert, Zap, Terminal, Loader2 } from 'lucide-react';
import { useSSE } from '../hooks/useSSE';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { WinLossFlash } from '../components/shared/WinLossFlash';
import { useDashboardStore } from '../store/useDashboardStore';
import { useEquityHistory } from '../hooks/useEquityHistory';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const Overview: React.FC = () => {
  useSSE();
  useDocumentTitle('Dashboard');
  const [timeframe, setTimeframe] = React.useState('1D');
  const events = useDashboardStore((state) => state.events);
  const { data: history, isLoading: historyLoading } = useEquityHistory(timeframe);

  const visibleEvents = React.useMemo(() => events.slice(0, 10), [events]);

  const { data: report } = useQuery({
    queryKey: ['report'],
    queryFn: async () => {
      const { data } = await apiClient.get('/report');
      return data;
    },
    refetchInterval: 30000,
  });

  return (
    <div className="min-h-screen text-orange-50/90 font-sans relative pb-10">
      <WinLossFlash />
      {/* Subtle background grid pattern */}
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDE0MCwwLDAuMDUpIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]" />

      <Navbar />

      <main className="relative p-4 sm:p-8 max-w-[1600px] mx-auto z-10">
        <header className="mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">System Overview</h1>
          <p className="text-orange-200/60 text-base sm:text-lg">Real-time algorithmic trading performance and active bot metrics since April 1st.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <StatCard
            title="Total PnL"
            value={report ? `$${(report.all_time_pnl || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '$0.00'}
            icon={TrendingUp}
            trend={report ? Math.round((report.today_pnl / (report.current_capital - report.today_pnl)) * 1000) / 10 : 0}
            color="text-emerald-400"
          />
          <StatCard
            title="Win Rate"
            value={report ? `${(report.seven_day_win_rate * 100).toFixed(1)}%` : '0%'}
            icon={Zap}
            color="text-orange-400"
          />
          <StatCard
            title="Active Bots"
            value="4"
            icon={Activity}
            color="text-yellow-400"
          />
          <StatCard
            title="Streak"
            value={report ? report.streak : 0}
            icon={ShieldAlert}
            color="text-rose-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_420px] gap-6 items-start animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          {/* Equity Chart Section */}
          <div className="glass rounded-2xl p-5 sm:p-6 h-[480px] flex flex-col relative overflow-hidden group border border-orange-900/40 bg-black/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                Equity Performance
              </h2>
              <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                {['1H', '1D', '1W', '1M', 'ALL'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`flex-1 sm:flex-none text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                      timeframe === tf
                        ? 'bg-orange-500/20 text-orange-200 border border-orange-500/30 shadow-[0_0_10px_rgba(255,140,0,0.2)]'
                        : 'text-orange-200/40 hover:text-orange-100 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 relative flex items-center justify-center rounded-xl bg-black/20 overflow-hidden">
              {historyLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  <span className="text-sm font-medium text-orange-200/50">Loading market data...</span>
                </div>
              ) : history && history.length > 0 ? (
                <div className="absolute inset-0 p-2">
                  <EquityChart data={history} color="#FF8C00" />
                </div>
              ) : (
                <div className="text-orange-200/50 text-sm">No historical trade data available</div>
              )}
            </div>
          </div>

          {/* Live Events Section */}
          <div className="glass rounded-2xl p-5 sm:p-6 h-[480px] flex flex-col relative overflow-hidden border border-orange-900/40 bg-black/30">
             <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white">Live Event Stream</h2>
             </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scroll-smooth">
              {visibleEvents.length === 0 && (
                <div className="text-orange-200/30 text-xs font-mono text-center py-10 flex flex-col items-center justify-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                  Waiting for trade signals...
                </div>
              )}

              {visibleEvents.map((event, i) => (
                <div key={i} className="animate-in slide-in-from-left-4 fade-in duration-300">
                  <div className={`p-3 rounded-xl border transition-colors ${
                    i === 0
                      ? 'bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(255,140,0,0.05)]'
                      : 'bg-orange-950/10 border-white/5'
                  }`}>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase mb-1">
                      <span className={`${i === 0 ? 'text-orange-400' : 'text-orange-200/30'}`}>
                        {event.engine || 'SYSTEM_CORE'}
                      </span>
                      <span className="text-orange-200/20 font-mono">
                        {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                      </span>
                    </div>
                    <div className={`text-xs leading-relaxed ${i === 0 ? 'text-orange-50' : 'text-orange-200/60'}`}>
                      {event.message || 'Signal processed successfully'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};