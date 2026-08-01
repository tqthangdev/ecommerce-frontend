"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getCategories } from "@/services/category.service";
import { Category } from "@/types/category";

function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const currentCategoryId = searchParams.get("categoryId") ?? "";

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
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  }

  function hasActiveFilter() {
    return currentCategoryId || minPrice || maxPrice;
  }

  return (
    <aside className="rounded-lg border p-5">
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
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded border p-2"
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded border p-2"
          />
          <button onClick={applyPrice} className="w-full rounded bg-black py-2 text-white">
            Apply
          </button>
        </div>
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
