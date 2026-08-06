"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCategoryById } from "@/services/admin/category.admin.service";
import { Category } from "@/types/product";
import CategoryForm from "@/components/admin/CategoryForm";
import Loading from "@/components/ui/Loading";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryById(categoryId)
      .then(setCategory)
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <Loading />;
  if (!category) return <p className="p-10">Category not found</p>;

  return <CategoryForm initial={category} categoryId={categoryId} />;
}
