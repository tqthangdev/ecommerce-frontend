"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCategoryById,
  updateCategory,
} from "@/services/admin/category.admin.service";
import Loading from "@/components/ui/Loading";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const categoryId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const c = await getCategoryById(categoryId);
        setName(c.name);
        setImageUrl(c.imageUrl ?? "");
        setDescription(c.description ?? "");
        setActive(c.active);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryId]);

  async function submit() {
    setSaving(true);
    try {
      await updateCategory(categoryId, { name, imageUrl, description, active });
      router.push("/admin/categories");
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
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <button
          onClick={() => router.push("/admin/categories")}
          className="rounded-lg border px-4 py-2"
        >
          Back to list
        </button>
      </div>
      <section className="space-y-5 rounded-xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="w-full rounded-lg border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <input
            className="w-full rounded-lg border p-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded-lg border p-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active
        </label>

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={saving || name.trim().length < 2}
            className="rounded-lg bg-black p-3 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => router.push("/admin/categories")}
            className="rounded-lg border p-3"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}