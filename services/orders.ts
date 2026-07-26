import { fetchJson } from "@/lib/api";
import { OrderTrackingResponse } from "@/types/order";

export interface CreateOrderItem {
  itemId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  qrToken: string;
  items: CreateOrderItem[];
}

export interface CreateOrderResponse {
  order_id: string;
  display_number: number;
}

export interface OrderListItem {
  id: string;
  displayNumber: number;
  status: string;
  placedAt: string;
  estimatedMinutes: number | null;
  tableNumber: number;
  tableQrToken: string;
  items: {
    name: string;
    quantity: number;
    priceAtOrder: number;
    specialInstruction: string | null;
  }[];
}

export interface UpdateStatusResponse {
  id: string;
  displayNumber: number;
  status: string;
  estimatedMinutes: number | null;
}

export async function createOrder(
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> {
  return fetchJson<CreateOrderResponse>("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getOrder(orderId: string): Promise<OrderTrackingResponse> {
  return fetchJson<OrderTrackingResponse>(`/api/orders/${encodeURIComponent(orderId)}`);
}

export async function getOrders(status?: string): Promise<OrderListItem[]> {
  const params = status ? `?status=${encodeURIComponent(status)}` : "";
  return fetchJson<OrderListItem[]>(`/api/orders${params}`);
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  estimatedMinutes?: number
): Promise<UpdateStatusResponse> {
  const body: Record<string, any> = { status };
  if (estimatedMinutes !== undefined) {
    body.estimatedMinutes = estimatedMinutes;
  }
  return fetchJson<UpdateStatusResponse>(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
