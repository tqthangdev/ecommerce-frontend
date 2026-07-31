import { api, ApiResponse } from "@/lib/api";

export interface CartItem {
  productId: number;
  variantId?: number;
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
  productImageUrl?: string;
  variantId?: number;
  variantSku?: string;
  variantColor?: string;
  variantSize?: number;
  quantity: number;
  unitPrice: number;
  effectivePrice: number;
  subtotal: number;
}

export async function getCart(): Promise<CartResponse> {
  const res = await api.get<ApiResponse<CartResponse>>("/api/cart");
  return res.data.data;
}

export async function addToCart(productId: number, quantity: number, variantId?: number): Promise<CartResponse> {
  const res = await api.post<ApiResponse<CartResponse>>("/api/cart", {
    productId,
    variantId,
    quantity,
  });
  return res.data.data;
}

export async function updateCartItem(
  productId: number,
  quantity: number,
  variantId?: number
): Promise<CartResponse> {
  const res = await api.put<ApiResponse<CartResponse>>("/api/cart/items", {
    productId,
    variantId,
    quantity,
  }, {
    params: { productId, variantId },
  });
  return res.data.data;
}

export async function removeCartItem(productId: number, variantId?: number): Promise<CartResponse> {
  const res = await api.delete<ApiResponse<CartResponse>>("/api/cart/items", {
    params: { productId, variantId },
  });
  return res.data.data;
}

export async function clearCart(): Promise<void> {
  await api.delete("/api/cart");
}
