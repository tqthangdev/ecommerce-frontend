"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, uploadImage } from "@/services/admin/product.admin.service";
import { getCategories } from "@/services/admin/category.admin.service";
import { getBrands } from "@/services/admin/brand.admin.service";
import { Category, Brand } from "@/types/product";
import Loading from "@/components/ui/Loading";

export default function CreateProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
        setCategories(cats);
        setBrands(brs);
        if (cats.length > 0) setCategoryId(String(cats[0].id));
        if (brs.length > 0) setBrandId(String(brs[0].id));
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  const isValid = name.trim().length >= 2 && basePrice !== "" && categoryId !== "" && brandId !== "";

  async function submit() {
    if (!isValid) return;
    setSaving(true);
    setError("");
    try {
      const product = await createProduct({
        name,
        description,
        basePrice: Number(basePrice),
        discountPercent: Number(discountPercent),
        stockQuantity: Number(stockQuantity),
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        active,
        featured,
      });

      if (image) {
        await uploadImage(product.id, image);
      }

      router.push("/admin/products");
    } catch (err) {
      setError("Could not create product. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingOptions) {
    return <Loading />;
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Create Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new product to the catalog.
            </p>
        </div>
        <button
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border px-4 py-2"
        >
          Back to list
        </button>
      </div>

      <section className="space-y-5 rounded-xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g. Classic Cotton Tee"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-black"
            rows={4}
            placeholder="Short product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Base Price
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Discount %
            </label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="w-full rounded-lg border bg-white p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.length === 0 && <option value="">No categories yet</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Brand
            </label>
            <select
              className="w-full rounded-lg border bg-white p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              {brands.length === 0 && <option value="">No brands yet</option>}
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          <p className="mt-1 text-xs text-gray-400">
            Optional — you can also add images after creating the product.
          </p>
        </div>

        <div className="flex gap-6 border-t pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={submit}
            disabled={!isValid || saving}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving ? "Creating..." : "Create Product"}
          </button>
          <button
            onClick={() => router.push("/admin/products")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}