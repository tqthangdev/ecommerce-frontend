"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { register as registerApi } from "@/lib/auth.service";
import { getErrorMessage } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
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
      login(data.user, data.accessToken, data.refreshToken);
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white border rounded-3xl p-8">
        <h1 className="text-3xl font-black">Create Account</h1>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </p>
        )}

        <input
          className="mt-6 border p-3 rounded-xl w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mt-4 border p-3 rounded-xl w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-4 border p-3 rounded-xl w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={register}
          disabled={loading}
          className="mt-6 bg-black text-white w-full py-3 rounded-full disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </div>
    </main>
  );
}