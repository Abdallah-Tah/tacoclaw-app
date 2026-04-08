import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Navbar } from '../components/layout/Navbar';
import { useDashboardStore } from '../store/useDashboardStore';
import { Bell, TrendingUp, TrendingDown, Calendar, Filter, Trash2, CheckCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type TypeFilter = 'all' | 'win' | 'loss';
type ReadFilter = 'all' | 'unread' | 'read';

export const NotificationHistory: React.FC = () => {
  useDocumentTitle('Notifications');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as TypeFilter) || 'all';
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(initialType);
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const notifications = useDashboardStore((s) => s.notifications);
  const unreadCount = useDashboardStore((s) => s.unreadCount);
  const historyLoaded = useDashboardStore((s) => s.historyLoaded);
  const loadHistoryNotifications = useDashboardStore((s) => s.loadHistoryNotifications);
  const markAllRead = useDashboardStore((s) => s.markAllRead);
  const markRead = useDashboardStore((s) => s.markRead);
  const dismissNotification = useDashboardStore((s) => s.dismissNotification);
  const clearAllNotifications = useDashboardStore((s) => s.clearAllNotifications);

  // Bootstrap historical notifications from equity data on mount
  useEffect(() => {
    if (!historyLoaded) loadHistoryNotifications();
  }, [historyLoaded, loadHistoryNotifications]);

  const filtered = useMemo(() => {
    let result = [...notifications];

    if (typeFilter !== 'all') {
      result = result.filter((n) => n.type === typeFilter);
    }

    if (readFilter === 'unread') result = result.filter((n) => !n.read);
    if (readFilter === 'read') result = result.filter((n) => n.read);

    // Date filtering: use local midnight boundaries
    // dateFrom = start of that day (00:00:00.000)
    // dateTo = end of that day (23:59:59.999)
    if (dateFrom) {
      const [y, m, d] = dateFrom.split('-').map(Number);
      const from = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
      result = result.filter((n) => n.timestamp >= from);
    }
    if (dateTo) {
      const [y, m, d] = dateTo.split('-').map(Number);
      const to = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
      result = result.filter((n) => n.timestamp <= to);
    }

    return result;
  }, [notifications, typeFilter, readFilter, dateFrom, dateTo]);

  const wins = filtered.filter((n) => n.type === 'win').length;
  const losses = filtered.filter((n) => n.type === 'loss').length;
  const totalPnl = filtered.reduce((sum, n) => sum + (n.pnl || 0), 0);

  const handleTypeFilter = (type: TypeFilter) => {
    setTypeFilter(type);
    setSearchParams(type === 'all' ? {} : { type });
  };

  return (
    <div className="min-h-screen text-orange-50/90 font-sans relative pb-10">
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDE0MCwwLDAuMDUpIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]" />
      <Navbar />

      <main className="relative p-4 sm:p-8 max-w-[1200px] mx-auto z-10">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-orange-200/50 hover:text-orange-200 text-sm font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-orange-400" />
                Notification History
              </h1>
              <p className="text-orange-200/60 text-base mt-1">
                Complete log of all trade events with filters and details.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllRead}
                className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-colors flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-2xl p-4 border border-orange-900/40 bg-black/30">
            <div className="text-[10px] font-bold text-orange-200/40 uppercase tracking-widest mb-1">Total</div>
            <div className="text-2xl font-bold text-white">{notifications.length}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-1">Wins</div>
            <div className="text-2xl font-bold text-emerald-400">{wins}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-rose-500/20 bg-rose-500/5">
            <div className="text-[10px] font-bold text-rose-400/60 uppercase tracking-widest mb-1">Losses</div>
            <div className="text-2xl font-bold text-rose-400">{losses}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-orange-900/40 bg-black/30">
            <div className="text-[10px] font-bold text-orange-200/40 uppercase tracking-widest mb-1">Unread</div>
            <div className="text-2xl font-bold text-orange-400">{unreadCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 sm:p-5 border border-orange-900/40 bg-black/30 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Filter className="w-4 h-4 text-orange-400" /> Filters
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Type filter */}
            {([
              { key: 'all' as TypeFilter, label: 'All', count: notifications.length },
              { key: 'win' as TypeFilter, label: 'Wins', count: notifications.filter((n) => n.type === 'win').length },
              { key: 'loss' as TypeFilter, label: 'Losses', count: notifications.filter((n) => n.type === 'loss').length },
            ]).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => handleTypeFilter(key)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  typeFilter === key
                    ? 'bg-orange-500/20 text-orange-200 border border-orange-500/30 shadow-[0_0_10px_rgba(255,140,0,0.2)]'
                    : 'text-orange-200/40 hover:text-orange-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                {label} <span className="text-orange-200/25">({count})</span>
              </button>
            ))}

            <div className="w-px bg-orange-900/30 mx-1" />

            {/* Read filter */}
            {([
              { key: 'all' as ReadFilter, label: 'All' },
              { key: 'unread' as ReadFilter, label: 'Unread' },
              { key: 'read' as ReadFilter, label: 'Read' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setReadFilter(key)}
                className={`text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  readFilter === key
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-orange-200/40 hover:text-orange-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs bg-orange-950/30 border border-orange-900/30 rounded-lg px-3 py-2 text-orange-200 focus:outline-none focus:border-orange-500/40"
            />
            <span className="text-orange-200/30 text-xs">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-xs bg-orange-950/30 border border-orange-900/30 rounded-lg px-3 py-2 text-orange-200 focus:outline-none focus:border-orange-500/40"
            />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="text-[10px] text-orange-400 hover:text-orange-300 ml-1">
                Clear
              </button>
            )}
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-orange-900/20">
            <span className="text-emerald-400">{wins} wins</span>
            <span className="text-rose-400">{losses} losses</span>
            <span className="text-orange-200/30">{filtered.length} shown</span>
            <span className={`ml-auto font-mono text-sm ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              PnL: {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notification List */}
        {!historyLoaded ? (
          <div className="glass rounded-2xl p-12 border border-orange-900/40 bg-black/30 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-sm text-orange-200/50">Loading notification history...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-orange-900/40 bg-black/30 flex flex-col items-center justify-center gap-4 text-orange-200/25">
            <Bell className="w-12 h-12" />
            <div className="text-center">
              <p className="text-lg font-bold text-orange-200/40 mb-1">No notifications found</p>
              <p className="text-sm">Try adjusting your filters or wait for new trade events.</p>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-orange-900/40 bg-black/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-orange-950/30 text-orange-200/40">
                  <tr className="uppercase text-[10px] tracking-widest">
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Engine</th>
                    <th className="p-4 font-medium">Message</th>
                    <th className="p-4 font-medium">PnL</th>
                    <th className="p-4 font-medium">Time</th>
                    <th className="p-4 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-900/15">
                  {filtered.map((notif) => {
                    const isExpanded = expandedId === notif.id;
                    return (
                      <React.Fragment key={notif.id}>
                        <tr
                          className={`hover:bg-orange-950/20 transition-colors cursor-pointer ${!notif.read ? 'bg-orange-500/[0.02]' : ''}`}
                          onClick={() => { setExpandedId(isExpanded ? null : notif.id); markRead(notif.id); }}
                        >
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              notif.type === 'win'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {notif.type === 'win' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {notif.type}
                            </span>
                            {!notif.read && <span className="ml-2 w-2 h-2 rounded-full bg-orange-500 inline-block" />}
                          </td>
                          <td className="p-4 text-orange-200/60 font-mono text-xs">{notif.engine}</td>
                          <td className="p-4 text-orange-200/70 max-w-[200px] truncate">{notif.message}</td>
                          <td className={`p-4 font-bold font-mono ${notif.pnl !== undefined ? (notif.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-orange-200/30'}`}>
                            {notif.pnl !== undefined ? `${notif.pnl >= 0 ? '+' : ''}$${notif.pnl.toFixed(2)}` : '—'}
                          </td>
                          <td className="p-4 text-orange-200/30 font-mono text-xs">
                            {new Date(notif.timestamp).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                              className="p-1.5 rounded-lg text-orange-200/20 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-orange-950/10">
                            <td colSpan={6} className="p-4 pl-[68px]">
                              <div className="bg-orange-950/20 rounded-xl p-4 border border-orange-900/20 max-w-lg">
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <span className="text-orange-200/30 uppercase tracking-widest text-[9px] font-bold">Engine</span>
                                    <p className="text-orange-200 font-medium mt-0.5">{notif.engine}</p>
                                  </div>
                                  <div>
                                    <span className="text-orange-200/30 uppercase tracking-widest text-[9px] font-bold">Type</span>
                                    <p className={`font-bold mt-0.5 ${notif.type === 'win' ? 'text-emerald-400' : 'text-rose-400'}`}>{notif.type.toUpperCase()}</p>
                                  </div>
                                  <div>
                                    <span className="text-orange-200/30 uppercase tracking-widest text-[9px] font-bold">Time</span>
                                    <p className="text-orange-200 font-mono mt-0.5">{new Date(notif.timestamp).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <span className="text-orange-200/30 uppercase tracking-widest text-[9px] font-bold">PnL</span>
                                    <p className={`font-bold font-mono mt-0.5 ${notif.pnl !== undefined ? (notif.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-orange-200/40'}`}>
                                      {notif.pnl !== undefined ? `${notif.pnl >= 0 ? '+' : ''}$${notif.pnl.toFixed(2)}` : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <span className="text-orange-200/30 uppercase tracking-widest text-[9px] font-bold">Full Message</span>
                                  <p className="text-sm text-orange-200/70 mt-0.5">{notif.message}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};