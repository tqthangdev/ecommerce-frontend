"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import CategoryTable from "@/components/admin/CategoryTable";
import { getCategories } from "@/services/admin/category.admin.service";
import { Category } from "@/types/product";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCategories();
      setCategories(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/create"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          + Add Category
        </Link>
      </div>
      <CategoryTable categories={categories} onDeleted={load} />
    </div>
  );
}