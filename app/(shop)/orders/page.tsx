"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/services/order.service";
import { Order } from "@/types/order";
import { PageResponse } from "@/types/api";
import Loading from "@/components/ui/Loading";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-500",
  REFUNDED: "bg-red-100 text-red-800",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [data, setData] = useState<PageResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getOrders(page, 10)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Loading />;

  if (!data || data.empty) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">You have no orders yet.</p>
        <Link href="/products" className="mt-4 inline-block text-blue-600 hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>

      <div className="space-y-4">
        {(data?.content ?? []).map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-xl border p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-semibold text-sm">{order.orderNumber}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formatDate(order.createdAt)}</span>
              <span className="font-semibold text-black">
                {order.totalAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto">
              {order.items.slice(0, 4).map((item, idx) => (
                item.productImageUrl && (
                  <img
                    key={idx}
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                )
              ))}
              {order.items.length > 4 && (
                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                  +{order.items.length - 4}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={data.first}
            className="px-4 py-2 rounded border disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">
            Page {data.page + 1} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
            className="px-4 py-2 rounded border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
