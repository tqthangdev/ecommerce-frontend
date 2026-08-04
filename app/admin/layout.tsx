"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { canAccessAdmin } from "@/lib/permission";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const canAdmin = canAccessAdmin(user?.roles);

  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) return;

    if (user === null) {
      router.replace("/login");
    } else if (!canAdmin) {
      router.replace("/");
    }
  }, [initialized, user, canAdmin, router]);

  if (!user || !canAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
