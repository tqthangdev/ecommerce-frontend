"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getCategories } from "@/services/category.service";
import { Category } from "@/types/category";
import PriceRangeBar from "./PriceRangeBar";

const PRICE_RANGE = { min: 0, max: 50_000_000, step: 1_000_000 };

function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  const currentCategoryId = searchParams.get("categoryId") ?? "";
  const priceMin = Number(searchParams.get("minPrice") ?? PRICE_RANGE.min);
  const priceMax = Number(searchParams.get("maxPrice") ?? PRICE_RANGE.max);

  const [draftMin, setDraftMin] = useState(priceMin);
  const [draftMax, setDraftMax] = useState(priceMax);
  const [prevRange, setPrevRange] = useState(`${priceMin}-${priceMax}`);

  // Sync the draft with the URL when it changes (e.g. Clear filters).
  if (prevRange !== `${priceMin}-${priceMax}`) {
    setPrevRange(`${priceMin}-${priceMax}`);
    setDraftMin(priceMin);
    setDraftMax(priceMax);
  }

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats.filter((c) => c.active)))
      .catch(() => setCategories([]));
  }, []);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  }

  function applyPrice() {
    const params = new URLSearchParams(searchParams.toString());
    if (draftMin > PRICE_RANGE.min) params.set("minPrice", String(draftMin));
    else params.delete("minPrice");
    if (draftMax < PRICE_RANGE.max) params.set("maxPrice", String(draftMax));
    else params.delete("maxPrice");
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  }

  function hasActiveFilter() {
    return (
      currentCategoryId ||
      priceMin > PRICE_RANGE.min ||
      priceMax < PRICE_RANGE.max
    );
  }

  return (
    <aside className="h-fit self-start rounded-lg border p-5">
      <h2 className="mb-5 text-xl font-bold">Filter</h2>

      <div className="mb-6">
        <h3 className="mb-3 font-semibold">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={currentCategoryId === String(cat.id)}
                onChange={() => updateParam("categoryId", String(cat.id))}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Price</h3>
        <PriceRangeBar
          value={{ min: draftMin, max: draftMax }}
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          step={PRICE_RANGE.step}
          onChange={(min, max) => {
            setDraftMin(min);
            setDraftMax(max);
          }}
        />
        <button
          onClick={applyPrice}
          className="mt-3 w-full rounded bg-black py-2 text-white"
        >
          Apply
        </button>
      </div>

      {hasActiveFilter() && (
        <button
          className="mt-4 text-sm text-red-500 hover:text-red-700"
          onClick={() => {
            const params = new URLSearchParams();
            params.set("page", "1");
            router.push(`/products?${params.toString()}`);
          }}
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}

export default function ProductFilter() {
  return <FilterContent />;
}
