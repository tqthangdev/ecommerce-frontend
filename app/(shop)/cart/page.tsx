"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { useCartStore } from "@/stores/cart.store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showBulkRemoveConfirm, setShowBulkRemoveConfirm] = useState(false);

  const allSelected = items.length > 0 && selected.size === items.length;
  const bulkSelectedItems = items.filter((i) => selected.has(i.variant.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.variant.id)));
  }

  function toggleItem(variantId: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(variantId)) {
        next.delete(variantId);
      } else {
        next.add(variantId);
      }
      return next;
    });
  }

  async function handleBulkRemove() {
    setShowBulkRemoveConfirm(false);
    const ids = [...selected];
    setSelected(new Set());
    await Promise.all(ids.map((id) => removeItem(id)));
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-5">
      <h1 className="mb-5 text-3xl font-bold">Shopping Cart</h1>

      <div className="mb-4 flex items-center gap-3 border-b pb-4">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          aria-label="Select all items"
          className="h-5 w-5 cursor-pointer accent-black"
          id="allSelected"
        />
        <label
          htmlFor="allSelected"
          className="cursor-pointer select-none text-black font-semibold"
        >
          Select all
        </label>
        <button
          onClick={() => setShowBulkRemoveConfirm(true)}
          disabled={selected.size === 0}
          type="button"
          aria-label="Remove selected items"
          className="ml-2 flex items-center gap-2 font-semibold text-gray-900 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
        >
          <Trash2
            size={22}
            className={selected.size > 0 ? "text-gray-900" : "text-gray-300"}
          />
          <span>Delete</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="max-h-[calc(5*6rem)] space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <CartItem
                key={
                  item.variant?.id ? `${item.product.id}-${item.variant.id}` : String(item.product.id)
                }
                item={item}
                selected={selected.has(item.variant.id)}
                onToggleSelect={toggleItem}
              />
            ))}
          </div>
        </div>

        <CartSummary />
      </div>

      <ConfirmDialog
        open={showBulkRemoveConfirm}
        title="Remove selected products"
        description={`Are you sure you want to remove ${bulkSelectedItems.length} item(s) from your cart?`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleBulkRemove}
        onCancel={() => setShowBulkRemoveConfirm(false)}
      />
    </main>
  );
}
