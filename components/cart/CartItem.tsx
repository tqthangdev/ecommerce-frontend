"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart.store";
import { CartItem as CartItemType } from "@/types/cart";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Props = {
  item: CartItemType;
};

function getThumbnail(item: CartItemType): string {
  if (item.variant.imageUrl) {
    return item.variant.imageUrl;
  }

  if (item.product.imageUrl) {
    return item.product.imageUrl;
  }

  return "/images/placeholder.jpg";
}

export default function CartItem({ item }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const removeItem = useCartStore((state) => state.removeItem);

  const product = item.product;
  const price = item.variant.price;
  const thumbnail = getThumbnail(item);

  function handleRemove() {
    removeItem(item.variant.id);
    setShowConfirm(false);
  }

  return (
    <>
    <div className="flex items-center gap-5 rounded-xl border p-5">
      <div className="w-[100px] h-[100px] flex justify-center"><img
        src={thumbnail}
        alt={product.name}
        // width={100}
        // height={100}
        className="max-w-[100px] max-h-[100px] rounded-lg object-cover"
      /></div>

      <div className="flex-1">
        <h3 className="font-semibold">{product.name}</h3>

        {item.variant.color && (
          <p className="mt-1 text-sm text-gray-500">
            {item.variant.color}
            {item.variant.size ? ` / ${item.variant.size}` : ""}
          </p>
        )}

        <p className="mt-2 text-red-600">{price.toLocaleString("vi-VN")} đ</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => decrease(item.variant.id)}
            className="h-8 w-8 rounded border"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => increase(item.variant.id)}
            className="h-8 w-8 rounded border"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <p className="mb-4 font-semibold">{(price * item.quantity).toLocaleString("vi-VN")} đ</p>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
    <ConfirmDialog
      open={showConfirm}
      title="Remove product"
      description={`Remove "${product.name}" from cart?`}
      confirmText="Yes"
      cancelText="No"
      onConfirm={handleRemove}
      onCancel={() => setShowConfirm(false)}
    />
    </>
  );
}
