"use client";

import { useServerStore } from "@/stores/server.store";

export default function ServerOfflineBanner() {
  const isOffline = useServerStore((state) => state.isOffline);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 px-4 py-3 text-center text-white z-[999]">
      Unable to connect to the server. Please check that the backend is running.
    </div>
  );
}