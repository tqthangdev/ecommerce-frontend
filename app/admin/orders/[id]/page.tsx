"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  getAdminOrderById,
  updateOrderStatus,
} from "@/services/admin/order.admin.service";
import { Order } from "@/types/order";
import { getErrorMessage } from "@/lib/api";
import { msg } from "@/lib/messages";
import Loading from "@/components/ui/Loading";
import BackButton from "@/components/ui/BackButton";

const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPING"],
  SHIPPING: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: [],
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-500",
  RETURNED: "bg-red-100 text-red-800",
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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getAdminOrderById(id)
      .then((data) => {
        setOrder(data);
        setSelectedStatus(data.status);
      })
      .catch(() => setError(msg.loadOrderFailed))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!order) return;

    const previousStatus = order.status;

    setSelectedStatus(newStatus);
    setError("");
    setUpdating(true);

    try {
      const updated = await updateOrderStatus(order.id, newStatus);

      setOrder(updated);
      setSelectedStatus(updated.status);
    } catch (err) {
      setSelectedStatus(previousStatus);
      setError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <div className="p-8 text-red-500">
        {error || msg.orderNotFound}
      </div>
    );
  }

  const availableStatuses = [
    order.status,
    ...(STATUS_TRANSITIONS[order.status] ?? []),
  ];

  return (
    <div className="max-w-4xl space-y-6 p-8">
      <BackButton label="Back to list" path="/admin/orders" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order.orderNumber}
          </h1>

          <p className="text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <select
          value={selectedStatus}
          disabled={updating}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`rounded border px-3 py-2 font-medium ${STATUS_COLORS[order.status]}`}
        >
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Items */}
      <div className="space-y-4 rounded-xl border p-6">
        <h2 className="text-lg font-bold">
          Items
        </h2>

        {(order.items ?? []).map((item) => (
          <div
            key={item.id}
            className="flex gap-4"
          >
            {item.productImageUrl && (
              <img
                src={item.productImageUrl}
                alt={item.productName}
                className="h-16 w-16 rounded object-cover"
              />
            )}

            <div className="flex-1">
              <p className="font-medium">
                {item.productName}
              </p>

              {item.variantColor && (
                <p className="text-xs text-gray-500">
                  {item.variantColor} / {item.variantSize}
                </p>
              )}

              {item.variantSku && (
                <p className="font-mono text-xs text-gray-400">
                  SKU: {item.variantSku}
                </p>
              )}

              <p className="text-xs text-gray-500">
                x{item.quantity} ×{" "}
                {item.effectivePrice.toLocaleString("vi-VN")} đ
              </p>
            </div>

            <p className="font-semibold">
              {item.subtotal.toLocaleString("vi-VN")} đ
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 rounded-xl border p-6">
          <h2 className="text-lg font-bold">
            Order Summary
          </h2>

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>
              {order.subtotal.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {order.shippingFee === 0
                ? "FREE"
                : `${order.shippingFee.toLocaleString("vi-VN")} đ`}
            </span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>
                -{order.discountAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>
          )}

          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Total</span>
            <span>
              {order.totalAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border p-6">
          <h2 className="text-lg font-bold">
            Shipping Address
          </h2>

          <p className="font-medium">
            {order.shippingAddress.recipientName}
            {" · "}
            {order.shippingAddress.phone}
          </p>

          <p className="text-sm text-gray-500">
            {order.shippingAddress.fullAddress}
          </p>
        </div>
      </div>

      {/* Payment + Info */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 rounded-xl border p-6">
          <h2 className="text-lg font-bold">
            Payment
          </h2>

          <div className="flex justify-between text-sm">
            <span>Method</span>
            <span className="font-medium">
              {order.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Status</span>

            <span
              className={`font-medium ${
                order.paymentStatus === "PAID"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          {order.paymentReference && (
            <div className="flex justify-between text-sm">
              <span>Reference</span>

              <span className="font-mono text-xs">
                {order.paymentReference}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded-xl border p-6">
          <h2 className="text-lg font-bold">
            Info
          </h2>

          <div className="flex justify-between text-sm">
            <span>Coupon</span>

            <span className="font-mono">
              {order.couponCode || "—"}
            </span>
          </div>

          {order.notes && (
            <div className="text-sm">
              <span className="font-medium">
                Notes:{" "}
              </span>

              <span className="text-gray-500">
                {order.notes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}