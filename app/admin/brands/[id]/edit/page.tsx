"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBrandById, updateBrand } from "@/services/admin/brand.admin.service";
import Loading from "@/components/ui/Loading";

export default function EditBrandPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const brandId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const b = await getBrandById(brandId);
        setName(b.name);
        setLogoUrl(b.logoUrl ?? "");
        setDescription(b.description ?? "");
        setActive(b.active);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [brandId]);

  async function submit() {
    setSaving(true);
    try {
      await updateBrand(brandId, { name, logoUrl, description, active });
      router.push("/admin/brands");
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
        <h1 className="text-3xl font-bold">Edit Brand</h1>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Logo URL</label>
          <input
            className="w-full rounded-lg border p-2"
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
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
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
          <button onClick={() => router.push("/admin/brands")} className="rounded-lg border p-3">
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
