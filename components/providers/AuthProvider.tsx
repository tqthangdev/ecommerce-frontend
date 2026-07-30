"use client";

import { useEffect, useRef } from "react";
import { restoreAccessToken } from "@/lib/api";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    restoreAccessToken().then((ok) => {
      if (!ok && typeof window !== "undefined") {
        // RT không hợp lệ → đã redirect bởi api.ts interceptor
      }
    });
  }, []);

  return <>{children}</>;
}
