"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SquareMinus, SquarePlus } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { Product, ProductVariant as ProductVariantType } from "@/types/product";
import VariantSelector from "./VariantSelector";

type Props = {
  product: Product;
  /** Controlled selected variant (ProductDetail) or undefined for internal state. */
  selectedVariant?: ProductVariantType;
  /** Notify the parent when the picked variant changes (for image/price display). */
  onVariantChange?: (variant: ProductVariantType | undefined) => void;
  /** When set, auto-pick the first in-stock variant (used in the modal). */
  autoSelectInStock?: boolean;
  /** Called right after a successful add-to-cart (used by the modal to close). */
  onAdded?: (variant: ProductVariantType) => void;
};

export default function ProductVariant({
  product,
  selectedVariant: controlledVariant,
  onVariantChange,
  autoSelectInStock = false,
  onAdded,
}: Props) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);

  const variants = (product.variants ?? []).filter((v) => v.active);

  const colors = Array.from(new Set(variants.map((v) => String(v.color))));

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Initialize from the controlled variant (or auto-pick the first in-stock
  // variant when requested).
  useEffect(() => {
    if (controlledVariant) {
      setSelectedColor(String(controlledVariant.color));
      setSelectedSize(String(controlledVariant.size));
      return;
    }

    const preferred = autoSelectInStock
      ? variants.filter((v) => v.stockQuantity > 0)
      : variants;
    const first = preferred[0] ?? variants[0];

    if (!first) {
      setSelectedColor("");
      setSelectedSize("");
      return;
    }

    setSelectedColor(String(first.color));
    setSelectedSize(String(first.size));
    notifyChange(first);
  }, [product.id]);

  const selectedVariant = variants.find(
    (v) =>
      String(v.color) === selectedColor &&
      String(v.size) === selectedSize
  );

  const stock = selectedVariant?.stockQuantity ?? 0;

  function notifyChange(next: ProductVariantType | undefined) {
    if (onVariantChange) onVariantChange(next);
  }

  function handleColorChange(color: string) {
    setSelectedColor(color);

    const firstVariant = variants.find(
      (v) => String(v.color) === color
    );

    const nextSize = firstVariant ? String(firstVariant.size) : "";
    setSelectedSize(nextSize);

    notifyChange(
      variants.find(
        (v) => String(v.color) === color && String(v.size) === nextSize
      )
    );
  }

  function handleSizeChange(size: string) {
    setSelectedSize(size);
    notifyChange(
      variants.find(
        (v) => String(v.color) === selectedColor && String(v.size) === size
      )
    );
  }

  function decrease() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increase() {
    setQuantity((prev) => Math.min(stock, prev + 1));
  }

  function handleQuantityInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;

    if (raw === "") {
      setQuantity(1);
      return;
    }

    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;

    setQuantity(Math.min(Math.max(parsed, 1), Math.max(stock, 1)));
  }

  async function addToCart() {
    if (!selectedVariant) return;
    if (selectedVariant.stockQuantity <= 0) return;

    if (!user) {
      router.push("/login?from=/products/" + product.slug);
      return;
    }

    const primaryImage =
      product.images?.find((img) => img.primary)?.imageUrl ??
      product.images?.[0]?.imageUrl;

    if (onAdded) onAdded(selectedVariant);

    await addItem({
      product: {
        ...product,
        imageUrl: selectedVariant.imageUrl || primaryImage,
      },
      variant: selectedVariant,
      quantity,
    });
  }

  return (
    <div className="space-y-4">
      <VariantSelector
        variants={variants}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onColorChange={handleColorChange}
        onSizeChange={handleSizeChange}
      />

      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Price:{" "}
          <span className="font-semibold text-red-600">
            {selectedVariant?.price.toLocaleString("vi-VN")} đ
          </span>
        </p>
        <p>
          Stock:{" "}
          <span className={stock > 0 ? "font-semibold text-green-600" : "font-semibold text-red-500"}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </span>
        </p>
      </div>

      <div className="border-t pt-4 relative flex items-center">
        <h3 className="mr-2 font-semibold">Quantity:</h3>
        <button
          onClick={decrease}
          disabled={quantity <= 1}
          type="button"
          aria-label="Decrease quantity"
          className="transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed"
        >
          <SquareMinus
            size={30}
            className={quantity <= 1 ? "cursor-not-allowed text-gray-300" : "text-gray-900"}
          />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={quantity}
          onChange={handleQuantityInput}
          aria-label="Quantity"
          className="shrink-0 border-0 bg-transparent text-base  font-normal text-gray-900 focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
          required
        />
        <button
          onClick={increase}
          disabled={stock <= 0}
          type="button"
          aria-label="Increase quantity"
          className="transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed"
        >
          <SquarePlus
            size={30}
            className={stock <= 0 ? "cursor-not-allowed text-gray-300" : "text-gray-900"}
          />
        </button>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-gray-600">Subtotal:</span>
        <span className="font-bold text-red-600">
          {((selectedVariant?.price ?? 0) * quantity).toLocaleString("vi-VN")} đ
        </span>
      </div>

      <button
        onClick={addToCart}
        disabled={!selectedVariant || stock <= 0}
        className="
          w-full rounded-lg
          bg-black px-4 py-3
          font-semibold text-white
          transition
          hover:bg-gray-800
          disabled:cursor-not-allowed
          disabled:bg-gray-300
        "
      >
        Add to Cart
      </button>
    </div>
  );
}
