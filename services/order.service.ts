import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Order, CheckoutRequest, CheckoutResponse, OrderItem } from "@/types/order";
import { PageResponse } from "@/types/api";

export async function checkout(
  payload: CheckoutRequest
): Promise<CheckoutResponse> {
  return request(
    api.post<ApiResponse<CheckoutResponse>>(
      "/api/orders/checkout",
      payload
    )
  );
}

export async function getOrders(
  page = 0,
  size = 10
): Promise<PageResponse<Order>> {
  return request(
    api.get<ApiResponse<PageResponse<Order>>>("/api/orders", {
      params: { page, size },
    }),
    {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size,
      page: 0,
      first: true,
      last: true,
      empty: true,
    } as PageResponse<Order>
  );
}

export async function getOrderById(
  id: number
): Promise<Order> {
  return request(
    api.get<ApiResponse<Order>>(`/api/orders/${id}`),
    {} as Order
  );
}

export async function getOrderItems(
  orderId: number
): Promise<OrderItem[]> {
  return request(
    api.get<ApiResponse<OrderItem[]>>(
      `/api/orders/${orderId}/items`
    ),
    []
  );
}

export async function cancelOrder(
  orderId: number
): Promise<Order> {
  return request(
    api.post<ApiResponse<Order>>(
      `/api/orders/${orderId}/cancel`
    ),
    {} as Order
  );
}