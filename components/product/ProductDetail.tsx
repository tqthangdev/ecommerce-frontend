"use client";

import { useState } from "react";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { Product, ProductVariant } from "@/types/product";

type Props = {
  product: Product;
};

function getMainImage(product: Product, selectedVariant?: ProductVariant): string {
  if (selectedVariant?.imageUrl) return selectedVariant.imageUrl;
  const primary = product.images?.find((img) => img.primary);
  if (primary?.imageUrl) return primary.imageUrl;
  if (product.images?.[0]?.imageUrl) return product.images[0].imageUrl;
  return "/images/placeholder.jpg";
}

function groupBy(items: ProductVariant[], key: keyof ProductVariant): ProductVariant[] {
  const seen = new Set();
  return items.filter((v) => {
    const val = v[key];
    if (val === null || val === undefined) return false;
    if (seen.has(String(val))) return false;
    seen.add(String(val));
    return true;
  });
}

export default function ProductDetail({ product }: Props) {
  const hasVariants = product.variants && product.variants.length > 0;
  const colors = hasVariants ? groupBy(product.variants, "color") : [];
  const sizes = hasVariants ? groupBy(product.variants, "size") : [];

  const [selectedColor, setSelectedColor] = useState(
    colors.length > 0 ? String(colors[0].color) : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? String(sizes[0].size) : ""
  );

  const selectedVariant = hasVariants
    ? product.variants.find(
        (v) =>
          String(v.color) === selectedColor &&
          String(v.size) === selectedSize
      )
    : undefined;

  const mainImage = getMainImage(product, selectedVariant);
  const hasDiscount = product.discountPercent > 0;
  const stock = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const price = selectedVariant?.price ?? product.effectivePrice;
  const stockLabel = stock > 0 ? `${stock} in stock` : "Out of stock";
  const stockColor = stock > 0 ? "text-green-600" : "text-red-500";

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div className="flex items-center justify-center rounded-xl bg-gray-100 p-8">
        <Image
          src={mainImage}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col justify-center space-y-6">
        <h1 className="text-4xl font-bold">{product.name}</h1>

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
          <span className={`rounded px-3 py-1 text-sm ${stockColor}`}>
            {stockLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-red-600">
            {price.toLocaleString("vi-VN")} đ
          </span>
          {hasDiscount && (
            <span className="text-lg text-gray-400 line-through">
              {product.basePrice.toLocaleString("vi-VN")} đ
            </span>
          )}
        </div>

        <p className="leading-7 text-gray-600">{product.description}</p>

        {hasVariants && (
          <div className="space-y-4 border-t pt-4">
            {colors.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">
                  Color:{" "}
                  <span className="font-normal">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((v) => (
                    <button
                      key={String(v.color)}
                      onClick={() => setSelectedColor(String(v.color))}
                      className={`rounded border px-4 py-2 text-sm transition ${
                        selectedColor === String(v.color)
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">
                  Size:{" "}
                  <span className="font-normal">{selectedSize || "Select"}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((v) => {
                    const isAvailable =
                      product.variants?.some(
                        (pv) =>
                          String(pv.color) === selectedColor &&
                          String(pv.size) === String(v.size) &&
                          pv.stockQuantity > 0
                      ) ?? false;
                    return (
                      <button
                        key={String(v.size)}
                        onClick={() => setSelectedSize(String(v.size))}
                        disabled={!isAvailable}
                        className={`rounded border px-4 py-2 text-sm transition ${
                          selectedSize === String(v.size)
                            ? "border-black bg-black text-white"
                            : isAvailable
                            ? "border-gray-300 hover:border-black"
                            : "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
        />
      </div>
    </div>
  );
}
