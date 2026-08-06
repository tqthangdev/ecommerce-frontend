"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
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
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [openVariantModal, setOpenVariantModal] = useState(false);

  const activeVariants =
    product.variants && product.variants.length > 0
      ? product.variants.filter((v) => v.active)
      : [];

  const hasVariants = activeVariants.length > 0;

  const currentVariant =
    selectedVariant ??
    (activeVariants.length === 1 ? activeVariants[0] : undefined);

  // Out of stock only applies when we already have a concrete variant to judge.
  // When the product has multiple variants and none is selected yet, we must open
  // the variant modal instead of disabling the button.
  const stock = currentVariant?.stockQuantity ?? 0;

  const outOfStock =
    currentVariant !== undefined && stock <= 0;

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

    const itemStock = itemVariant?.stockQuantity ?? 0;

    if (itemStock <= 0) return;

    if (!user) {
      router.push("/login?from=/products/" + product.slug);
      return;
    }

    const primaryImage =
      product.images?.find((img) => img.primary)?.imageUrl ??
      product.images?.[0]?.imageUrl;

    await addItem({
      product: {
        ...product,
        imageUrl: itemVariant?.imageUrl || primaryImage,
      },
      variant: itemVariant!,
      quantity,
    });
  }

  function handleClick() {
    if (hasVariants && !currentVariant) {
      setOpenVariantModal(true);
      return;
    }

    if (outOfStock) return;

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
        {!compact && (!currentVariant || activeVariants.length <= 1) && (
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