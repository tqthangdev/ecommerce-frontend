import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cart.store";

export interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hasSession: boolean;
  initialized: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string | null) => void;
  setAuth: (user: User, accessToken: string) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasSession: false,
      initialized: false,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setAuth: (user, accessToken) => set({ user, accessToken, hasSession: true }),
      setInitialized: (value) => set({ initialized: value }),

      logout: () => {
        set({ user: null, accessToken: null, hasSession: false });
        useCartStore.getState().reset();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, hasSession: state.hasSession }),
    }
  )
);
