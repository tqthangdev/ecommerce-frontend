"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  getPromotions,
  deletePromotion,
  Promotion,
} from "@/services/admin/promotion.admin.service";
import Loading from "@/components/ui/Loading";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPromotions(await getPromotions());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-8 flex justify-between">
        <h1 className="text-3xl font-bold">Promotions</h1>
        <Link href="/admin/promotions/create" className="rounded-lg bg-black px-4 py-2 text-white">
          + Add Promotion
        </Link>
      </div>

      {promotions.length === 0 ? (
        <p className="rounded-xl border bg-white p-6 text-gray-500">No promotions yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Discount</th>
                <th className="p-4 text-left">Period</th>
                <th className="p-4 text-left">Variants</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">
                    {p.discountType === "PERCENTAGE"
                      ? `${p.discountValue}%`
                      : `${Number(p.discountValue).toLocaleString("vi-VN")} đ`}
                    {p.maxDiscountAmount != null &&
                      ` (max ${Number(p.maxDiscountAmount).toLocaleString("vi-VN")} đ)`}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {formatDate(p.startDate)} → {formatDate(p.endDate)}
                  </td>
                  <td className="p-4">{p.variantIds.length}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        p.active && !p.expired
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.active && !p.expired ? "Active" : p.expired ? "Expired" : "Inactive"}
                    </span>
                  </td>
                  <td className="space-x-3 p-4 text-center">
                    <Link
                      href={`/admin/promotions/${p.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(p)}
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
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Promotion"
        description={`Delete promotion "${deleteTarget?.name}"?`}
        confirmText="Delete"
        onConfirm={async () => {
          if (deleteTarget) await deletePromotion(deleteTarget.id);
          setDeleteTarget(null);
          load();
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
