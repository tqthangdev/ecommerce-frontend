"use client";

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
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500">
              Select Options
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              shrink-0
              text-gray-500
              transition
              hover:text-black
            "
          >
            ✕
          </button>
        </div>

        <ProductVariantPicker
          product={product}
          autoSelectInStock
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
