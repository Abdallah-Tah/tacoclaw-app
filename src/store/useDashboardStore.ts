import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'win' | 'loss' | 'info';
  title: string;
  message: string;
  engine: string;
  timestamp: number;
  pnl?: number;
  read: boolean;
  source: 'sse' | 'history';
}

interface DashboardState {
  events: any[];
  flashEvent: 'win' | 'loss' | null;
  notifications: Notification[];
  unreadCount: number;
  historyLoaded: boolean;
  addEvent: (event: any) => void;
  clearEvents: () => void;
  loadHistoryNotifications: () => Promise<void>;
  dismissNotification: (id: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const STORAGE_KEY = 'taco-notifications';

const loadPersisted = (): Notification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const persist = (notifications: Notification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 500)));
  } catch { /* quota exceeded */ }
};

const dedupe = (existing: Notification[], incoming: Notification[]): Notification[] => {
  const existingIds = new Set(existing.map((n) => n.id));
  return incoming.filter((n) => !existingIds.has(n.id));
};

export const useDashboardStore = create<DashboardState>((set) => ({
  events: [],
  flashEvent: null,
  notifications: loadPersisted(),
  unreadCount: loadPersisted().filter((n) => !n.read).length,
  historyLoaded: false,

  loadHistoryNotifications: async () => {
    try {
      const resp = await fetch('/api/equity/history?timeframe=ALL');
      const data: { time: string; value: number }[] = await resp.json();
      if (!data || data.length === 0) return;

      const currentYear = new Date().getFullYear();
      const historyNotifs: Notification[] = [];

      for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1].value;
        const curr = data[i].value;
        const pnl = curr - prev;
        const isWin = pnl >= 0;
        const timeStr = data[i].time;

        // Parse "04/08 13:05" format
        let timestamp: number;
        if (timeStr.includes('/')) {
          const [datePart, timePart] = timeStr.split(' ');
          const [month, day] = datePart.split('/').map(Number);
          const [hour, minute] = (timePart || '00:00').split(':').map(Number);
          timestamp = new Date(currentYear, month - 1, day, hour || 0, minute || 0).getTime();
        } else {
          // Format like "Apr 1"
          const d = new Date(`${timeStr} ${currentYear}`);
          timestamp = isNaN(d.getTime()) ? Date.now() : d.getTime();
        }

        historyNotifs.push({
          id: `hist-${i}-${timeStr.replace(/[^a-zA-Z0-9]/g, '')}`,
          type: isWin ? 'win' : 'loss',
          title: isWin ? 'Trade Won' : 'Trade Lost',
          message: isWin
            ? `Profit of $${pnl.toFixed(2)} recorded`
            : `Loss of $${Math.abs(pnl).toFixed(2)} recorded`,
          engine: 'System',
          timestamp,
          pnl: Number(pnl.toFixed(2)),
          read: true, // Historical items start as read
          source: 'history',
        });
      }

      set((state) => {
        const newNotifs = dedupe(state.notifications, historyNotifs);
        if (newNotifs.length === 0) return { historyLoaded: true };

        const merged = [...newNotifs, ...state.notifications].sort(
          (a, b) => b.timestamp - a.timestamp
        );
        persist(merged);
        return {
          notifications: merged,
          unreadCount: merged.filter((n) => !n.read).length,
          historyLoaded: true,
        };
      });
    } catch (e) {
      console.error('Failed to load history notifications:', e);
      set({ historyLoaded: true });
    }
  },

  addEvent: (event) => set((state) => {
    const msg = (event.message || '').toLowerCase();
    const type = (event.type || '').toLowerCase();

    // Only trigger on actual win/loss — skip "skipped", "passed", "no signal", etc.
    const isWin = (type === 'win' || msg.includes('win')) && !msg.includes('skip');
    const isLoss = (type === 'loss' || msg.includes('loss')) && !msg.includes('skip');
    const isSkipped = msg.includes('skip') || msg.includes('skipped') || msg.includes('passed') || msg.includes('no signal');

    const notification: Notification | null = (isWin || isLoss) && !isSkipped ? {
      id: `sse-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: isWin ? 'win' : 'loss',
      title: isWin ? 'Trade Won' : 'Trade Lost',
      message: event.message || (isWin ? 'Profit recorded' : 'Loss recorded'),
      engine: event.engine || 'Unknown',
      timestamp: Date.now(),
      pnl: event.pnl,
      read: false,
      source: 'sse',
    } : null;

    const newNotifications = notification
      ? [notification, ...state.notifications].slice(0, 500)
      : state.notifications;

    if (notification) persist(newNotifications);

    return {
      events: [event, ...state.events].slice(0, 100),
      flashEvent: isWin ? 'win' : isLoss ? 'loss' : state.flashEvent,
      notifications: newNotifications,
      unreadCount: newNotifications.filter((n) => !n.read).length,
    };
  }),

  clearEvents: () => set({ events: [], flashEvent: null }),

  dismissNotification: (id) => set((state) => {
    const updated = state.notifications.filter((n) => n.id !== id);
    persist(updated);
    return {
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    };
  }),

  markAllRead: () => set((state) => {
    const updated = state.notifications.map((n) => ({ ...n, read: true }));
    persist(updated);
    return { notifications: updated, unreadCount: 0 };
  }),

  markRead: (id) => set((state) => {
    const updated = state.notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    persist(updated);
    return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
  }),

  clearAllNotifications: () => {
    persist([]);
    set({ notifications: [], unreadCount: 0 });
  },
}));