import { Product } from "@/types/product";
import Link from "next/link";

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
    <div className="group overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-xl">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-100">
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}

        <img
          src={thumbnail}
          alt={product.name}
          className="gryph h-full w-full rounded-lg object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <p className="mb-1 text-xs tracking-wide text-gray-400 uppercase">
          {product.category?.name}
        </p>

        <h2 className="line-clamp-1 text-lg font-bold">{product.name}</h2>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{product.description}</p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-600">
              {product.effectivePrice.toLocaleString("vi-VN")} đ
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {product.basePrice.toLocaleString("vi-VN")} đ
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
