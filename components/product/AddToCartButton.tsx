"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart.store";
import { Product, ProductVariant } from "@/types/product";

type Props = {
  product: Product;
  selectedVariant?: ProductVariant;
};

export default function AddToCartButton({ product, selectedVariant }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const stock = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const outOfStock = stock <= 0;

  function decrease() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increase() {
    setQuantity((prev) => Math.min(stock, prev + 1));
  }

  async function handleAddCart() {
    if (outOfStock) return;
    await addItem({ product, variant: selectedVariant, quantity });
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className="cursor-not-allowed rounded-lg bg-gray-300 px-8 py-3 font-semibold text-gray-500"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={decrease}
          className="flex h-10 w-10 items-center justify-center rounded border hover:bg-gray-100"
        >
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          onClick={increase}
          className="flex h-10 w-10 items-center justify-center rounded border hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddCart}
        className="w-full rounded-lg bg-black px-8 py-3 font-semibold text-white transition hover:bg-gray-800"
      >
        Add to cart
      </button>
    </div>
  );
}
