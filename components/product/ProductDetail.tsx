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

function uniqueValues(items: ProductVariant[], key: keyof ProductVariant): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of items) {
    const val = String(v[key]);
    if (val && val !== "null" && val !== "undefined" && !seen.has(val)) {
      seen.add(val);
      result.push(val);
    }
  }
  return result;
}

function firstAvailableSize(variants: ProductVariant[], color: string): string | null {
  const sizesForColor = variants
    .filter((v) => String(v.color) === color && v.stockQuantity > 0)
    .map((v) => String(v.size))
    .filter((s) => s && s !== "null" && s !== "undefined");
  const seen = new Set<string>();
  return sizesForColor.find((s) => !seen.has(s) && seen.add(s)) ?? null;
}

export default function ProductDetail({ product }: Props) {
  const hasVariants = product.variants && product.variants.length > 0;
  const allColors = hasVariants ? uniqueValues(product.variants, "color") : [];

  const [selectedColor, setSelectedColor] = useState(
    allColors.length > 0 ? allColors[0] : ""
  );

  const sizesForColor = hasVariants
    ? uniqueValues(
        product.variants.filter((v) => String(v.color) === selectedColor),
        "size"
      ).sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);
        return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb;
      })
    : [];

  const [selectedSize, setSelectedSize] = useState<string>(
    sizesForColor.length > 0 ? sizesForColor[0] : ""
  );

  const selectedVariant = hasVariants
    ? product.variants.find(
        (v) => String(v.color) === selectedColor && String(v.size) === selectedSize
      )
    : undefined;

  function handleColorChange(color: string) {
    setSelectedColor(color);
    const firstSize = firstAvailableSize(product.variants, color);
    if (firstSize) {
      setSelectedSize(firstSize);
    } else {
      const newSizes = uniqueValues(
        product.variants.filter((v) => String(v.color) === color),
        "size"
      ).sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);
        return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb;
      });
      setSelectedSize(newSizes[0] ?? "");
    }
  }

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
            <>
              <span className="text-lg text-gray-400 line-through">
                {product.basePrice.toLocaleString("vi-VN")} đ
              </span>
              <span className="rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
                -{product.discountPercent}%
              </span>
            </>
          )}
        </div>

        <p className="leading-7 text-gray-600">{product.description}</p>

        {hasVariants && (
          <div className="space-y-4 border-t pt-4">
            {allColors.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">
                  Color:{" "}
                  <span className="font-normal">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`rounded border px-4 py-2 text-sm transition ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizesForColor.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">
                  Size:{" "}
                  <span className="font-normal">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizesForColor.map((size) => {
                    const isAvailable =
                      product.variants.some(
                        (pv) =>
                          String(pv.color) === selectedColor &&
                          String(pv.size) === size &&
                          pv.stockQuantity > 0
                      );
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`rounded border px-4 py-2 text-sm transition ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : isAvailable
                            ? "border-gray-300 hover:border-black"
                            : "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                        }`}
                      >
                        {size}
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
