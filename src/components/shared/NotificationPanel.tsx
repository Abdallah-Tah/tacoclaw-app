import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { X, Bell, TrendingUp, TrendingDown, Calendar, Filter, ChevronDown, ChevronUp, Trash2, CheckCheck } from 'lucide-react';

type TypeFilter = 'all' | 'win' | 'loss';

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const notifications = useDashboardStore((s) => s.notifications);
  const unreadCount = useDashboardStore((s) => s.unreadCount);
  const markAllRead = useDashboardStore((s) => s.markAllRead);
  const markRead = useDashboardStore((s) => s.markRead);
  const dismissNotification = useDashboardStore((s) => s.dismissNotification);
  const clearAllNotifications = useDashboardStore((s) => s.clearAllNotifications);

  const filtered = useMemo(() => {
    let result = [...notifications];

    if (typeFilter !== 'all') {
      result = result.filter((n) => n.type === typeFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter((n) => n.timestamp >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86_400_000; // end of day
      result = result.filter((n) => n.timestamp <= to);
    }

    return result;
  }, [notifications, typeFilter, dateFrom, dateTo]);

  const wins = filtered.filter((n) => n.type === 'win').length;
  const losses = filtered.filter((n) => n.type === 'loss').length;

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen && unreadCount > 0) markAllRead(); }}
        className="relative p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all group"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-[85] transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col bg-taco-bg border-l border-taco-border shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-orange-900/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllNotifications}
                className="p-2 rounded-lg text-orange-200/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-orange-200/40 hover:text-orange-200 hover:bg-orange-500/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-orange-900/20 shrink-0 space-y-3">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-orange-400" />
              <div className="flex gap-1.5">
                {([
                  { key: 'all' as TypeFilter, label: 'All' },
                  { key: 'win' as TypeFilter, label: 'Wins' },
                  { key: 'loss' as TypeFilter, label: 'Losses' },
                ]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTypeFilter(key)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      typeFilter === key
                        ? 'bg-orange-500/20 text-orange-200 border border-orange-500/30'
                        : 'text-orange-200/40 hover:text-orange-100 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {label}
                    {key === 'win' && ` (${wins})`}
                    {key === 'loss' && ` (${losses})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1 text-xs bg-orange-950/30 border border-orange-900/30 rounded-lg px-2 py-1.5 text-orange-200 focus:outline-none focus:border-orange-500/40"
                placeholder="From"
              />
              <span className="text-orange-200/30 text-xs">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1 text-xs bg-orange-950/30 border border-orange-900/30 rounded-lg px-2 py-1.5 text-orange-200 focus:outline-none focus:border-orange-500/40"
                placeholder="To"
              />
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => { setDateFrom(''); setDateTo(''); }}
                  className="text-[10px] text-orange-400 hover:text-orange-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Summary Row */}
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-emerald-400">{wins} wins</span>
              <span className="text-rose-400">{losses} losses</span>
              <span className="text-orange-200/40">{filtered.length} total</span>
              <span className="text-orange-200/40 ml-auto">
                {filtered.length > 0
                  ? `PnL: ${filtered.reduce((sum, n) => sum + (n.pnl || 0), 0) >= 0 ? '+' : ''}$${filtered.reduce((sum, n) => sum + (n.pnl || 0), 0).toFixed(2)}`
                  : 'No data'
                }
              </span>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-orange-200/30">
                <Bell className="w-10 h-10" />
                <span className="text-sm">No notifications found</span>
              </div>
            ) : (
              <div className="divide-y divide-orange-900/15">
                {filtered.map((notif) => {
                  const isExpanded = expandedId === notif.id;
                  return (
                    <div
                      key={notif.id}
                      className={`transition-colors ${!notif.read ? 'bg-orange-500/5' : ''}`}
                    >
                      <button
                        onClick={() => { setExpandedId(isExpanded ? null : notif.id); markRead(notif.id); }}
                        className="w-full text-left p-4 hover:bg-orange-950/20 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`shrink-0 p-1.5 rounded-lg mt-0.5 ${
                            notif.type === 'win' ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                          }`}>
                            {notif.type === 'win'
                              ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                              : <TrendingDown className="w-4 h-4 text-rose-400" />
                            }
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                              )}
                              <span className={`text-sm font-bold ${notif.type === 'win' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-orange-200/25 font-mono ml-auto shrink-0">
                                {formatTimestamp(notif.timestamp)}
                              </span>
                            </div>
                            <div className="text-xs text-orange-200/50 truncate flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                notif.type === 'win' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                              }`}>
                                {notif.engine}
                              </span>
                              <span className="truncate">{notif.message}</span>
                            </div>
                          </div>

                          {/* Expand indicator */}
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4 text-orange-200/30 shrink-0 mt-1" />
                            : <ChevronDown className="w-4 h-4 text-orange-200/30 shrink-0 mt-1" />
                          }
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pl-[68px] animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="bg-orange-950/20 rounded-xl p-4 space-y-3 border border-orange-900/20">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-[10px] font-bold text-orange-200/30 uppercase tracking-widest mb-1">Engine</div>
                                <div className="text-sm text-orange-200 font-medium">{notif.engine}</div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-orange-200/30 uppercase tracking-widest mb-1">Type</div>
                                <div className={`text-sm font-bold ${notif.type === 'win' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {notif.type.toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-orange-200/30 uppercase tracking-widest mb-1">Time</div>
                                <div className="text-sm text-orange-200 font-mono">
                                  {new Date(notif.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-orange-200/30 uppercase tracking-widest mb-1">PnL</div>
                                <div className={`text-sm font-bold font-mono ${notif.pnl !== undefined ? (notif.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-orange-200/40'}`}>
                                  {notif.pnl !== undefined ? `${notif.pnl >= 0 ? '+' : ''}$${notif.pnl.toFixed(2)}` : 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-orange-200/30 uppercase tracking-widest mb-1">Message</div>
                              <div className="text-sm text-orange-200/70">{notif.message}</div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                                className="text-[10px] font-bold text-rose-400/60 hover:text-rose-400 flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-orange-900/30 shrink-0">
            <button
              onClick={markAllRead}
              className="w-full py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function formatTimestamp(ts: number): string {
  const now = Date.now();
  const diff = now - ts;

  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;

  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}