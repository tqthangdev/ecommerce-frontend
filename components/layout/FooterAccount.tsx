"use client";

import { useState } from "react";
import Link from "next/link";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { useAuthStore } from "@/stores/auth.store";

import { clearAuth } from "@/lib/api";
import { logout as logoutApi } from "@/lib/auth.service";

export default function FooterAccount() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const isAdmin = user?.roles?.includes("ADMIN") ?? false;

    function handleLogout() {
        setShowLogoutConfirm(true);
    }

    async function confirmLogout() {
        setShowLogoutConfirm(false);

        try {
            await logoutApi();
        } catch {
            // Ignore logout API error
        }

        clearAuth();
        logout();

        window.location.href = "/";
    }

    function cancelLogout() {
        setShowLogoutConfirm(false);
    }

    return (
        <>
            <div>
                <h3 className="mb-4 font-semibold text-white">Account</h3>

                <ul className="space-y-3 text-sm">
                    {user ? (
                        <>
                            <li>
                                <Link href="/profile" className="transition hover:text-white">
                                    My Profile
                                </Link>
                            </li>

                            <li>
                                <Link href="/orders" className="transition hover:text-white">
                                    My Orders
                                </Link>
                            </li>

                            <li>
                                <Link href="/cart" className="transition hover:text-white">
                                    My Cart
                                </Link>
                            </li>

                            {isAdmin && (
                                <li>
                                    <Link href="/admin" className="transition hover:text-white">
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}

                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="transition hover:text-white"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/login" className="transition hover:text-white">
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link href="/register" className="transition hover:text-white">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

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