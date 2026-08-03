import Link from "next/link";
import { Product } from "@/types/product";

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
  const hasDiscount = product.discountPercent > 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-100">
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}

        <img
          src={thumbnail}
          alt={product.name}
          className="gryph h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
          {product.category?.name}
        </p>

        <h2 className="line-clamp-1 text-base font-bold leading-7 text-gray-900"  title={product.name}>
          {product.name}
        </h2>

        <div className="mt-auto flex items-end justify-between pt-1">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {product.basePrice.toLocaleString("vi-VN")} đ
              </span>
            )}

            <span className="text-xl font-bold text-red-600">
              {product.effectivePrice.toLocaleString("vi-VN")} đ
            </span>
          </div>

          
        </div>
        
        <div
          className={`mt-auto flex items-end justify-between ${
            hasDiscount ? "pt-5" : "pt-2"
          }`}
        >
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}