"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";
import { getProducts } from "@/services/admin/product.admin.service";
import { Product } from "@/types/product";
import Loading from "@/components/ui/Loading";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProducts();
      setProducts(result.content);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/create" className="rounded-lg bg-black px-4 py-2 text-white">
          + Add Product
        </Link>
      </div>
      <ProductTable products={products} onDeleted={load} />
    </div>
  );
}
