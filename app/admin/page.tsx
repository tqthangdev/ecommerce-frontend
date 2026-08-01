"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import {
  getDashboardStats,
  getRecentOrders,
  RecentOrder,
} from "@/services/admin/dashboard.service";
import Loading from "@/components/ui/Loading";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-500",
  REFUNDED: "bg-red-100 text-red-800",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
  } | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentOrders()])
      .then(([s, o]) => {
        setStats(s);
        setRecentOrders(o);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Products" value={stats?.totalProducts?.toString() ?? "—"} />
        <DashboardCard title="Orders" value={stats?.totalOrders?.toString() ?? "—"} />
        <DashboardCard title="Users" value={stats?.totalUsers?.toString() ?? "—"} />
        <DashboardCard
          title="Revenue"
          value={
            stats?.totalRevenue ? `${Number(stats.totalRevenue).toLocaleString("vi-VN")} ₫` : "—"
          }
        />
      </div>

      <section className="mt-10 rounded-xl border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pr-4 pb-3">Order #</th>
                <th className="pr-4 pb-3">Date</th>
                <th className="pr-4 pb-3">Total</th>
                <th className="pr-4 pb-3">Payment</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono font-semibold">{order.orderNumber}</td>
                  <td className="py-3 pr-4 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3 pr-4 font-semibold">
                    {Number(order.totalAmount).toLocaleString("vi-VN")} đ
                  </td>
                  <td className="py-3 pr-4 text-xs">
                    <div>{order.paymentMethod}</div>
                    <div
                      className={
                        order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                      }
                    >
                      {order.paymentStatus}
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
