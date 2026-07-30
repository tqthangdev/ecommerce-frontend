"use client";

import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import ProductPagination from "./ProductPagination";
import { Product } from "@/types/product";
import { getProducts } from "@/services/product.service";
import Loading from "@/components/ui/Loading";

type Props = {
  keyword?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

export default function ProductList({
  keyword,
  categoryId,
  minPrice,
  maxPrice,
  sort,
  page,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProducts({
      keyword,
      categoryId: categoryId ? Number(categoryId) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort,
      page: Number(page ?? 1) - 1,
      size: 12,
    })
      .then((data) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        debugger
        let messeage = err?.message ?? "Failed to load products. Please try again."
        setError(messeage);
      })
      .finally(() => setLoading(false));
  }, [keyword, categoryId, minPrice, maxPrice, sort, page]);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <ProductGrid products={products} />
      {totalPages > 1 && (
        <ProductPagination
          currentPage={Number(page ?? 1)}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
