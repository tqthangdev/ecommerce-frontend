"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { getProductBySlug } from "@/services/product.service";
import { Product } from "@/types/product";
import Loading from "@/components/ui/Loading";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProductBySlug(slug)
      .then((data) => setProduct(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Loading />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <ProductDetail product={product} />
    </main>
  );
}
