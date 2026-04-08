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
}

interface DashboardState {
  events: any[];
  flashEvent: 'win' | 'loss' | null;
  notifications: Notification[];
  unreadCount: number;
  addEvent: (event: any) => void;
  clearEvents: () => void;
  dismissNotification: (id: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const loadPersisted = (): Notification[] => {
  try {
    const raw = localStorage.getItem('taco-notifications');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const persist = (notifications: Notification[]) => {
  try {
    localStorage.setItem('taco-notifications', JSON.stringify(notifications.slice(0, 500)));
  } catch { /* quota exceeded */ }
};

export const useDashboardStore = create<DashboardState>((set) => ({
  events: [],
  flashEvent: null,
  notifications: loadPersisted(),
  unreadCount: loadPersisted().filter((n) => !n.read).length,

  addEvent: (event) => set((state) => {
    const msg = (event.message || '').toLowerCase();
    const type = (event.type || '').toLowerCase();

    // Only trigger on actual win/loss — skip "skipped", "passed", "no signal", etc.
    const isWin = (type === 'win' || msg.includes('win')) && !msg.includes('skip');
    const isLoss = (type === 'loss' || msg.includes('loss')) && !msg.includes('skip');
    const isSkipped = msg.includes('skip') || msg.includes('skipped') || msg.includes('passed') || msg.includes('no signal');

    const notification: Notification | null = (isWin || isLoss) && !isSkipped ? {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: isWin ? 'win' : 'loss',
      title: isWin ? 'Trade Won' : 'Trade Lost',
      message: event.message || (isWin ? 'Profit recorded' : 'Loss recorded'),
      engine: event.engine || 'Unknown',
      timestamp: Date.now(),
      pnl: event.pnl,
      read: false,
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