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
  removeImage,
  setPrimaryImage,
  VariantPayload,
} from "@/services/admin/product.admin.service";
import { getCategories } from "@/services/admin/category.admin.service";
import { getBrands } from "@/services/admin/brand.admin.service";
import { Product, ProductVariant, ProductImage, Category, Brand } from "@/types/product";
import Loading from "@/components/ui/Loading";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // basic info form state
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
        basePrice: Number(basePrice),
        discountPercent: Number(discountPercent),
        stockQuantity: Number(stockQuantity),
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        active,
        featured,
      });
      setProduct(updated);
      alert("Product updated");
    } finally {
      setSaving(false);
    }
  }

  async function refreshProduct() {
    const p = await getProductById(productId);
    setProduct(p);
  }

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <p className="p-10">Product not found</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <button
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border px-4 py-2"
        >
          Back to list
        </button>
      </div>

      {/* BASIC INFO */}
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
              className="w-full rounded-lg border p-2"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
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
            <label className="mb-1 block text-sm font-medium">Stock Quantity</label>
            <input
              type="number"
              className="w-full rounded-lg border p-2"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
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
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
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

      {/* VARIANTS */}
      <VariantsSection
        productId={productId}
        variants={product.variants}
        onChanged={refreshProduct}
      />

      {/* IMAGES */}
      <ImagesSection
        productId={productId}
        images={product.images}
        onChanged={refreshProduct}
      />
    </div>
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
  const [sku, setSku] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    try {
      const payload: VariantPayload = {
        sku,
        color,
        size,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        imageUrl,
      };
      await addVariant(productId, payload);
      setSku("");
      setColor("");
      setSize("");
      setPrice("");
      setStockQuantity("");
      setImageUrl("");
      onChanged();
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(variantId: number) {
    if (!confirm("Remove this variant?")) return;
    await removeVariant(variantId);
    onChanged();
  }

  return (
    <section className="space-y-4 rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Variants</h2>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">SKU</th>
            <th>Color</th>
            <th>Size</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <VariantRow
              key={v.id}
              variant={v}
              onDelete={() => handleDelete(v.id)}
              onUpdated={onChanged}
            />
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-6 gap-2 border-t pt-4">
        <input
          className="rounded-lg border p-2"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <input
          className="rounded-lg border p-2"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          className="rounded-lg border p-2"
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <input
          className="rounded-lg border p-2"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="rounded-lg border p-2"
          placeholder="Stock"
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          className="rounded-lg bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          + Add
        </button>
      </div>
    </section>
  );
}

function VariantRow({
  variant,
  onDelete,
  onUpdated,
}: {
  variant: ProductVariant;
  onDelete: () => void;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(variant.price));
  const [stockQuantity, setStockQuantity] = useState(String(variant.stockQuantity));

  async function handleSave() {
    await updateVariant(variant.id, {
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      imageUrl: variant.imageUrl,
    });
    setEditing(false);
    onUpdated();
  }

  return (
    <tr className="border-b">
      <td className="py-2">{variant.sku}</td>
      <td>{variant.color}</td>
      <td>{variant.size}</td>
      <td>
        {editing ? (
          <input
            type="number"
            className="w-24 rounded border p-1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        ) : (
          variant.price
        )}
      </td>
      <td>
        {editing ? (
          <input
            type="number"
            className="w-20 rounded border p-1"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        ) : (
          variant.stockQuantity
        )}
      </td>
      <td className="space-x-2 text-right">
        {editing ? (
          <button onClick={handleSave} className="text-green-600">
            Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="text-blue-600">
            Edit
          </button>
        )}
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
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      await uploadImage(productId, file);
      onChanged();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageId: number) {
    if (!confirm("Remove this image?")) return;
    await removeImage(imageId);
    onChanged();
  }

  async function handleSetPrimary(imageId: number) {
    await setPrimaryImage(imageId);
    onChanged();
  }

  return (
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
              <span className="absolute left-2 top-2 rounded bg-black px-2 py-0.5 text-xs text-white">
                Primary
              </span>
            )}
            <div className="mt-2 flex justify-between text-xs">
              {!img.primary && (
                <button
                  onClick={() => handleSetPrimary(img.id)}
                  className="text-blue-600"
                >
                  Set Primary
                </button>
              )}
              <button
                onClick={() => handleDelete(img.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </section>
  );
}