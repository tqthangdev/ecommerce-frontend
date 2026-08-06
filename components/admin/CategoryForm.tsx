"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCategory,
  updateCategory,
} from "@/services/admin/category.admin.service";
import { Category } from "@/types/product";
import BackButton from "@/components/ui/BackButton";

type Props = {
  initial?: Category;
  categoryId?: number;
};

export default function CategoryForm({ initial, categoryId }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      const payload = { name, imageUrl, description, active };
      if (isEdit && categoryId) {
        await updateCategory(categoryId, payload);
      } else {
        await createCategory(payload);
      }
      router.push("/admin/categories");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Category" : "Create Category"}
        </h1>
        <BackButton label="Back to list" path="/admin/categories" />
      </div>
      <section className="space-y-5 rounded-xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="w-full rounded-lg border p-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <input
            className="w-full rounded-lg border p-2"
            placeholder="https://..."
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
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active
        </label>

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={saving || name.trim().length < 2}
            className="rounded-lg bg-black p-3 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
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
