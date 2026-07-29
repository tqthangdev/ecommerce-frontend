"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrand } from "@/services/admin/brand.admin.service";

export default function CreateBrandPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      await createBrand({ name, logoUrl, description, active });
      router.push("/admin/brands");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Brand</h1>
        <button
          onClick={() => router.push("/admin/brands")}
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
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Logo URL</label>
          <input
            className="w-full rounded-lg border p-2"
            placeholder="https://..."
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
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

        <button
          onClick={submit}
          disabled={saving || name.trim().length < 2}
          className="rounded-lg bg-black p-3 text-white disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create"}
        </button>
      </section>
    </main>
  );
}