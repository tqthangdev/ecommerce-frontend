"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  getProductById,
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
import {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  Brand,
} from "@/types/product";
import Loading from "@/components/ui/Loading";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BackButton from "@/components/ui/BackButton";
import { msg } from "@/lib/messages";

const PRICE_UNIT_MULTIPLIER: Record<string, number> = {
  million: 1_000_000,
  thousand: 1_000,
};

interface PendingVariant {
  key: number;
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  active: boolean;
}

type Props = {
  productId?: number;
};

export default function ProductForm({ productId }: Props) {
  const router = useRouter();
  const isEdit = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Variants staged while the product does not exist yet (create flow).
  // They are sent with createProduct() instead of hitting /variants endpoints.
  const [pendingVariants, setPendingVariants] = useState<PendingVariant[]>([]);
  const pendingVariantsRef = useRef<PendingVariant[]>([]);

  function updatePendingVariants(list: PendingVariant[]) {
    setPendingVariants(list);
    pendingVariantsRef.current = list;
  }

  useEffect(() => {
    async function loadOptions() {
      try {
        const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
        setCategories(cats);
        setBrands(brs);
        if (cats.length > 0) setCategoryId((prev) => prev || String(cats[0].id));
        if (brs.length > 0) setBrandId((prev) => prev || String(brs[0].id));
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    if (!isEdit || !productId) return;
    (async () => {
      try {
        const p = await getProductById(productId);
        setProduct(p);
        setName(p.name);
        setDescription(p.description ?? "");
        setCategoryId(String(p.category.id));
        setBrandId(String(p.brand.id));
        setActive(p.active);
        setFeatured(p.featured);
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, productId]);

  // In create mode, at least one variant must be staged before the product can
  // be saved (edit mode keeps variants server-side, so the check only applies
  // to pending variants).
  const hasPendingVariants = pendingVariants.length > 0;

  const isValid =
    name.trim().length >= 2 &&
    categoryId !== "" &&
    brandId !== "" &&
    (isEdit || hasPendingVariants);

  async function submit() {
    if (!isValid) return;
    if (!isEdit && pendingVariantsRef.current.length === 0) {
      setError(msg.atLeastOneVariant);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const basePayload = {
        name,
        description,
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        active,
        featured,
      };

      if (isEdit && productId) {
        await updateProduct(productId, { ...basePayload, variants: [] });
      } else {
        const created = await createProduct({
          ...basePayload,
          variants: pendingVariantsRef.current.map((v) => ({
            sku: v.sku.trim(),
            color: v.color.trim(),
            size: v.size.trim(),
            price: v.price,
            stockQuantity: v.stockQuantity,
            imageUrl: v.imageUrl.trim() || undefined,
            active: v.active,
          })),
        });

        if (imageMode === "upload" && image) {
          await uploadImage(created.id, image);
        } else if (imageMode === "url" && imageUrl.trim()) {
          await addImageByUrl(created.id, imageUrl.trim());
        }
      }

      router.push("/admin/products");
    } catch (err) {
      setError(msg.saveProductFailed);
    } finally {
      setSaving(false);
    }
  }

  async function refreshProduct() {
    if (!productId) return;
    const p = await getProductById(productId);
    setProduct(p);
  }

  if (loading || loadingOptions) return <Loading />;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Product" : "Create Product"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? `Editing product #${productId}` : "Add a new product to the catalog."}
          </p>
        </div>
        <BackButton label="Back to list" path="/admin/products" />
      </div>

      {/* Basic info */}
      <section className="space-y-5 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input
            className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="e.g. Classic Cotton Tee"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-black focus:outline-none"
            rows={4}
            placeholder="Short product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select
              className="w-full rounded-lg border bg-white p-2 focus:ring-2 focus:ring-black focus:outline-none"
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
            <select
              className="w-full rounded-lg border bg-white p-2 focus:ring-2 focus:ring-black focus:outline-none"
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

        <div className="flex gap-6 border-t pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
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
      </section>

      {/* Variants */}
      <section className="space-y-5 rounded-xl border bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Variants</h2>
            <p className="text-xs text-gray-400">
              At least one variant is required. Add variants one by one, then create the product.
            </p>
          </div>
        </div>

        <EditVariantsSection
          product={product}
          onChanged={refreshProduct}
          pendingVariants={pendingVariants}
          onPendingVariantsChange={updatePendingVariants}
        />
      </section>

      {/* Image (create) / Images (edit) */}
      {isEdit && product ? (
        <EditImagesSection product={product} onChanged={refreshProduct} />
      ) : (
        <section className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Product Image</h2>

          <div className="mb-2 flex items-center gap-4 text-sm">
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="create-image-mode"
                value="url"
                checked={imageMode === "url"}
                onChange={() => setImageMode("url")}
              />
              URL
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="create-image-mode"
                value="upload"
                checked={imageMode === "upload"}
                onChange={() => setImageMode("upload")}
              />
              Upload
            </label>
          </div>

          {imageMode === "url" ? (
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-black focus:outline-none"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          )}

          <p className="mt-1 text-xs text-gray-400">
            Optional — you can also add images after creating the product.
          </p>
        </section>
      )}

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={submit}
          disabled={!isValid || saving}
          className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border px-5 py-2.5 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}

// ---- Variant section (shared by create and edit) ----

type EditVariantsSectionProps = {
  product: Product | null;
  onChanged: () => void;
  pendingVariants: PendingVariant[];
  onPendingVariantsChange: (list: PendingVariant[]) => void;
};

function EditVariantsSection({
  product,
  onChanged,
  pendingVariants,
  onPendingVariantsChange,
}: EditVariantsSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [sku, setSku] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"million" | "thousand">("million");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [variantActive, setVariantActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductVariant | null>(null);
  const [deletePendingKey, setDeletePendingKey] = useState<number | null>(null);

  const nextPendingKeyRef = useRef(1);

  const isEditing = editingId !== null || editingKey !== null;

  function resetForm() {
    setSku("");
    setColor("");
    setSize("");
    setPrice("");
    setPriceUnit("million");
    setStockQuantity("");
    setImageUrl("");
    setVariantActive(true);
    setEditingId(null);
    setEditingKey(null);
    setError(null);
  }

  function startEditing(v: ProductVariant) {
    setEditingId(v.id);
    setEditingKey(null);
    setSku(v.sku);
    setColor(v.color);
    setSize(v.size);
    const unit: "million" | "thousand" =
      v.price < PRICE_UNIT_MULTIPLIER.million ? "thousand" : "million";
    setPriceUnit(unit);
    setPrice(String(v.price / PRICE_UNIT_MULTIPLIER[unit]));
    setStockQuantity(String(v.stockQuantity));
    setImageUrl(v.imageUrl ?? "");
    setVariantActive(v.active);
    setError(null);
  }

  function startEditingPending(v: PendingVariant) {
    setEditingKey(v.key);
    setEditingId(null);
    setSku(v.sku);
    setColor(v.color);
    setSize(v.size);
    const unit: "million" | "thousand" =
      v.price < PRICE_UNIT_MULTIPLIER.million ? "thousand" : "million";
    setPriceUnit(unit);
    setPrice(String(v.price / PRICE_UNIT_MULTIPLIER[unit]));
    setStockQuantity(String(v.stockQuantity));
    setImageUrl(v.imageUrl);
    setVariantActive(v.active);
    setError(null);
  }

  function handleUnitChange(newUnit: "million" | "thousand") {
    const currentActual = (Number(price) || 0) * PRICE_UNIT_MULTIPLIER[priceUnit];
    setPriceUnit(newUnit);
    setPrice(String(currentActual / PRICE_UNIT_MULTIPLIER[newUnit]));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const actualPrice = (Number(price) || 0) * PRICE_UNIT_MULTIPLIER[priceUnit];

      if (editingKey !== null) {
        // Update a pending (not yet created) variant in place.
        onPendingVariantsChange(
          pendingVariants.map((pv) =>
            pv.key === editingKey
              ? {
                  ...pv,
                  sku,
                  color,
                  size,
                  price: actualPrice,
                  stockQuantity: Number(stockQuantity),
                  imageUrl,
                  active: variantActive,
                }
              : pv
          )
        );
      } else if (editingId !== null) {
        await updateVariant(editingId, {
          sku,
          color,
          size,
          price: actualPrice,
          stockQuantity: Number(stockQuantity),
          imageUrl,
          active: variantActive,
        });
        onChanged();
      } else if (product) {
        await addVariant(product.id, {
          sku,
          color,
          size,
          price: actualPrice,
          stockQuantity: Number(stockQuantity),
          imageUrl,
          active: variantActive,
        });
        onChanged();
      } else {
        // Product does not exist yet — stage the variant for createProduct().
        const next: PendingVariant = {
          key: nextPendingKeyRef.current++,
          sku,
          color,
          size,
          price: actualPrice,
          stockQuantity: Number(stockQuantity),
          imageUrl,
          active: variantActive,
        };
        onPendingVariantsChange([...pendingVariants, next]);
      }
      resetForm();
    } catch (err: unknown) {
      setError(
        (err as Error)?.message ||
        (editingId !== null || editingKey !== null
          ? msg.failedToUpdateVariant
          : msg.failedToAddVariant)
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="py-2">SKU</th>
            <th className="py-2">Color</th>
            <th className="py-2">Size</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pendingVariants.map((pv) => (
            <tr key={pv.key} className={`border-b align-top ${editingKey === pv.key ? "bg-yellow-50" : ""}`}>
              <td className="break-words py-2">{pv.sku}</td>
              <td className="break-words py-2">{pv.color}</td>
              <td className="break-words py-2">{pv.size}</td>
              <td className="break-words py-2">
                {Math.round(pv.price).toLocaleString("vi-VN")}đ
              </td>
              <td className="break-words py-2">{pv.stockQuantity}</td>
              <td className="py-2">{pv.active ? "Yes" : "No"}</td>
              <td className="space-x-2 text-right whitespace-nowrap py-2">
                <button onClick={() => startEditingPending(pv)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => setDeletePendingKey(pv.key)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {(product?.variants ?? []).map((v) => (
            <tr key={v.id} className={`border-b align-top ${editingId === v.id ? "bg-yellow-50" : ""}`}>
              <td className="break-words py-2">{v.sku}</td>
              <td className="break-words py-2">{v.color}</td>
              <td className="break-words py-2">{v.size}</td>
              <td className="break-words py-2">
                {Math.round(v.price).toLocaleString("vi-VN")}đ
              </td>
              <td className="break-words py-2">{v.stockQuantity}</td>
              <td className="py-2">{v.active ? "Yes" : "No"}</td>
              <td className="space-x-2 text-right whitespace-nowrap py-2">
                <button onClick={() => startEditing(v)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => setDeleteTarget(v)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
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
                onChange={(e) => handleUnitChange(e.target.value as "million" | "thousand")}
              >
                <option value="million">million</option>
                <option value="thousand">thousand</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={variantActive}
              onChange={(e) => setVariantActive(e.target.checked)}
            />
            Active
          </label>
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

      <ConfirmDialog
        open={deletePendingKey !== null}
        title="Delete Variant"
        description={`Remove variant "${pendingVariants.find((pv) => pv.key === deletePendingKey)?.sku}"?`}
        confirmText="Delete"
        onConfirm={() => {
          if (deletePendingKey !== null) {
            onPendingVariantsChange(
              pendingVariants.filter((pv) => pv.key !== deletePendingKey)
            );
            if (editingKey === deletePendingKey) resetForm();
          }
          setDeletePendingKey(null);
        }}
        onCancel={() => setDeletePendingKey(null)}
      />
    </>
  );
}

function EditImagesSection({
  product,
  onChanged,
}: {
  product: Product;
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
      await uploadImage(product.id, file);
      onChanged();
    } catch (err: any) {
      setError(err?.message || msg.uploadImageFailed);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddByUrl() {
    if (!imageUrl.trim()) return;
    setSubmittingUrl(true);
    setError(null);
    try {
      await addImageByUrl(product.id, imageUrl.trim());
      setImageUrl("");
      onChanged();
    } catch (err: any) {
      setError(err?.message || msg.addImageFailed);
    } finally {
      setSubmittingUrl(false);
    }
  }

  return (
    <>
      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Images</h2>

        <div className="grid grid-cols-4 gap-4">
          {(product.images ?? []).map((img) => (
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
            <input disabled type="radio" name="image-mode" value="upload" />
            Upload (Coming Soon)
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
