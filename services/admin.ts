import { fetchJson } from "@/lib/api";

export interface AnalyticsResponse {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  popularItems: {
    name: string;
    totalQuantity: number;
  }[];
  orderStats: {
    status: string;
    count: number;
  }[];
  recentOrders: {
    id: string;
    displayNumber: number;
    status: string;
    tableNumber: number;
    placedAt: string;
    itemCount: number;
    total: number;
  }[];
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  return fetchJson<AnalyticsResponse>("/api/admin/analytics");
}