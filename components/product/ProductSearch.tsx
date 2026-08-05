"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");

  function searchProduct(value = keyword) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("keyword", value.trim());
    } else {
      params.delete("keyword");
    }

    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  }

  function clearSearch() {
    setKeyword("");
    searchProduct("");
  }

  return (
    <div className="flex gap-2">
      <div className="relative">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchProduct();
            }
          }}
          placeholder="Search products..."
          className="rounded border py-2 pl-4 pr-10"
        />

        {keyword && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <button
        onClick={() => searchProduct()}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Search
      </button>
    </div>
  );
}