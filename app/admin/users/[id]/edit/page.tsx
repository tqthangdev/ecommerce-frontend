"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getUserById,
  AdminUser,
} from "@/services/admin/user.admin.service";
import UserForm from "@/components/admin/UserForm";
import Loading from "@/components/ui/Loading";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getUserById(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Loading />;
  if (!user) return <p className="p-10">User not found</p>;

  return <UserForm initial={user} userId={userId} />;
}
