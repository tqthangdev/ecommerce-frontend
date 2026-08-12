"use client";

import { useQuery } from "@tanstack/react-query";

import { msg } from "@/lib/messages";
import Loading from "@/components/ui/Loading";

import { getProducts } from "@/services/product.service";
import { Product } from "@/types/product";

type Props = {
  keyword?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  size?: number;
  children: (products: Product[]) => React.ReactNode;
};

export default function ProductRawList({
  keyword,
  categoryId,
  minPrice,
  maxPrice,
  sort,
  page,
  size = 8,
  children,
}: Props) {
  const query = useQuery({
    queryKey: ["products", { keyword, categoryId, minPrice, maxPrice, sort, page, size }],
    queryFn: () =>
      getProducts({
        keyword,
        categoryId: categoryId ? Number(categoryId) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
        page: Number(page ?? 1) - 1,
        size,
      }),
  });

  const products = query.data?.content ?? [];
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
    return null;
  }

  return <>{children(products)}</>;
}