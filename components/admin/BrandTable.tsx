"use client";

import { useState } from "react";
import Link from "next/link";
import { Brand } from "@/types/product";
import { deleteBrand } from "@/services/admin/brand.admin.service";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Props = {
  brands: Brand[];
  onDeleted?: () => void;
};

export default function BrandTable({ brands, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  function handleDelete(id: number, name: string) {
    setSelectedBrand({
      id,
      name,
      slug: "",
      active: true,
    });
    setOpen(true);
  }

  async function confirmDelete() {
    if (!selectedBrand) return;

    try {
      setLoading(true);

      await deleteBrand(selectedBrand.id);

      setOpen(false);
      setSelectedBrand(null);

      onDeleted?.();
    } finally {
      setLoading(false);
    }
  }

  function closeDialog() {
    if (loading) return;

    setOpen(false);
    setSelectedBrand(null);
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Slug</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-t">
                <td className="p-4">{brand.name}</td>

                <td className="p-4 text-gray-500">{brand.slug}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      brand.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {brand.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="space-x-3 p-4 text-center">
                  <Link
                    href={`/admin/brands/${brand.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={open}
        title="Delete Brand"
        description={`Delete "${selectedBrand?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </>
  );
}
