import { create } from "zustand";

interface ServerState {
  isOffline: boolean;
  setOffline: () => void;
  setOnline: () => void;
}

export const useServerStore = create<ServerState>((set) => ({
  isOffline: false,

  setOffline: () => set({ isOffline: true }),

  setOnline: () => set({ isOffline: false }),
}));