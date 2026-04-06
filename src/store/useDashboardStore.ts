import { create } from 'zustand';

interface DashboardState {
  events: any[];
  addEvent: (event: any) => void;
  clearEvents: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ 
    events: [event, ...state.events].slice(0, 100) 
  })),
  clearEvents: () => set({ events: [] }),
}));
