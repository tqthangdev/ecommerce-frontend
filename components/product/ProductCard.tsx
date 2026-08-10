import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types/product";
import ExpandableIconButton from "@/components/ui/ExpandableIconButton";
import ProductVariantModal from "./ProductVariantModal";

interface Props {
  product: Product;
}

export function getThumbnail(product: Product): string {
  const primary = product.images?.find((img) => img.primary);
  if (primary?.imageUrl) return primary.imageUrl;
  if (product.images?.[0]?.imageUrl) return product.images[0].imageUrl;
  if (product.variants?.[0]?.imageUrl) return product.variants[0].imageUrl;
  return "/images/placeholder.jpg";
}

export default function ProductCard({ product }: Props) {
  const thumbnail = getThumbnail(product);
  const activeVariants = (product.variants ?? []).filter((v) => v.active);
  const minPrice = product.minPrice ?? activeVariants[0]?.price;
  const salePrice = product.salePrice;
  const hasSale =
    salePrice !== undefined && salePrice !== null && salePrice < (minPrice ?? 0);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="group/card flex h-full flex-col overflow-hidden rounded-lg border border-black bg-white transition-all duration-300 hover:border-red-600 hover:shadow-lg">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-100 p-4">
        <img
          src={thumbnail}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
          {product.category?.name}
        </p>
        <h2
          className="line-clamp-1 text-base font-bold leading-7 text-gray-900"
          title={product.name}
        >
          {product.name}
        </h2>
        <div className="mt-3">
          {hasSale ? (
            <>
              <span className="mr-2 text-sm text-gray-400 line-through">
                {(minPrice ?? 0).toLocaleString("vi-VN")} đ
              </span>
              <span className="block text-xl font-bold text-red-600">
                {salePrice.toLocaleString("vi-VN")} đ
              </span>
            </>
          ) : (
            <span className="block text-xl font-bold text-red-600">
              {(minPrice ?? 0).toLocaleString("vi-VN")} đ
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-5">
          <ExpandableIconButton
            icon={<ShoppingCart size={18} />}
            label="Add cart"
            expandedWidthClass="hover:w-28"
            onClick={() => setModalOpen(true)}
          />
          <ExpandableIconButton
            as="link"
            href={`/products/${product.slug}`}
            title="View product"
            icon={<Eye size={18} />}
            label="View"
            expandedWidthClass="hover:w-22"
            className="border border-black"
          />
        </div>
      </div>

      <ProductVariantModal
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
      />
    </div>
  );
}