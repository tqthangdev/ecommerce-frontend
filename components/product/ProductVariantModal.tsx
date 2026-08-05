"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Product, ProductVariant } from "@/types/product";
import VariantSelector from "./VariantSelector";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
  onConfirm: (variant: ProductVariant) => void;
};

export default function ProductVariantModal({
  product,
  open,
  onClose,
  onConfirm,
}: Props) {
  const variants = product.variants ?? [];

  const colors = Array.from(
    new Set(variants.map((v) => String(v.color)))
  );

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const sizes = Array.from(
    new Set(
      variants
        .filter((v) => String(v.color) === selectedColor)
        .map((v) => String(v.size))
    )
  );

  useEffect(() => {
    if (!open) return;

    const firstColor = colors[0] ?? "";

    setSelectedColor(firstColor);

    const firstSize =
      variants.find(
        (v) => String(v.color) === firstColor
      )?.size ?? "";

    setSelectedSize(String(firstSize));
  }, [open, product.id]);

  if (!open) return null;

  const selectedVariant = variants.find(
    (v) =>
      String(v.color) === selectedColor &&
      String(v.size) === selectedSize
  );

  function handleColorChange(color: string) {
    setSelectedColor(color);

    const firstVariant = variants.find(
      (v) => String(v.color) === color
    );

    setSelectedSize(
      firstVariant ? String(firstVariant.size) : ""
    );
  }

  function handleConfirm() {
    if (!selectedVariant) return;
    if (selectedVariant.stockQuantity <= 0) return;

    onConfirm(selectedVariant);
    onClose();
  }

  return createPortal(
    <div
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/50
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-md
          rounded-xl
          bg-white
          p-6
          shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Select Options
          </h2>

          <button
            onClick={onClose}
            className="
              text-gray-500
              transition
              hover:text-black
            "
          >
            ✕
          </button>
        </div>

        <VariantSelector
          variants={variants}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={handleColorChange}
          onSizeChange={setSelectedSize}
        />

        {selectedVariant && (
          <p className="my-4 text-sm text-gray-600">
            Stock: {selectedVariant.stockQuantity}
          </p>
        )}

        <button
          onClick={handleConfirm}
          disabled={
            !selectedVariant ||
            selectedVariant.stockQuantity <= 0
          }
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
    </div>,
    document.body
  );
}