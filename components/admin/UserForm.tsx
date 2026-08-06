"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUser,
  updateUser,
  AdminUser,
} from "@/services/admin/user.admin.service";
import {
  getAvailableRoles,
  Role,
} from "@/services/admin/role.admin.service";
import BackButton from "@/components/ui/BackButton";

type Props = {
  initial?: AdminUser;
  userId?: number;
};

export default function UserForm({ initial, userId }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initial?.roles?.[0] ?? "");
  const [roles, setRoles] = useState<Role[]>([]);
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAvailableRoles()
      .then((availableRoles) => {
        setRoles(availableRoles);
        if (!role && availableRoles.length > 0) {
          setRole(availableRoles[0].name);
        }
      })
      .catch(() => setError("Failed to load roles"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function validate() {
    if (fullName.trim().length < 2 || fullName.trim().length > 100) {
      return "Full name must be between 2 and 100 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (!isEdit && (password.length < 8 || password.length > 100)) {
      return "Password must be between 8 and 100 characters";
    }

    if (isEdit && password && (password.length < 8 || password.length > 100)) {
      return "Password must be between 8 and 100 characters";
    }

    if (!role) {
      return "Please select a role";
    }

    return "";
  }

  async function submit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSaving(true);

    try {
      if (isEdit && userId) {
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
      } else {
        await createUser({
          fullName,
          email,
          password,
          enabled,
          roles: [role],
        });
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

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit User" : "Create User"}
        </h1>
        <button
          onClick={() => router.push("/admin/users")}
          className="rounded-lg border px-4 py-2"
        >
          Back to list
        </button>
      </div>

      <section className="space-y-5 rounded-xl border bg-white p-6">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input
            className="w-full rounded-lg border p-2"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border p-2"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            {isEdit ? "New Password" : "Password"}
          </label>
          <input
            type="password"
            className="w-full rounded-lg border p-2"
            placeholder={isEdit ? "Leave empty to keep current password" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border p-2"
          >
            {roles.map((item) => (
              <option key={item.name} value={item.name}>
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
            className="rounded-lg bg-black p-3 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
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
