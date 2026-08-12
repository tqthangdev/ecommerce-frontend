"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductRawList from "./ProductRawList";
import { Product } from "@/types/product";

export default function ProductSlider() {
  return (
    <ProductRawList size={50} sort="CREATED_AT,desc">
      {(products) => <Carousel products={products} />}
    </ProductRawList>
  );
}

function useVisibleItems() {
  const [visibleItems, setVisibleItems] = useState(1);
  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleItems(5);
      else if (w >= 640) setVisibleItems(3);
      else setVisibleItems(1);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return visibleItems;
}

function Carousel({ products }: { products: Product[] }) {
  const visibleItems = useVisibleItems();
  const total = products.length;
  const CLONES = visibleItems;

  const extended = [
    ...products.slice(total - CLONES),
    ...products,
    ...products.slice(0, CLONES),
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(CLONES);
  const isAnimatingRef = useRef(false);

  // Reset index when the responsive column count changes
  useEffect(() => {
    setIndex(CLONES);
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(-${
        CLONES * (100 / visibleItems)
      }%)`;
    }
  }, [visibleItems]); // eslint-disable-line react-hooks/exhaustive-deps

  function goTo(newIndex: number, animate = true) {
    const track = trackRef.current;
    if (!track) return;

    track.style.transition = animate ? "transform 500ms ease" : "none";
    track.style.transform = `translateX(-${newIndex * (100 / visibleItems)}%)`;
    setIndex(newIndex);
  }

  function next() {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    goTo(index + 1, true);
  }

  function prev() {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    goTo(index - 1, true);
  }

  function handleTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    // Ignore if the event bubbled up from a child element (card, button...)
    if (e.target !== trackRef.current) return;
    // Ignore if it is not a "transform" property transition
    if (e.propertyName !== "transform") return;

    isAnimatingRef.current = false;
    const track = trackRef.current;
    if (!track) return;

    let resetIndex: number | null = null;
    if (index >= total + CLONES) {
      resetIndex = CLONES + ((index - CLONES) % total);
    } else if (index < CLONES) {
      resetIndex = CLONES + (((index - CLONES) % total) + total) % total;
    }

    if (resetIndex !== null) {
      track.style.transition = "none";
      void track.offsetHeight; // force reflow
      track.style.transform = `translateX(-${resetIndex * (100 / visibleItems)}%)`;
      setIndex(resetIndex);
    }
  }

  return (
    <div className="relative px-2">
      <button
        onClick={prev}
        className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow transition hover:scale-105"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className="flex gap-5"
          style={{
            transform: `translateX(-${index * (100 / visibleItems)}%)`,
          }}
        >
          {extended.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="basis-full shrink-0 sm:basis-1/3 lg:basis-1/5"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow transition hover:scale-105"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}