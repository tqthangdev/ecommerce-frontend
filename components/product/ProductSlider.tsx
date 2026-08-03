"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "./ProductCard";
import ProductRawList from "./ProductRawList";

import { Product } from "@/types/product";

export default function ProductSlider() {
  const [index, setIndex] = useState(0);

  return (
    <ProductRawList size={12} sort="CREATED_AT,desc">
      {(products) => (
        <Carousel
          products={products}
          index={index}
          setIndex={setIndex}
        />
      )}
    </ProductRawList>
  );
}

function Carousel({
  products,
  index,
  setIndex,
}: {
  products: Product[];
  index: number;
  setIndex: (value: number) => void;
}) {
  const visibleItems = 6;
  const maxIndex = Math.max(products.length - visibleItems, 0);

  function next() {
    setIndex(Math.min(index + 1, maxIndex));
  }

  function prev() {
    setIndex(Math.max(index - 1, 0));
  }

  return (
    <div className="relative px-2">
      <button
        onClick={prev}
        disabled={index === 0}
        className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow transition hover:scale-105 disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-500"
          style={{
            transform: `translateX(-${index * (100 / visibleItems)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="basis-full shrink-0 sm:basis-1/3 lg:basis-1/5"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        disabled={index === maxIndex}
        className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow transition hover:scale-105 disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}