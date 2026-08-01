import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}

          product={product}
        />
      ))}
    </div>
  );
}
