"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminUser, getUsers } from "@/services/admin/user.admin.service";
import Loading from "@/components/ui/Loading";

type UserSortKey = "fullName" | "email" | "roles" | "enabled" | "createdAt" | "updatedAt";

function SortableHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string;
  sortKey: UserSortKey;
  activeKey: UserSortKey;
  dir: "asc" | "desc";
  onSort: (key: UserSortKey) => void;
}) {
  const isActive = activeKey === sortKey;

  return (
    <th className="py-2">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 font-medium ${
          isActive ? "text-black" : "text-gray-500"
        }`}
      >
        {label}

        <span className="text-xs">
          {isActive ? (dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState<UserSortKey>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  function handleSort(key: UserSortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    let cmp = 0;

    if (sortKey === "email") {
      cmp = a.email.localeCompare(b.email);
    } else  if (sortKey === "fullName") {
      cmp = a.fullName.localeCompare(b.fullName);
    }else if (sortKey === "roles") {
      const roleA = a.roles[0] ?? "";
      const roleB = b.roles[0] ?? "";
      cmp = roleA.localeCompare(roleB);
    } else if (sortKey === "enabled") {
      cmp = Number(a.enabled) - Number(b.enabled);
    } else if (sortKey === "createdAt") {
      cmp =
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime();
    } else if (sortKey === "updatedAt") {
      cmp =
        new Date(a.updatedAt).getTime() -
        new Date(b.updatedAt).getTime();
    }

    return sortDir === "asc" ? cmp : -cmp;
  });

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Users
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage customer accounts and permissions.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            User List
          </h2>

          <Link href="/admin/users/create" className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            + Add User
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">

                <SortableHeader
                  label="Email"
                  sortKey="email"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Name"
                  sortKey="fullName"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Role"
                  sortKey="roles"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Status"
                  sortKey="enabled"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Created"
                  sortKey="createdAt"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Updated"
                  sortKey="updatedAt"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />

                <th></th>
              </tr>
            </thead>

            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.email} className="border-b">
                  <td className="py-2">
                    {user.email}

                  </td>
                  <td className="py-2">
                    {user.fullName}
                  </td>

                  <td className="py-2">
                    <div className="flex gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-2">
                    {user.enabled ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-2">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </td>

                  <td className="py-2 text-right">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {sortedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}