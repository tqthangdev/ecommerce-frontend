"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import VariantSelector from "./VariantSelector";
import { Product, ProductVariant } from "@/types/product";
import BackButton from "@/components/ui/BackButton";

type Props = {
  product: Product;
};

function getMainImage(
  product: Product,
  selectedVariant?: ProductVariant
): string {
  if (selectedVariant?.imageUrl) return selectedVariant.imageUrl;

  const primary = product.images?.find((img) => img.primary);

  if (primary?.imageUrl) return primary.imageUrl;

  if (product.images?.[0]?.imageUrl) return product.images[0].imageUrl;

  return "/images/placeholder.jpg";
}

export default function ProductDetail({ product }: Props) {
  const variants = (product.variants ?? []).filter((v) => v.active);
  const hasVariants = variants.length > 0;

  const colors = Array.from(
    new Set(variants.map((v) => String(v.color)))
  );

  const [selectedColor, setSelectedColor] = useState(
    colors[0] ?? ""
  );

  const sizes = Array.from(
    new Set(
      variants
        .filter((v) => String(v.color) === selectedColor)
        .map((v) => String(v.size))
    )
  ).sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);

    return Number.isNaN(na) || Number.isNaN(nb)
      ? a.localeCompare(b)
      : na - nb;
  });

  const [selectedSize, setSelectedSize] = useState(
    sizes[0] ?? ""
  );

  const selectedVariant = hasVariants
    ? variants.find(
        (v) =>
          String(v.color) === selectedColor &&
          String(v.size) === selectedSize
      )
    : undefined;

  const mainImage = getMainImage(product, selectedVariant);

  const stock = selectedVariant?.stockQuantity ?? 0;

  const price = selectedVariant?.price ?? 0;

  const stockLabel =
    stock > 0 ? `${stock} in stock` : "Out of stock";

  const stockColor =
    stock > 0 ? "text-green-600" : "text-red-500";

  return (
    <>
      <BackButton className="mb-3" label="Back" path="/products" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 p-8">
          <img
            src={mainImage}
            alt={product.name}
            width={500}
            height={500}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <div className="flex flex-wrap gap-2">
            {product.category?.name && (
              <span className="rounded bg-gray-100 px-3 py-1 text-sm">
                {product.category.name}
              </span>
            )}

            {product.brand?.name && (
              <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800">
                {product.brand.name}
              </span>
            )}

            <span
              className={`rounded px-3 py-1 text-sm ${stockColor}`}
            >
              {stockLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-red-600">
              {price.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <p className="leading-7 text-gray-600">
            {product.description}
          </p>

          {hasVariants && (
            <div className="border-t pt-4">
              <VariantSelector
                variants={variants}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={(color) => {
                  setSelectedColor(color);

                  const firstVariant = variants.find(
                    (v) => String(v.color) === color
                  );

                  setSelectedSize(
                    firstVariant
                      ? String(firstVariant.size)
                      : ""
                  );
                }}
                onSizeChange={setSelectedSize}
              />
            </div>
          )}

          <AddToCartButton
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>
    </>
  );
}