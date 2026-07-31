import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";
import * as cartApi from "@/services/cart.service";

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: number, variantId?: number) => Promise<void>;
  increase: (productId: number, variantId?: number) => Promise<void>;
  decrease: (productId: number, variantId?: number) => Promise<void>;
  clear: () => Promise<void>;
  syncFromServer: () => Promise<void>;
}

function itemKey(item: CartItem) {
  return item.variant?.id ? `${item.product.id}-${item.variant.id}` : `${item.product.id}`;
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
              slug: "",
              basePrice: i.unitPrice,
              effectivePrice: i.effectivePrice,
              discountPercent: 0,
              stockQuantity: 0,
              active: true,
              featured: false,
              viewCount: 0,
              category: { id: 0, name: "", slug: "" },
              brand: { id: 0, name: "", slug: "", active: true },
              images: i.productImageUrl ? [{ id: 0, imageUrl: i.productImageUrl, altText: "", displayOrder: 0, primary: true }] : [],
              variants: [],
              createdAt: "",
              updatedAt: "",
            },
            variant: i.variantId ? {
              id: i.variantId,
              sku: i.variantSku || "",
              color: i.variantColor || "",
              size: String(i.variantSize || ""),
              price: i.effectivePrice,
              stockQuantity: 0,
              imageUrl: i.productImageUrl,
              productId: i.productId,
            } : undefined,
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
            items: state.items.map((i) =>
              itemKey(i) === key ? { ...i, quantity } : i
            ),
          });
        } else {
          set({ items: [...state.items, { ...item, quantity: item.quantity }] });
        }

        try {
          await cartApi.addToCart(item.product.id, quantity, item.variant?.id);
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

      removeItem: async (productId, variantId) => {
        const state = get();
        const key = variantId ? `${productId}-${variantId}` : String(productId);
        const removed = state.items.find(
          (i) => (variantId ? `${i.product.id}-${i.variant?.id}` : String(i.product.id)) === key
        );
        if (!removed) return;

        set({ items: state.items.filter((i) => itemKey(i) !== key) });

        try {
          await cartApi.removeCartItem(productId, variantId);
          const cart = await cartApi.getCart();
          set({ totalQuantity: cart.totalQuantity, totalAmount: cart.total });
        } catch {
          set({ items: [...state.items, removed] });
        }
      },

      increase: async (productId, variantId) => {
        const state = get();
        const key = variantId ? `${productId}-${variantId}` : String(productId);
        const item = state.items.find(
          (i) => (variantId ? `${i.product.id}-${i.variant?.id}` : String(i.product.id)) === key
        );
        if (!item) return;

        const newQty = item.quantity + 1;
        set({
          items: state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantity: newQty } : i
          ),
        });

        try {
          await cartApi.updateCartItem(productId, newQty, variantId);
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

      decrease: async (productId, variantId) => {
        const state = get();
        const key = variantId ? `${productId}-${variantId}` : String(productId);
        const item = state.items.find(
          (i) => (variantId ? `${i.product.id}-${i.variant?.id}` : String(i.product.id)) === key
        );
        if (!item || item.quantity <= 1) return;

        const newQty = item.quantity - 1;
        set({
          items: state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantity: newQty } : i
          ),
        });

        try {
          await cartApi.updateCartItem(productId, newQty, variantId);
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
          set({ items: state.items, totalQuantity: state.totalQuantity, totalAmount: state.totalAmount });
        }
      },
    }),
    {
      name: "shopping-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
