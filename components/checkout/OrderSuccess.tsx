"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderSuccess() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <div className="py-20 text-center">
      <div className="mx-auto max-w-md rounded-xl border p-8">
        <h1 className="text-3xl font-bold">Order Success 🎉</h1>

        {orderNumber && (
          <p className="mt-3 text-sm text-gray-500">
            Order Number: <span className="font-mono font-semibold text-black">{orderNumber}</span>
          </p>
        )}

        <p className="mt-4 text-gray-500">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
