"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductById,
  updateProduct,
  addVariant,
  updateVariant,
  removeVariant,
  uploadImage,
  addImageByUrl,
  removeImage,
  setPrimaryImage,
  VariantPayload,
} from "@/services/admin/product.admin.service";
import { getCategories } from "@/services/admin/category.admin.service";
import { getBrands } from "@/services/admin/brand.admin.service";
import { Product, ProductVariant, ProductImage, Category, Brand } from "@/types/product";
import Loading from "@/components/ui/Loading";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BackButton from "@/components/ui/BackButton";

const PRICE_UNIT_MULTIPLIER = {
  million: 1_000_000,
  thousand: 1_000,
} as const;

type PriceUnit = keyof typeof PRICE_UNIT_MULTIPLIER;

function formatVND(value: number): string {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, cats, brs] = await Promise.all([
          getProductById(productId),
          getCategories(),
          getBrands(),
        ]);
        setProduct(p);
        setCategories(cats);
        setBrands(brs);
        setName(p.name);
        setDescription(p.description ?? "");
        setBasePrice(String(p.basePrice));
        setDiscountPercent(String(p.discountPercent ?? 0));
        setStockQuantity(String(p.stockQuantity));
        setCategoryId(String(p.category.id));
        setBrandId(String(p.brand.id));
        setActive(p.active);
        setFeatured(p.featured);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  async function handleSaveBasicInfo() {
    setSaving(true);
    try {
      const updated = await updateProduct(productId, {
        name,
        description,
        basePrice: 0,
        discountPercent: Number(discountPercent),
        stockQuantity: 0,
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        active,
        featured,
      });
      setProduct(updated);
    } catch (err: unknown) {
      console.error((err as Error)?.message);
    } finally {
      setSaving(false);
    }
  }

  async function refreshProduct() {
    const p = await getProductById(productId);
    setProduct(p);
    setStockQuantity(String(p.stockQuantity));
    setBasePrice(String(p.basePrice));
  }

  if (loading) return <Loading />;
  if (!product) return <p className="p-10">Product not found</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <BackButton label="Back to list" path="/admin/products" />
      </div>

      <section className="space-y-4 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="w-full rounded-lg border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <input
            className="w-full rounded-lg border bg-gray-100 p-2 text-gray-500"
            value={product.slug}
            disabled
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

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Base Price</label>
            <input
              type="number"
              readOnly
              className="w-full rounded-lg border p-2"
              value={basePrice}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Discount %</label>
            <input
              type="number"
              className="w-full rounded-lg border p-2"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Stock</label>
            <input
              type="number"
              readOnly
              className="w-full rounded-lg border p-2"
              value={stockQuantity}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              className="w-full rounded-lg border p-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Brand</label>
            <select
              className="w-full rounded-lg border p-2"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />{" "}
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />{" "}
            Featured
          </label>
        </div>

        <button
          onClick={handleSaveBasicInfo}
          disabled={saving}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      <VariantsSection
        productId={productId}
        variants={product.variants}
        onChanged={refreshProduct}
      />
      <ImagesSection productId={productId} images={product.images} onChanged={refreshProduct} />
    </div>
  );
}

type VariantSortKey = "sku" | "color" | "size" | "price" | "stockQuantity";

function SortableHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string;
  sortKey: VariantSortKey;
  activeKey: VariantSortKey;
  dir: "asc" | "desc";
  onSort: (key: VariantSortKey) => void;
}) {
  const isActive = activeKey === sortKey;
  return (
    <th className="py-2">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 font-medium ${isActive ? "text-black" : "text-gray-500"}`}
      >
        {label}
        <span className="text-xs">{isActive ? (dir === "asc" ? "▲" : "▼") : "↕"}</span>
      </button>
    </th>
  );
}

function VariantsSection({
  productId,
  variants,
  onChanged,
}: {
  productId: number;
  variants: ProductVariant[];
  onChanged: () => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const [sku, setSku] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("million");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductVariant | null>(null);

  const [sortKey, setSortKey] = useState<VariantSortKey>("sku");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const isEditing = editingId !== null;

  function handleSort(key: VariantSortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedVariants = [...variants].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "sku") cmp = a.sku.localeCompare(b.sku);
    else if (sortKey === "color") cmp = a.color.localeCompare(b.color);
    else if (sortKey === "size") cmp = a.size.localeCompare(b.size);
    else if (sortKey === "price") cmp = a.price - b.price;
    else if (sortKey === "stockQuantity") cmp = a.stockQuantity - b.stockQuantity;
    return sortDir === "asc" ? cmp : -cmp;
  });

  function resetForm() {
    setSku("");
    setColor("");
    setSize("");
    setPrice("");
    setPriceUnit("million");
    setStockQuantity("");
    setImageUrl("");
    setEditingId(null);
    setError(null);
  }

  function startEditing(v: ProductVariant) {
    setEditingId(v.id);
    setSku(v.sku);
    setColor(v.color);
    setSize(v.size);
    const unit: PriceUnit = v.price < PRICE_UNIT_MULTIPLIER.million ? "thousand" : "million";
    setPriceUnit(unit);
    setPrice(String(v.price / PRICE_UNIT_MULTIPLIER[unit]));
    setStockQuantity(String(v.stockQuantity));
    setImageUrl(v.imageUrl ?? "");
    setError(null);
  }

  function handleUnitChange(newUnit: PriceUnit) {
    const currentActual = (Number(price) || 0) * PRICE_UNIT_MULTIPLIER[priceUnit];
    setPriceUnit(newUnit);
    setPrice(String(currentActual / PRICE_UNIT_MULTIPLIER[newUnit]));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const actualPrice = (Number(price) || 0) * PRICE_UNIT_MULTIPLIER[priceUnit];
      if (editingId !== null) {
        await updateVariant(editingId, {
          sku,
          color,
          size,
          price: actualPrice,
          stockQuantity: Number(stockQuantity),
          imageUrl,
        });
      } else {
        await addVariant(productId, {
          sku,
          color,
          size,
          price: actualPrice,
          stockQuantity: Number(stockQuantity),
          imageUrl,
        });
      }
      resetForm();
      onChanged();
    } catch (err: unknown) {
      const message =
        (err as Error)?.message ||
        (editingId !== null ? "Failed to update variant" : "Failed to add variant");
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="space-y-4 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Variants</h2>

        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col />
            <col className="w-20" />
            <col className="w-16" />
            <col className="w-22" />
            <col className="w-14" />
            <col className="w-24" />
          </colgroup>
          <thead>
            <tr className="border-b">
              <SortableHeader label="SKU" sortKey="sku" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortableHeader label="Color" sortKey="color" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortableHeader label="Size" sortKey="size" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortableHeader label="Price" sortKey="price" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortableHeader label="Stock" sortKey="stockQuantity" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedVariants.map((v) => (
              <VariantRow
                key={v.id}
                variant={v}
                isEditing={editingId === v.id}
                onEdit={() => startEditing(v)}
                onDelete={() => setDeleteTarget(v)}
              />
            ))}
          </tbody>
        </table>

        <div className="space-y-3">
          {isEditing && (
            <p className="text-sm font-medium text-gray-600">
              Editing variant <span className="font-semibold">{sku}</span> —{" "}
              <button onClick={resetForm} className="text-blue-600 underline">
                Cancel
              </button>
            </p>
          )}

          <div className="flex gap-3">
            <div className="w-52">
              <label className="mb-1 block text-xs font-medium text-gray-500">SKU</label>
              <input
                className="w-full rounded-lg border p-2 disabled:bg-gray-100"
                placeholder="SKU"
                value={sku}
                disabled={isEditing}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">Color</label>
              <input
                className="w-full rounded-lg border p-2"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">Size</label>
              <input
                className="w-full rounded-lg border p-2"
                placeholder="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="w-20">
              <label className="mb-1 block text-xs font-medium text-gray-500">Stock</label>
              <input
                type="number"
                className="w-full rounded-lg border p-2"
                placeholder="Stock"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">Price</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full rounded-lg border p-2"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d*$/.test(val)) setPrice(val);
                  }}
                />
                <select
                  className="shrink-0 rounded-lg border p-2 text-sm"
                  value={priceUnit}
                  onChange={(e) => handleUnitChange(e.target.value as PriceUnit)}
                >
                  <option value="million">million</option>
                  <option value="thousand">thousand</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Saving..." : isEditing ? "Update" : "+ Add"}
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Variant"
        description={`Remove variant "${deleteTarget?.sku}"?`}
        confirmText="Delete"
        onConfirm={async () => {
          if (deleteTarget) {
            await removeVariant(deleteTarget.id);
            if (editingId === deleteTarget.id) resetForm();
          }
          setDeleteTarget(null);
          onChanged();
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

function VariantRow({
  variant,
  isEditing,
  onEdit,
  onDelete,
}: {
  variant: ProductVariant;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className={`border-b align-top ${isEditing ? "bg-yellow-50" : ""}`}>
      <td className="whitespace-normal break-words py-2">{variant.sku}</td>
      <td className="whitespace-normal break-words py-2">{variant.color}</td>
      <td className="whitespace-normal break-words py-2">{variant.size}</td>
      <td className="whitespace-normal break-words py-2">{formatVND(variant.price)}</td>
      <td className="whitespace-normal break-words py-2">{variant.stockQuantity}</td>
      <td className="space-x-2 text-right whitespace-nowrap py-2">
        <button onClick={onEdit} className="text-blue-600">
          Edit
        </button>
        <button onClick={onDelete} className="text-red-600">
          Delete
        </button>
      </td>
    </tr>
  );
}

function ImagesSection({
  productId,
  images,
  onChanged,
}: {
  productId: number;
  images: ProductImage[];
  onChanged: () => void;
}) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [submittingUrl, setSubmittingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductImage | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      await uploadImage(productId, file);
      onChanged();
    } catch (err: any) {
      setError(err?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddByUrl() {
    if (!imageUrl.trim()) return;
    setSubmittingUrl(true);
    setError(null);
    try {
      await addImageByUrl(productId, imageUrl.trim());
      setImageUrl("");
      onChanged();
    } catch (err: any) {
      setError(err?.message || "Failed to add image");
    } finally {
      setSubmittingUrl(false);
    }
  }

  return (
    <>
      <section className="space-y-4 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Images</h2>

        <div className="grid grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative rounded-lg border p-2">
              <img
                src={img.imageUrl}
                alt={img.altText}
                className="h-32 w-full rounded-md object-cover"
              />
              {img.primary && (
                <span className="absolute top-2 left-2 rounded bg-black px-2 py-0.5 text-xs text-white">
                  Primary
                </span>
              )}
              <div className="mt-2 flex justify-between text-xs">
                {!img.primary && (
                  <button
                    onClick={() => setPrimaryImage(img.id).then(onChanged)}
                    className="text-blue-600"
                  >
                    Set Primary
                  </button>
                )}
                <button onClick={() => setDeleteTarget(img)} className="text-red-600">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t pt-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="image-mode"
              value="url"
              checked={mode === "url"}
              onChange={() => setMode("url")}
            />
            URL
          </label>
          <label className="flex items-center gap-1.5 opacity-60 cursor-not-allowed">
            <input
              disabled
              type="radio"
              name="image-mode"
              value="upload"
              checked={mode === "upload"}
              onChange={() => setMode("upload")}
            />
            Upload (Comming Soon)
          </label>
        </div>

        {mode === "url" ? (
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={submittingUrl}
              className="flex-1 rounded-lg border p-2"
            />
            <button
              onClick={handleAddByUrl}
              disabled={submittingUrl || !imageUrl.trim()}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {submittingUrl ? "Adding..." : "Add"}
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Image"
        description="Remove this image?"
        confirmText="Delete"
        onConfirm={async () => {
          if (deleteTarget) await removeImage(deleteTarget.id);
          setDeleteTarget(null);
          onChanged();
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}