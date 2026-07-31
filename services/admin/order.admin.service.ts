import { api, ApiResponse } from "@/lib/api";
import { Order } from "@/types/order";
import { PageResponse } from "@/types/api";

export async function getAdminOrders(
  page = 0,
  size = 10,
  status?: string,
  keyword?: string
): Promise<PageResponse<Order>> {
  const res = await api.get<ApiResponse<PageResponse<Order>>>("/api/admin/orders", {
    params: { page, size, status, keyword },
  });
  return res.data.data;
}

export async function getAdminOrderById(id: number): Promise<Order> {
  const res = await api.get<ApiResponse<Order>>(`/api/admin/orders/${id}`);
  return res.data.data;
}

export async function updateOrderStatus(id: number, status: string): Promise<Order> {
  const res = await api.patch<ApiResponse<Order>>(`/api/admin/orders/${id}/status`, { status });
  return res.data.data;
}
