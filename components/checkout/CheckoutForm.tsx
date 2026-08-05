"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { checkout } from "@/services/order.service";
import { getAddresses, createAddress } from "@/services/address.service";
import { getErrorMessage } from "@/lib/api";
import { Address, CheckoutRequest, PaymentMethod } from "@/types/order";
import { AddressRequest } from "@/types/address";
import { getThumbnail } from "@/components/product/ProductCard";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.effectivePrice;
    return sum + price * item.quantity;
  }, 0);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressRequest>({
    recipientName: "",
    phone: "",
    provinceCode: "",
    provinceName: "",
    districtCode: "",
    districtName: "",
    wardCode: "",
    wardName: "",
    streetAddress: "",
    setAsDefault: true,
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState(false);

  useEffect(() => {
    getAddresses()
      .then(setAddresses)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const defaultAddr = addresses.find((a) => a.defaultAddress);
    if (defaultAddr && !selectedAddressId) {
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses]);

  function scrollTop() {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      scrollTop();
      return;
    }

    setError("");
    setAddressError(false);
    setLoading(true);

    try {
      let addressId = selectedAddressId;

      if (showNewAddress) {
        const created = await createAddress(newAddress);
        addressId = created.id;
      }

      if (!addressId) {
        setError("Please select or add a shipping address.");
        setAddressError(true);
        scrollTop();
        return;
      }

      const payload: CheckoutRequest = {
        addressId,
        paymentMethod,
        notes: notes || undefined,
        couponCode: couponCode || undefined,
      };

      const result = await checkout(payload);

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      clear();
      router.push(`/checkout/success?order=${result.orderNumber}`);

    } catch (err) {
      console.log("Checkout error:", err);
      setError(getErrorMessage(err));
      scrollTop();

    } finally {
      setLoading(false);
    }
  }

  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 outline-none">
          {error}
        </p>
      )}

      {/* Cart Items */}
      <div className="space-y-4 rounded-xl border p-6">
        <h2 className="text-xl font-bold">Order Items</h2>
        {items.map((item) => (
          <div key={`${item.product.id}-${item.variant?.id}`} className="flex gap-4">
            <img
              src={getThumbnail(item.product)}
              alt={item.product.name}
              className="h-16 w-16 rounded object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.product.name}</p>
              {item.variant && (
                <p className="text-xs text-gray-500">
                  {item.variant.color} / {item.variant.size}
                </p>
              )}
              <p className="text-xs text-gray-500">x{item.quantity}</p>
            </div>
            <p className="text-sm font-semibold">
              {(
                (item.variant?.price ?? item.product.effectivePrice) * item.quantity
              ).toLocaleString("vi-VN")}{" "}
              đ
            </p>
          </div>
        ))}
      </div>

      {/* Addresses */}
      <div
        className={`space-y-4 rounded-xl border p-6 outline-none ${
          addressError
            ? "border-red-500 bg-red-50"
            : "border-black"
        }`}
      >
        <h2 className="text-xl font-bold">Shipping Address</h2>

        {!showNewAddress && addresses.length > 0 && (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                  selectedAddressId === addr.id
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => {
                    setSelectedAddressId(addr.id);
                    setAddressError(false);
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">
                    {addr.recipientName} · {addr.phone}
                  </p>
                  <p className="text-sm text-gray-500">{addr.fullAddress}</p>
                </div>
                {addr.label && (
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs">{addr.label}</span>
                )}
              </label>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowNewAddress(!showNewAddress)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showNewAddress ? "Use existing address" : "+ Add new address"}
        </button>

        {showNewAddress && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <input
              placeholder="Recipient name"
              value={newAddress.recipientName}
              onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
              required={showNewAddress}
              className="col-span-2 rounded border p-3"
            />
            <input
              placeholder="Phone"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              required={showNewAddress}
              className="col-span-2 rounded border p-3"
            />
            <input
              placeholder="City / Province"
              value={newAddress.provinceName}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  provinceName: e.target.value,
                  provinceCode: e.target.value,
                })
              }
              required={showNewAddress}
              className="rounded border p-3"
            />
            <input
              placeholder="District"
              value={newAddress.districtName}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  districtName: e.target.value,
                  districtCode: e.target.value,
                })
              }
              required={showNewAddress}
              className="rounded border p-3"
            />
            <input
              placeholder="Ward"
              value={newAddress.wardName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, wardName: e.target.value, wardCode: e.target.value })
              }
              required={showNewAddress}
              className="rounded border p-3"
            />
            <input
              placeholder="Street address"
              value={newAddress.streetAddress}
              onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
              required={showNewAddress}
              className="col-span-2 rounded border p-3"
            />
          </div>
        )}
      </div>

      {/* Coupon */}
      <div className="space-y-3 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Coupon</h2>
          <span className="text-xs text-gray-500">
            Coming soon
          </span>
        </div>

        <div className="flex gap-2 opacity-50">
          <input
            placeholder="Coupon code"
            value={couponCode}
            disabled
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 rounded border p-3 bg-gray-100 cursor-not-allowed"
          />
          <button
            disabled
            className="rounded bg-gray-300 px-4 text-white cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3 rounded-xl border p-6">
        <h2 className="text-xl font-bold">Payment Method</h2>
        <div className="space-y-2">
          {(["COD", "VNPAY", "MOMO"] as PaymentMethod[]).map((method) => {
            const disabled = method !== "COD";

            return (
              <label
                key={method}
                className={`flex items-center gap-3 rounded-lg border p-4 transition ${
                  paymentMethod === method
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  disabled={disabled}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />

                <span className="font-medium">
                  {method}
                  {disabled && (
                    <span className="ml-2 text-xs text-gray-500">
                      (Coming soon)
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-3 rounded-xl border p-6">
        <h2 className="text-xl font-bold">Order Notes</h2>
        <textarea
          placeholder="Optional notes for your order..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded border p-3"
        />
      </div>

      {/* Summary */}
      <div className="space-y-3 rounded-xl border bg-gray-50 p-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString("vi-VN")} đ</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? "FREE" : `${shippingFee.toLocaleString("vi-VN")} đ`}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Total</span>
          <span>{total.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full rounded-lg bg-black py-4 font-bold text-white disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
