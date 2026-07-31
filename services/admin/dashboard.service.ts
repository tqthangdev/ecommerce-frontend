import { api, ApiResponse } from "@/lib/api";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface RecentOrder {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  paymentStatus: string;
  paymentMethod: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get<ApiResponse<DashboardStats>>("/api/admin/dashboard/stats");
  return res.data.data;
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  const res = await api.get<ApiResponse<RecentOrder[]>>("/api/admin/dashboard/recent-orders");
  return res.data.data;
}
