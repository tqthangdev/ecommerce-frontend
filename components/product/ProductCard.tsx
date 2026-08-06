import Link from "next/link";
import { Eye } from "lucide-react";
import { Product } from "@/types/product";
import AddToCartButton from "./AddToCartButton";

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
  const hasSale = salePrice !== undefined && salePrice !== null && salePrice < (minPrice ?? 0);

  return (
    <div className="group/card flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-100 p-4">
        <img
          src={thumbnail}
          alt={product.name}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
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
          <AddToCartButton product={product} compact />

          <Link
            href={`/products/${product.slug}`}
            title="View product"
            className="
              group/view relative flex h-10 w-10 items-center justify-center
              overflow-hidden rounded-full
              border border-black text-white bg-black
              transition-all duration-300 ease-out
              hover:w-24
            "
          >
            <Eye
              size={18}
              className="
                absolute left-1/2 -translate-x-1/2
                shrink-0 transition-all duration-300
                group-hover/view:left-4
                group-hover/view:translate-x-0
              "
            />

            <span
              className="
                ml-5 max-w-0 overflow-hidden whitespace-nowrap
                text-sm opacity-0
                transition-all duration-300 ease-out
                group-hover/view:max-w-xs
                group-hover/view:opacity-100
              "
            >
              View
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}