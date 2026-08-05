"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart.store";
import { Product, ProductVariant } from "@/types/product";
import ProductVariantModal from "./ProductVariantModal";
import { ShoppingCart } from "lucide-react";

type Props = {
  product: Product;
  selectedVariant?: ProductVariant;
  compact?: boolean;
};

export default function AddToCartButton({
  product,
  selectedVariant,
  compact
}: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [openVariantModal, setOpenVariantModal] = useState(false);

  const hasVariants =
    product.variants && product.variants.length > 0;

  const currentVariant = selectedVariant;

  const stock =
    currentVariant?.stockQuantity ?? product.stockQuantity;

  const outOfStock = stock <= 0;

  function decrease() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increase() {
    setQuantity((prev) =>
      Math.min(stock, prev + 1)
    );
  }

  async function addToCart(variant?: ProductVariant) {
    const itemVariant = variant ?? currentVariant;

    const itemStock =
      itemVariant?.stockQuantity ?? product.stockQuantity;

    if (itemStock <= 0) return;

    await addItem({
      product,
      variant: itemVariant,
      quantity,
    });
  }

  function handleClick() {
    if (outOfStock) return;

    if (hasVariants && !currentVariant) {
      setOpenVariantModal(true);
      return;
    }

    addToCart();
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className={
          compact
            ? "group/add flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black text-white opacity-50 cursor-not-allowed transition-[width] duration-300 ease-out hover:w-32 hover:bg-gray-800"
            : "w-full rounded-lg bg-black px-8 py-3 font-semibold text-white transition opacity-50 cursor-not-allowed hover:bg-gray-800"
        }
      >
        {compact ? (
          <>
            <ShoppingCart
              size={18}
              className="shrink-0"
            />

            <span
              className="
                absolute translate-x-4 whitespace-nowrap
                ml-1
                text-sm opacity-0
                transition-all duration-300 ease-out
                group-hover/add:static
                group-hover/add:translate-x-0
                group-hover/add:opacity-100
              "
            >
              Out of stock
            </span>
          </>
        ) : (
          "Out of stock"
        )}
      </button>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {!hasVariants && (
          <div className="flex items-center gap-4">
            <button
              onClick={decrease}
              className="flex h-10 w-10 items-center justify-center rounded border hover:bg-gray-100"
            >
              -
            </button>

            <span className="text-lg font-semibold">
              {quantity}
            </span>

            <button
              onClick={increase}
              className="flex h-10 w-10 items-center justify-center rounded border hover:bg-gray-100"
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClick();
          }}
          className={
            compact
              ? "group/add flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black text-white transition-[width] duration-300 ease-out hover:w-32 hover:bg-gray-800"
              : "w-full rounded-lg bg-black px-8 py-3 font-semibold text-white transition hover:bg-gray-800"
          }
        >
          {compact ? (
            <>
              <ShoppingCart
                size={18}
                className="shrink-0"
              />

              <span
                className="
                  absolute translate-x-4 whitespace-nowrap
                  ml-1
                  text-sm opacity-0
                  transition-all duration-300 ease-out
                  group-hover/add:static
                  group-hover/add:translate-x-0
                  group-hover/add:opacity-100
                "
              >
                Add cart
              </span>
            </>
          ) : (
            "Add to cart"
          )}
        </button>

      </div>

      {hasVariants && (
        <ProductVariantModal
          product={product}
          open={openVariantModal}
          onClose={() => setOpenVariantModal(false)}
          onConfirm={(variant) => {
            addToCart(variant);
          }}
        />
      )}
    </>
  );
}