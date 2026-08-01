"use client";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

import { useCartStore } from "@/stores/cart.store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-5 md:col-span-2">
          {items.map((item) => (
            <CartItem
              key={
                item.variant?.id ? `${item.product.id}-${item.variant.id}` : String(item.product.id)
              }
              item={item}
            />
          ))}
        </div>

        <CartSummary />
      </div>
    </main>
  );
}
