"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import BrandTable from "@/components/admin/BrandTable";
import { getBrands } from "@/services/admin/brand.admin.service";
import { Brand } from "@/types/product";
import Loading from "@/components/ui/Loading";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getBrands();
      setBrands(result);
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
        <h1 className="text-3xl font-bold">Brands</h1>
        <Link
          href="/admin/brands/create"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          + Add Brand
        </Link>
      </div>
      <BrandTable brands={brands} onDeleted={load} />
    </div>
  );
}