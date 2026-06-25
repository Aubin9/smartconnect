import { create } from 'zustand';

type Notification = {
  id: string;
  title: string;
  read: boolean;
};

type FilterState = {
  region?: string;
  operator?: string;
  dateRange?: string;
};

type AppState = {
  sidebarOpen: boolean;
  activeView: string;
  selectedSubscriber: string | null;
  filters: FilterState;
  notifications: Notification[];
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  setSelectedSubscriber: (id: string | null) => void;
  setFilters: (filters: FilterState) => void;
  pushNotification: (notification: Notification) => void;
};

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  activeView: 'dashboard',
  selectedSubscriber: null,
  filters: {},
  notifications: [],
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveView: (activeView) => set({ activeView }),
  setSelectedSubscriber: (selectedSubscriber) => set({ selectedSubscriber }),
  setFilters: (filters) => set({ filters }),
  pushNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] }))
}));
