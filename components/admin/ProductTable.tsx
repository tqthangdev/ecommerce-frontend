"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { deleteProduct } from "@/services/admin/product.admin.service";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Props = {
  products: Product[];
  onDeleted?: () => void;
};

export default function ProductTable({
  products,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);

  function handleDelete(id: number, name: string) {
    setSelectedProduct({ id, name });
    setOpen(true);
  }

  async function confirmDelete() {
    if (!selectedProduct) return;

    try {
      setLoading(true);

      await deleteProduct(selectedProduct.id);

      setOpen(false);
      setSelectedProduct(null);

      onDeleted?.();
    } finally {
      setLoading(false);
    }
  }

  function closeDialog() {
    if (loading) return;

    setOpen(false);
    setSelectedProduct(null);
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.basePrice.toLocaleString("vi-VN")} ₫
                </td>

                <td className="p-4">
                  {product.stockQuantity}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      product.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="space-x-3 p-4 text-center">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(product.id, product.name)
                    }
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
        title="Delete Product"
        description={`Delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </>
  );
}