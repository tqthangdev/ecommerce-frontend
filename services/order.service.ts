import { api, ApiResponse } from "@/lib/api";
import { Order, CheckoutRequest, CheckoutResponse, OrderItem } from "@/types/order";

export async function checkout(payload: CheckoutRequest): Promise<CheckoutResponse> {
  const res = await api.post<ApiResponse<CheckoutResponse>>("/api/orders/checkout", payload);
  return res.data.data;
}

export async function getOrders(page = 0, size = 10): Promise<PageResponse<Order>> {
  const res = await api.get<ApiResponse<PageResponse<Order>>>("/api/orders", {
    params: { page, size },
  });
  return res.data.data;
}

export async function getOrderById(id: number): Promise<Order> {
  const res = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
  return res.data.data;
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const res = await api.get<ApiResponse<OrderItem[]>>(`/api/orders/${orderId}/items`);
  return res.data.data;
}
