import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variantId?: number) => void;
  increase: (productId: number, variantId?: number) => void;
  decrease: (productId: number, variantId?: number) => void;
  clear: () => void;
}

function itemKey(item: CartItem) {
  return item.variant?.id ? `${item.product.id}-${item.variant.id}` : `${item.product.id}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const key = itemKey(item);
          const exists = state.items.find((i) => itemKey(i) === key);
          if (exists) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.variant?.id === variantId),
          ),
        })),

      increase: (productId, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.variant?.id === variantId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        })),

      decrease: (productId, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.variant?.id === variantId
              ? { ...i, quantity: Math.max(1, i.quantity - 1) }
              : i,
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "shopping-cart" },
  ),
);
