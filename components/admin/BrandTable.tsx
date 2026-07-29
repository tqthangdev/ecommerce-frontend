"use client";

import Link from "next/link";
import { Brand } from "@/types/product";
import { deleteBrand } from "@/services/admin/brand.admin.service";

type Props = {
  brands: Brand[];
  onDeleted?: () => void;
};

export default function BrandTable({ brands, onDeleted }: Props) {
  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteBrand(id);
    onDeleted?.();
  }

  return (
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
                    brand.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {brand.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="space-x-3 p-4 text-center">
                <Link
                  href={`/admin/brands/${brand.id}/edit`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(brand.id, brand.name)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}