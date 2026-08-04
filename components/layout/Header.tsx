"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";

import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { logout as logoutApi } from "@/lib/auth.service";
import { canAccessAdmin } from "@/lib/permission";

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === "/";

  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const canAdmin = canAccessAdmin(user?.roles);

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

  async function confirmLogout() {
    setShowLogoutConfirm(false);
    try {
      await logoutApi();
    } finally {
      logout();
      window.location.href = "/login";
    }
  }

  function cancelLogout() {
    setShowLogoutConfirm(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${
          isHome
            ? "-mt-20 border-white/10 bg-transparent text-white"
            : "border-gray-200 bg-white/90 text-gray-900"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className={`text-3xl font-black tracking-tight ${
              isHome ? "text-white" : "text-black"
            }`}
          >
            E-Shop
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              href="/products"
              className={
                isHome
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }
            >
              Products
            </Link>

            <Link
              href="/cart"
              className={isHome ? "text-white" : "text-gray-900"}
            >
              <div className="relative">
                <ShoppingCart size={26} />

                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {user ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    isHome
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {initials}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border bg-white shadow-lg text-black">
                    <div className="border-b px-4 py-3">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {canAdmin  && (
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
              <Link href="/login">
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
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}