"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "popular";

  function changeSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "popular") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select
      value={sort}
      onChange={(e) => changeSort(e.target.value)}
      className="rounded border px-3 py-2"
    >
      <option value="popular">Popular</option>
      <option value="CREATED_AT,desc">Newest</option>
      <option value="PRICE,asc">Price: Low to High</option>
      <option value="PRICE,desc">Price: High to Low</option>
      <option value="NAME,asc">Name: A-Z</option>
    </select>
  );
}
