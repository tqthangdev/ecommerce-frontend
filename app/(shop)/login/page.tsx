"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { login as loginApi } from "@/lib/auth.service";
import { getErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please enter email/password");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data.user, data.accessToken, data.refreshToken);
      if (data.user.roles.includes("ADMIN")) {
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
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-black">Login</h1>
        <p className="text-gray-500 mt-2">Welcome back</p>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </p>
        )}

        <input
          className="mt-8 border rounded-xl p-3 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-4 border rounded-xl p-3 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-3 rounded-full font-bold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-gray-500">
          Don&apos;t have account?
          <Link href="/register" className="text-black font-bold ml-2">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}