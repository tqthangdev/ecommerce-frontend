"use client";

import { useState } from "react";
import ProductVariant from "./ProductVariant";
import { Product, ProductVariant as ProductVariantType } from "@/types/product";
import BackButton from "@/components/ui/BackButton";

type Props = {
  product: Product;
};

function getMainImage(
  product: Product,
  selectedVariant?: ProductVariantType
): string {
  if (selectedVariant?.imageUrl) return selectedVariant.imageUrl;

  const primary = product.images?.find((img) => img.primary);

  if (primary?.imageUrl) return primary.imageUrl;

  if (product.images?.[0]?.imageUrl) return product.images[0].imageUrl;

  return "/images/placeholder.jpg";
}

export default function ProductDetail({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType | undefined>(undefined);

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

          <div className="border-t pt-4">
            <ProductVariant
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
              autoSelectInStock
            />
          </div>
        </div>
      </div>
    </>
  );
}