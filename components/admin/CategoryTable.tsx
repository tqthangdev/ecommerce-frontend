"use client";

import Link from "next/link";
import { Category } from "@/types/product";
import { deleteCategory } from "@/services/admin/category.admin.service";

type Props = {
  categories: Category[];
  onDeleted?: () => void;
};

export default function CategoryTable({ categories, onDeleted }: Props) {
  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteCategory(id);
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
          {categories.map((category) => (
            <tr key={category.id} className="border-t">
              <td className="p-4">{category.name}</td>
              <td className="p-4 text-gray-500">{category.slug}</td>
              <td className="p-4">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    category.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {category.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="space-x-3 p-4 text-center">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
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