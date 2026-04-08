import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Bell, TrendingUp, TrendingDown, ArrowRight, CheckCheck } from 'lucide-react';

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const notifications = useDashboardStore((s) => s.notifications);
  const unreadCount = useDashboardStore((s) => s.unreadCount);
  const markAllRead = useDashboardStore((s) => s.markAllRead);
  const markRead = useDashboardStore((s) => s.markRead);

  const recent = useMemo(() => notifications.slice(0, 8), [notifications]);
  const recentWins = recent.filter((n) => n.type === 'win').length;
  const recentLosses = recent.filter((n) => n.type === 'loss').length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleNotifClick = (notif: any) => {
    markRead(notif.id);
    setIsOpen(false);
    navigate(`/notifications?type=${notif.type}`);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all group"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[520px] glass rounded-2xl border border-orange-900/40 shadow-[0_0_40px_rgba(0,0,0,0.4)] z-[95] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-orange-900/30 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold">{unreadCount} new</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                  className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>
            {/* Quick stats */}
            <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{recentWins} wins</span>
              <span className="text-rose-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" />{recentLosses} losses</span>
              <span className="text-orange-200/30">{notifications.length} total</span>
            </div>
          </div>

          {/* Recent list */}
          <div className="flex-1 overflow-y-auto max-h-[320px]">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-orange-200/25">
                <Bell className="w-8 h-8" />
                <span className="text-xs">No notifications yet</span>
              </div>
            ) : (
              <div className="divide-y divide-orange-900/15">
                {recent.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={`w-full text-left px-4 py-3 hover:bg-orange-950/20 transition-colors flex items-start gap-3 group ${
                      !notif.read ? 'bg-orange-500/[0.03]' : ''
                    }`}
                  >
                    <div className={`shrink-0 p-1.5 rounded-lg mt-0.5 ${
                      notif.type === 'win' ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                    }`}>
                      {notif.type === 'win'
                        ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        : <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />}
                        <span className={`text-xs font-bold ${notif.type === 'win' ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-orange-200/20 font-mono ml-auto shrink-0">
                          {formatTime(notif.timestamp)}
                        </span>
                      </div>
                      <div className="text-[11px] text-orange-200/45 truncate flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          notif.type === 'win' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {notif.engine}
                        </span>
                        {notif.message}
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-orange-200/20 group-hover:text-orange-400 shrink-0 mt-2 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-orange-900/30 shrink-0">
            <button
              onClick={() => { setIsOpen(false); navigate('/notifications'); }}
              className="w-full py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-2"
            >
              View all notifications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}