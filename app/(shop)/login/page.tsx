"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { login as loginApi } from "@/lib/auth.service";
import { getErrorMessage } from "@/lib/api";
import { msg } from "@/lib/messages";
import { canAccessAdmin } from "@/lib/permission";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const syncCart = useCartStore((state) => state.syncFromServer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError(msg.enterEmailPassword);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      setAuth(data.user, data.accessToken);
      await syncCart();
      const canAdmin = canAccessAdmin(data?.user.roles);
      if (canAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-black">Login</h1>
        <p className="mt-2 text-gray-500">Welcome back</p>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          className="mt-8 w-full rounded-xl border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-4 w-full rounded-xl border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-black py-3 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-gray-500">
          Don&apos;t have account?
          <Link href="/register" className="ml-2 font-bold text-black">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
