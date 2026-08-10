"use client";

import { useState } from "react";
import { SquareMinus, SquarePlus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { CartItem as CartItemType } from "@/types/cart";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Props = {
  item: CartItemType;
  selected?: boolean;
  onToggleSelect?: (variantId: number) => void;
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

export default function CartItem({ item, selected = false, onToggleSelect }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const product = item.product;
  const price = item.variant.price;
  const thumbnail = getThumbnail(item);

  const stock = item.variant.stockQuantity;
  const hasStockLimit = stock > 0;
  const maxQuantity = hasStockLimit ? stock : undefined;

  function handleRemove() {
    removeItem(item.variant.id);
    setShowConfirm(false);
  }

  function handleQuantityInput(value: string) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    if (parsed < 1) {
      // Debounce-friendly: only send when the value is a real number >= 1.
      return;
    }

    setQuantity(item.variant.id, hasStockLimit ? Math.min(parsed, stock) : parsed);
  }

  return (
    <>
    <div
      onClick={() => onToggleSelect?.(item.variant.id)}
      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
        selected
          ? "border-red-600 shadow-md ring-2 ring-red-200"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect?.(item.variant.id)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select ${product.name}`}
        className="h-5 w-5 shrink-0 cursor-pointer accent-black"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
        disabled={!selected}
        type="button"
        aria-label={`Remove ${product.name}`}
        className="shrink-0 transition-colors enabled:hover:text-red-600 disabled:cursor-not-allowed"
      >
        <Trash2
          size={20}
          className={selected ? "text-gray-900" : "text-gray-300"}
        />
      </button>

      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100"><img
        src={thumbnail}
        alt={product.name}
        className="max-h-full max-w-full object-cover"
      /></div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{product.name}</h3>

        {item.variant.color && (
          <p className="mt-0.5 text-sm text-gray-500">
            {item.variant.color}
            {item.variant.size ? ` / ${item.variant.size}` : ""}
          </p>
        )}

        <p className="mt-1 text-red-600">{price.toLocaleString("vi-VN")} đ</p>
      </div>

      <div className="flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            decrease(item.variant.id);
          }}
          disabled={item.quantity <= 1}
          type="button"
          aria-label="Decrease quantity"
          className="transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed"
        >
          <SquareMinus
            size={24}
            className={item.quantity <= 1 ? "text-gray-300" : "text-gray-900"}
          />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={item.quantity}
          onChange={(e) => handleQuantityInput(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Quantity"
          className="shrink-0 border-0 bg-transparent text-base font-normal text-gray-900 focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
          required
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            increase(item.variant.id);
          }}
          disabled={hasStockLimit && item.quantity >= stock}
          type="button"
          aria-label="Increase quantity"
          className="transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed"
        >
          <SquarePlus
            size={24}
            className={
              hasStockLimit && item.quantity >= stock
                ? "text-gray-300"
                : "text-gray-900"
            }
          />
        </button>
      </div>

      <div className="w-44 shrink-0 text-right">
        <p className="text-red-600 font-semibold">{(price * item.quantity).toLocaleString("vi-VN")} đ</p>
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
