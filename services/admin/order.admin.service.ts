import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Order } from "@/types/order";
import { PageResponse } from "@/types/api";

export function getAdminOrders(
  page = 0,
  size = 10,
  status?: string,
  keyword?: string,
  signal?: AbortSignal
): Promise<PageResponse<Order>> {
  return request(
    api.get<ApiResponse<PageResponse<Order>>>("/api/admin/orders", {
      params: { page, size, status, keyword },
      signal,
    }),
    {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size,
      number: page,
      first: true,
      last: true,
      empty: true,
      numberOfElements: 0,
    } as PageResponse<Order>
  );
}

export function getAdminOrderById(id: number): Promise<Order> {
  return request(
    api.get<ApiResponse<Order>>(`/api/admin/orders/${id}`),
    {} as Order
  );
}

export function updateOrderStatus(
  id: number,
  status: string
): Promise<Order> {
  return request(
    api.patch<ApiResponse<Order>>(
      `/api/admin/orders/${id}/status`,
      { status }
    ),
    {} as Order
  );
}