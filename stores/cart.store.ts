import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";
import * as cartApi from "@/services/cart.service";

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (variantId: number) => Promise<void>;
  increase: (variantId: number) => Promise<void>;
  decrease: (variantId: number) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => void;
  syncFromServer: () => Promise<void>;
}

function itemKey(item: CartItem) {
  return String(item.variant.id);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalAmount: 0,

      syncFromServer: async () => {
        try {
          const cart = await cartApi.getCart();
          const items: CartItem[] = cart.items.map((i) => ({
            product: {
              id: i.productId,
              name: i.productName,
              imageUrl: i.imageUrl || undefined,
            },
            variant: {
              id: i.variantId,
              sku: i.variantSku || "",
              color: i.color || "",
              size: i.size || "",
              price: i.effectivePrice,
              stockQuantity: i.stockAvailable,
              imageUrl: i.imageUrl || "",
              active: true,
            },
            quantity: i.quantity,
          }));
          const totalQuantity = cart.totalQuantity;
          const totalAmount = cart.total;
          set({ items, totalQuantity, totalAmount });
        } catch {
          // ignore
        }
      },

      addItem: async (item) => {
        const key = itemKey(item);
        const state = get();
        const exists = state.items.find((i) => itemKey(i) === key);
        const quantity = exists ? exists.quantity + item.quantity : item.quantity;

        // Optimistic update
        if (exists) {
          set({
            items: state.items.map((i) => (itemKey(i) === key ? { ...i, quantity } : i)),
          });
        } else {
          set({ items: [...state.items, { ...item, quantity: item.quantity }] });
        }

        try {
          await cartApi.addToCart(item.variant.id, quantity);
          const cart = await cartApi.getCart();
          set({
            totalQuantity: cart.totalQuantity,
            totalAmount: cart.total,
          });
        } catch {
          // Revert on error
          if (exists) {
            set({
              items: state.items.map((i) =>
                itemKey(i) === key ? { ...i, quantity: exists.quantity } : i
              ),
            });
          } else {
            set({ items: state.items.filter((i) => itemKey(i) !== key) });
          }
        }
      },

      removeItem: async (variantId) => {
        const state = get();
        const key = String(variantId);
        const removed = state.items.find((i) => itemKey(i) === key);
        if (!removed) return;

        set({ items: state.items.filter((i) => itemKey(i) !== key) });

        try {
          await cartApi.removeCartItem(variantId);
          const cart = await cartApi.getCart();
          set({ totalQuantity: cart.totalQuantity, totalAmount: cart.total });
        } catch {
          set({ items: [...state.items, removed] });
        }
      },

      increase: async (variantId) => {
        const state = get();
        const key = String(variantId);
        const item = state.items.find((i) => itemKey(i) === key);
        if (!item) return;

        const newQty = item.quantity + 1;
        set({
          items: state.items.map((i) => (itemKey(i) === key ? { ...i, quantity: newQty } : i)),
        });

        try {
          await cartApi.updateCartItem(variantId, newQty);
          const cart = await cartApi.getCart();
          set({ totalQuantity: cart.totalQuantity, totalAmount: cart.total });
        } catch {
          set({
            items: state.items.map((i) =>
              itemKey(i) === key ? { ...i, quantity: item.quantity } : i
            ),
          });
        }
      },

      decrease: async (variantId) => {
        const state = get();
        const key = String(variantId);
        const item = state.items.find((i) => itemKey(i) === key);
        if (!item || item.quantity <= 1) return;

        const newQty = item.quantity - 1;
        set({
          items: state.items.map((i) => (itemKey(i) === key ? { ...i, quantity: newQty } : i)),
        });

        try {
          await cartApi.updateCartItem(variantId, newQty);
          const cart = await cartApi.getCart();
          set({ totalQuantity: cart.totalQuantity, totalAmount: cart.total });
        } catch {
          set({
            items: state.items.map((i) =>
              itemKey(i) === key ? { ...i, quantity: item.quantity } : i
            ),
          });
        }
      },

      clear: async () => {
        const state = get();
        set({ items: [], totalQuantity: 0, totalAmount: 0 });
        try {
          await cartApi.clearCart();
        } catch {
          set({
            items: state.items,
            totalQuantity: state.totalQuantity,
            totalAmount: state.totalAmount,
          });
        }
      },

      reset: () => {
        set({ items: [], totalQuantity: 0, totalAmount: 0, });
      },

    }),
    {
      name: "shopping-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
