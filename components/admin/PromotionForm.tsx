"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createPromotion,
  updatePromotion,
  Promotion,
  PromotionDiscountType,
} from "@/services/admin/promotion.admin.service";
import { getProducts, VariantPayload } from "@/services/admin/product.admin.service";
import { Product } from "@/types/product";
import Loading from "@/components/ui/Loading";
import BackButton from "@/components/ui/BackButton";

type Props = {
  initial?: Promotion;
  promotionId?: number;
};

function formatDateTimeLocal(dt: string): string {
  if (!dt) return "";
  const d = new Date(dt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PromotionForm({ initial, promotionId }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [discountType, setDiscountType] = useState<PromotionDiscountType>(
    initial?.discountType ?? "PERCENTAGE"
  );
  const [discountValue, setDiscountValue] = useState(
    initial ? String(initial.discountValue) : ""
  );
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    initial?.maxDiscountAmount != null ? String(initial.maxDiscountAmount) : ""
  );
  const [startDate, setStartDate] = useState(initial ? formatDateTimeLocal(initial.startDate) : "");
  const [endDate, setEndDate] = useState(initial ? formatDateTimeLocal(initial.endDate) : "");
  const [active, setActive] = useState(initial?.active ?? true);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedVariantIds, setSelectedVariantIds] = useState<number[]>(
    initial?.variantIds ?? []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts(0, 100)
      .then((page) => setProducts(page.content))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoadingProducts(false));
  }, []);

  function toggleVariant(variantId: number) {
    setSelectedVariantIds((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  }

  const isValid =
    name.trim().length >= 2 &&
    discountValue !== "" &&
    Number(discountValue) > 0 &&
    startDate !== "" &&
    endDate !== "" &&
    selectedVariantIds.length > 0;

  async function submit() {
    if (!isValid) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name,
        description,
        discountType,
        discountValue: Number(discountValue),
        maxDiscountAmount: maxDiscountAmount !== "" ? Number(maxDiscountAmount) : undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        active,
        variantIds: selectedVariantIds,
      };

      if (isEdit && promotionId) {
        await updatePromotion(promotionId, payload);
      } else {
        await createPromotion(payload);
      }
      router.push("/admin/promotions");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not save promotion");
    } finally {
      setSaving(false);
    }
  }

  if (loadingProducts) return <Loading />;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Promotion" : "Create Promotion"}
        </h1>
        <BackButton label="Back to list" path="/admin/promotions" />
      </div>

      <section className="space-y-5 rounded-xl border bg-white p-6">
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="w-full rounded-lg border p-2"
            placeholder="e.g. Summer Sale 10%"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded-lg border p-2"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Discount Type</label>
            <select
              className="w-full rounded-lg border p-2"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as PromotionDiscountType)}
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount (đ)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              {discountType === "PERCENTAGE" ? "Discount %" : "Discount Amount"}
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border p-2"
              placeholder={discountType === "PERCENTAGE" ? "e.g. 10" : "e.g. 100000"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Max Discount Amount (đ) — optional cap for %
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border p-2"
            placeholder="e.g. 500000"
            value={maxDiscountAmount}
            onChange={(e) => setMaxDiscountAmount(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Start Date</label>
            <input
              type="datetime-local"
              className="w-full rounded-lg border p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">End Date</label>
            <input
              type="datetime-local"
              className="w-full rounded-lg border p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Apply to Variants</label>
          <p className="mb-2 text-xs text-gray-400">
            Select the variants this promotion applies to.
          </p>
          <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border p-3">
            {products.map((p) => {
              const activeVariants = (p.variants ?? []).filter((v) => v.active);
              return (
                <div key={p.id} className="border-b py-1 last:border-b-0">
                  <p className="text-sm font-semibold text-gray-700">{p.name}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeVariants.map((v) => {
                      const checked = selectedVariantIds.includes(v.id);
                      return (
                        <label
                          key={v.id}
                          className={`flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                            checked ? "border-black bg-black text-white" : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={checked}
                            onChange={() => toggleVariant(v.id)}
                          />
                          {[v.color, v.size].filter(Boolean).join(" / ") || v.sku} ·{" "}
                          {Math.round(v.price).toLocaleString("vi-VN")}đ
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active
        </label>

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={!isValid || saving}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Promotion"}
          </button>
          <button
            onClick={() => router.push("/admin/promotions")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
