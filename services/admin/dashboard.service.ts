import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";

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

export const getDashboardStats = () =>
  request(
    api.get<ApiResponse<DashboardStats>>("/api/admin/dashboard/stats"),
    {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    }
  );

export const getRecentOrders = () =>
  request(
    api.get<ApiResponse<RecentOrder[]>>("/api/admin/dashboard/recent-orders"),
    []
  );