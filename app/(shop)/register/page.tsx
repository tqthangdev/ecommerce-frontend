"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { register as registerApi } from "@/lib/auth.service";
import { getErrorMessage } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const syncCart = useCartStore((state) => state.syncFromServer);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await registerApi(name, email, password);
      setUser(data.user);
      setAccessToken(data.accessToken);
      await syncCart();
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8">
        <h1 className="text-3xl font-black">Create Account</h1>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          className="mt-6 w-full rounded-xl border p-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mt-4 w-full rounded-xl border p-3"
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
        />
        <button
          onClick={register}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-black py-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </div>
    </main>
  );
}
