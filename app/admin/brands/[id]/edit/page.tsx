"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBrandById } from "@/services/admin/brand.admin.service";
import { Brand } from "@/types/product";
import BrandForm from "@/components/admin/BrandForm";
import Loading from "@/components/ui/Loading";

export default function EditBrandPage() {
  const { id } = useParams<{ id: string }>();
  const brandId = Number(id);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrandById(brandId)
      .then(setBrand)
      .finally(() => setLoading(false));
  }, [brandId]);

  if (loading) return <Loading />;
  if (!brand) return <p className="p-10">Brand not found</p>;

  return <BrandForm initial={brand} brandId={brandId} />;
}
