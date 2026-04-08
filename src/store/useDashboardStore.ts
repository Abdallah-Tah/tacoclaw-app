import { create } from 'zustand';

interface DashboardState {
  events: any[];
  flashEvent: 'win' | 'loss' | null;
  addEvent: (event: any) => void;
  clearEvents: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  events: [],
  flashEvent: null,
  addEvent: (event) => set((state) => {
    const isWin = event.message?.toLowerCase().includes('win') || event.type === 'win';
    const isLoss = event.message?.toLowerCase().includes('loss') || event.type === 'loss';
    return {
      events: [event, ...state.events].slice(0, 100),
      flashEvent: isWin ? 'win' : isLoss ? 'loss' : state.flashEvent,
    };
  }),
  clearEvents: () => set({ events: [], flashEvent: null }),
}));