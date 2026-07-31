"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { logout as logoutApi } from "@/lib/auth.service";
import { clearCookies, clearAuth } from "@/lib/api";

export default function Header() {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = user?.roles?.includes("ADMIN") ?? false;

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  function handleLogout() {
    setMenuOpen(false);
    setShowLogoutConfirm(true);
  }

  function confirmLogout() {
    setShowLogoutConfirm(false);
    try {
      logoutApi();
    } catch {
      // ignore
    }
    clearCookies();
    clearAuth();
    logout();
    window.location.href = "/";
  }

  function cancelLogout() {
    setShowLogoutConfirm(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="text-3xl font-black tracking-tight">
            E-Shop
          </Link>

          {/* Search */}
          <div className="hidden w-[420px] items-center gap-3 rounded-full bg-gray-100 px-5 py-3 md:flex">
            <Search size={20} className="text-gray-500" />
            <input
              placeholder="Search products..."
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Menu */}
          <nav className="flex items-center gap-6">
            <Link href="/products" className="transition hover:text-blue-600">
              Products
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
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
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <LayoutDashboard size={16} />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        <ShoppingBag size={16} />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="transition hover:text-blue-600">
                <User size={26} />
              </Link>
            )}
          </nav>
        </div>
      </header>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}
