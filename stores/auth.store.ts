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
  setUser: (user: User) => void;
  setAccessToken: (token: string | null) => void;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setAuth: (user, accessToken) => set({ user, accessToken }),
      logout: () => {
        set({ user: null, accessToken: null });
        useCartStore.getState().clear();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
