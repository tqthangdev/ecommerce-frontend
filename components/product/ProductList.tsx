"use client";

import { useQuery } from "@tanstack/react-query";
import ProductGrid from "./ProductGrid";
import ProductPagination from "./ProductPagination";
import { getProducts } from "@/services/product.service";
import { msg } from "@/lib/messages";
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
  const query = useQuery({
    queryKey: ["products", { keyword, categoryId, minPrice, maxPrice, sort, page, size: 12 }],
    queryFn: () =>
      getProducts({
        keyword,
        categoryId: categoryId ? Number(categoryId) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
        page: Number(page ?? 1) - 1,
        size: 12,
      }),
  });

  const products = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 0;
  const loading = query.isPending;
  const error = query.error;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-red-500">{error?.message ?? msg.loadProductsFailed}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
      <h2 className="text-xl font-semibold">No products found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try changing your filters or search keywords.
      </p>
    </div>
    );
  }

  return (
    <>
      <ProductGrid products={products} />
      {totalPages > 1 && (
        <ProductPagination currentPage={Number(page ?? 1)} totalPages={totalPages} />
      )}
    </>
  );
}
