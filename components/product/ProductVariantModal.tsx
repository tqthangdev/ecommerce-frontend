"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Product, ProductVariant } from "@/types/product";
import ProductVariantPicker from "./ProductVariant";

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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  if (!open) return null;

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

        {selectedVariant && (
          <div className="mb-4">
            <p className="text-lg font-bold text-red-600">
              {selectedVariant.price.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-sm text-gray-600">
              Stock: {selectedVariant.stockQuantity}
            </p>
          </div>
        )}

        <ProductVariantPicker
          product={product}
          autoSelectInStock
          onVariantChange={setSelectedVariant}
          onAdded={(variant) => {
            onConfirm(variant);
            onClose();
          }}
        />
      </div>
    </div>,
    document.body
  );
}
