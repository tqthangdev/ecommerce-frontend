"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Store, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      <div />

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition hover:bg-gray-100"
        >
          <Store size={16} />
          View shop
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition hover:opacity-90"
          >
            {initials}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border bg-white shadow-lg">
              <div className="border-b px-4 py-3">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}