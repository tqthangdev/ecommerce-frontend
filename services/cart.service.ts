import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";

export interface CartItemRequest {
  variantId: number;
  quantity: number;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  discount: number;
  total: number;
}

export interface CartItemResponse {
  productId: number;
  productName: string;
  imageUrl?: string;
  variantId: number;
  variantSku?: string;
  variantName?: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  effectivePrice: number;
  subtotal: number;
  stockAvailable: number;
  addedAt: number;
}

const EMPTY_CART: CartResponse = {
  items: [],
  totalItems: 0,
  totalQuantity: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
};

export async function getCart(): Promise<CartResponse> {
  return request(
    api.get<ApiResponse<CartResponse>>("/api/cart"),
    EMPTY_CART
  );
}

export async function addToCart(
  variantId: number,
  quantity: number
): Promise<CartResponse> {
  return request(
    api.post<ApiResponse<CartResponse>>("/api/cart", {
      variantId,
      quantity,
    }),
    EMPTY_CART
  );
}

export async function updateCartItem(
  variantId: number,
  quantity: number
): Promise<CartResponse> {
  return request(
    api.put<ApiResponse<CartResponse>>(
      "/api/cart/items",
      {
        quantity,
      },
      {
        params: { variantId },
      }
    ),
    EMPTY_CART
  );
}

export async function removeCartItem(
  variantId: number
): Promise<CartResponse> {
  return request(
    api.delete<ApiResponse<CartResponse>>("/api/cart/items", {
      params: { variantId },
    }),
    EMPTY_CART
  );
}

export async function clearCart(): Promise<void> {
  try {
    await api.delete("/api/cart");
  } catch {}
}
