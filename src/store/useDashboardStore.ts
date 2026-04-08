import { create } from 'zustand';

interface DashboardState {
  events: any[];
  flashEvent: 'win' | 'loss' | null;
  notifications: Notification[];
  addEvent: (event: any) => void;
  clearEvents: () => void;
  dismissNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  type: 'win' | 'loss' | 'info';
  title: string;
  message: string;
  engine: string;
  timestamp: number;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  events: [],
  flashEvent: null,
  notifications: [],
  addEvent: (event) => set((state) => {
    const isWin = event.message?.toLowerCase().includes('win') || event.type === 'win';
    const isLoss = event.message?.toLowerCase().includes('loss') || event.type === 'loss';

    const notification: Notification | null = isWin || isLoss ? {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: isWin ? 'win' : 'loss',
      title: isWin ? 'Trade Won' : 'Trade Lost',
      message: event.message || (isWin ? 'Profit recorded' : 'Loss recorded'),
      engine: event.engine || 'Unknown',
      timestamp: Date.now(),
    } : null;

    return {
      events: [event, ...state.events].slice(0, 100),
      flashEvent: isWin ? 'win' : isLoss ? 'loss' : state.flashEvent,
      notifications: notification ? [notification, ...state.notifications].slice(0, 20) : state.notifications,
    };
  }),
  clearEvents: () => set({ events: [], flashEvent: null }),
  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}));