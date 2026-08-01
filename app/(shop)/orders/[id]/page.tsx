"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrderById, cancelOrder as cancelOrderApi } from "@/services/order.service";
import { getErrorMessage } from "@/lib/api";
import { Order } from "@/types/order";
import Loading from "@/components/ui/Loading";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-500",
  REFUNDED: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-orange-100 text-orange-800",
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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then(setOrder)
      .catch(() => setError("Failed to load order."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCancel() {
    setCancelling(true);
    setError("");
    try {
      const updated = await cancelOrderApi(id);
      setOrder(updated);
      setShowCancelDialog(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <Loading />;
  if (error && !order) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Link href="/orders" className="text-sm text-gray-500 hover:text-black">
        ← Back to orders
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order?.orderNumber}</h1>
          <p className="text-sm text-gray-500">{order && formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          {order?.cancellable && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="rounded border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Cancel Order
            </button>
          )}
          <div className="flex flex-col items-end gap-1">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${order ? STATUS_COLORS[order.status] : ""}`}
            >
              {order?.status}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${order ? PAYMENT_STATUS_COLORS[order.paymentStatus] : ""}`}
            >
              Payment: {order?.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500">{error}</p>
      )}

      {/* Items */}
      <div className="space-y-4 rounded-xl border p-6">
        <h2 className="text-lg font-bold">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4">
            {item.productImageUrl && (
              <img
                src={item.productImageUrl}
                alt={item.productName}
                className="h-16 w-16 rounded object-cover"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              {item.variantColor && (
                <p className="text-xs text-gray-500">
                  {item.variantColor} / {item.variantSize}
                </p>
              )}
              <p className="text-xs text-gray-500">x{item.quantity}</p>
            </div>
            <p className="font-semibold">{item.subtotal.toLocaleString("vi-VN")} đ</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-2 rounded-xl border p-6">
        <h2 className="mb-3 text-lg font-bold">Order Summary</h2>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{order.subtotal.toLocaleString("vi-VN")} đ</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {order.shippingFee === 0 ? "FREE" : `${order.shippingFee.toLocaleString("vi-VN")} đ`}
          </span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
            <span>-{order.discountAmount.toLocaleString("vi-VN")} đ</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Total</span>
          <span>{order.totalAmount.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="rounded-xl border p-6">
        <h2 className="mb-3 text-lg font-bold">Shipping Address</h2>
        <p className="font-medium">
          {order.shippingAddress.recipientName} · {order.shippingAddress.phone}
        </p>
        <p className="text-sm text-gray-500">{order.shippingAddress.fullAddress}</p>
      </div>

      {/* Payment */}
      <div className="rounded-xl border p-6">
        <h2 className="mb-3 text-lg font-bold">Payment</h2>
        <div className="flex justify-between text-sm">
          <span>Method</span>
          <span className="font-medium">{order.paymentMethod}</span>
        </div>
        {order.paymentReference && (
          <div className="mt-1 flex justify-between text-sm">
            <span>Reference</span>
            <span className="font-mono text-xs">{order.paymentReference}</span>
          </div>
        )}
      </div>

      {order.notes && (
        <div className="rounded-xl border p-6">
          <h2 className="mb-2 text-lg font-bold">Notes</h2>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}

      <ConfirmDialog
        open={showCancelDialog}
        title="Cancel Order"
        description={`Are you sure you want to cancel order #${order.orderNumber}? This action cannot be undone.`}
        confirmText="Yes"
        cancelText="No"
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
}
