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
    <div className="group bg-white rounded-lg border overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            -{product.discountPercent}%
          </span>
        )}

        <img
          src={thumbnail}
          alt={product.name}
          className="gryph w-full h-full rounded-lg object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {product.category?.name}
        </p>

        <h2 className="font-bold text-lg line-clamp-1">{product.name}</h2>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-red-600">
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
            className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
