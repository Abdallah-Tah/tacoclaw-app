import React, { useEffect } from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

const NOTIFICATION_DURATION = 5000;

export const NotificationContainer: React.FC = () => {
  const notifications = useDashboardStore((state) => state.notifications);
  const dismissNotification = useDashboardStore((state) => state.dismissNotification);

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-dismiss notifications after duration
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      const oldest = notifications[notifications.length - 1];
      if (oldest) dismissNotification(oldest.id);
    }, NOTIFICATION_DURATION);
    return () => clearTimeout(timer);
  }, [notifications, dismissNotification]);

  // Play sound and send browser notification on new trade events
  useEffect(() => {
    const latest = notifications[0];
    if (!latest) return;

    // Browser push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`${latest.type === 'win' ? '🟢' : '🔴'} ${latest.title}`, {
          body: `[${latest.engine}] ${latest.message}`,
          tag: latest.id,
          silent: true,
        });
      } catch {
        // Notification may fail in some browsers
      }
    }

    // Audio beep
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = latest.type === 'win' ? 880 : 330;
      osc.type = 'sine';
      gain.gain.value = 0.08;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (latest.type === 'win' ? 0.3 : 0.5));
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio may not be available
    }
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[90] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.slice(0, 5).map((notif) => (
        <div
          key={notif.id}
          className={`pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-500 rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
            notif.type === 'win'
              ? 'bg-emerald-950/80 border-emerald-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]'
              : 'bg-rose-950/80 border-rose-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            <div className={`shrink-0 p-2 rounded-xl ${
              notif.type === 'win' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
            }`}>
              {notif.type === 'win'
                ? <TrendingUp className="w-5 h-5 text-emerald-400" />
                : <TrendingDown className="w-5 h-5 text-rose-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-sm font-bold ${notif.type === 'win' ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {notif.title}
                </span>
                <span className="text-[10px] text-white/30 font-mono">
                  {new Date(notif.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className="text-xs text-white/60 truncate">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mr-1.5 ${
                  notif.type === 'win' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {notif.engine}
                </span>
                {notif.message}
              </div>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Auto-dismiss progress bar */}
          <div className={`h-0.5 ${notif.type === 'win' ? 'bg-emerald-400' : 'bg-rose-400'}`}
            style={{ animation: `shrink ${NOTIFICATION_DURATION}ms linear forwards` }}
          />
        </div>
      ))}
    </div>
  );
};