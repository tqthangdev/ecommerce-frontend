"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";

import Loading from "@/components/ui/Loading";
import { getAvailableRoles, Role } from "@/services/admin/role.admin.service";
import {
  getUserById,
  updateUser,
} from "@/services/admin/user.admin.service";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const userId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [user, availableRoles] = await Promise.all([
          getUserById(userId),
          getAvailableRoles(),
        ]);

        setRoles(availableRoles);

        setFullName(user.fullName);
        setEmail(user.email);
        setEnabled(user.enabled);
        setRole(user.roles[0] ?? "");
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(
            err.response?.data?.message ?? "Failed to load user"
          );
        } else {
          setError("Failed to load user");
        }
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      load();
    }
  }, [userId]);

  function validate() {
    if (
      fullName.trim().length < 2 ||
      fullName.trim().length > 100
    ) {
      return "Full name must be between 2 and 100 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (
      password &&
      (password.length < 8 || password.length > 100)
    ) {
      return "Password must be between 8 and 100 characters";
    }

    return "";
  }

  async function submit() {
    const message = validate();

    if (message) {
      setError(message);
      return;
    }

    setError("");
    setSaving(true);

    try {
      const response = await updateUser(userId, {
        fullName,
        email,
        enabled,
        roles: [role],
        ...(password ? { password } : {}),
      });

      if (!response.success) {
        setError(response.message);
        return;
      }

      router.push("/admin/users");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Edit User
        </h1>

        <button
          onClick={() => router.push("/admin/users")}
          className="rounded-lg border px-4 py-2"
        >
          Back to list
        </button>
      </div>

      {error && (
        <div
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      <section
        className="
          space-y-5
          rounded-xl
          border
          bg-white
          p-6
        "
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Full Name
          </label>

          <input
            className="w-full rounded-lg border p-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            className="w-full rounded-lg border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            New Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border p-2"
            placeholder="Leave empty to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border p-2"
          >
            {roles.map((item) => (
              <option
                key={item.name}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />

          Enabled
        </label>

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={saving}
            className="
              rounded-lg
              bg-black
              p-3
              text-white
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => router.push("/admin/users")}
            className="rounded-lg border p-3"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}