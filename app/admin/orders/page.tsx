"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "@/services/admin/order.admin.service";
import { Order } from "@/types/order";
import { PageResponse } from "@/types/api";
import { getErrorMessage } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import Link from "next/link";

const ALL_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED", "REFUNDED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-500",
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

export default function AdminOrdersPage() {
  const [data, setData] = useState<PageResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAdminOrders(page, 10, statusFilter || undefined, keyword || undefined)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [page, statusFilter, keyword]);

  async function handleStatusChange(orderId: number, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setData((prev) => ({
        ...(prev ?? {}),
        content: (prev?.content ?? []).map((o) => (o.id === orderId ? updated : o)),
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <input
          placeholder="Search order number..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
          className="rounded border px-3 py-2 w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded border px-3 py-2"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {loading ? (
        <Loading />
      ) : !data || data.empty ? (
        <p className="text-gray-500 py-10 text-center">No orders found.</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b font-medium text-left text-gray-500">
                <th className="pb-3 pr-4">Order #</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.content ?? []).map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono font-semibold hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{order.shippingAddress.recipientName}</div>
                    <div className="text-xs text-gray-500">{order.shippingAddress.phone}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3 pr-4 font-semibold">{order.totalAmount.toLocaleString("vi-VN")} đ</td>
                  <td className="py-3 pr-4 text-xs">
                    <div>{order.paymentMethod}</div>
                    <div className={`font-medium ${order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"}`}>
                      {order.paymentStatus}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`rounded border px-2 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={data.first}
                className="px-4 py-2 rounded border disabled:opacity-40">
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {data.page + 1} of {data.totalPages}
              </span>
              <button onClick={() => setPage((p) => p + 1)} disabled={data.last}
                className="px-4 py-2 rounded border disabled:opacity-40">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
