// components/providers/AuthProvider.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { restoreAccessToken } from "@/lib/api";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const syncCart = useCartStore((state) => state.syncFromServer);

  const initialized = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    restoreAccessToken().finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (initialized.current) return;
    initialized.current = true;

    if (accessToken) {
      syncCart();
    }
  }, [hydrated, accessToken]);

  return <>{children}</>;
}
