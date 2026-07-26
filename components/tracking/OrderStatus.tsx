import React from "react";
import { OrderTrackingResponse } from "@/types/order";

interface OrderStatusProps {
  order: OrderTrackingResponse;
}

const statusLabelMap: Record<string, string> = {
  placed: "Placed",
  accepted: "Preparing",
  ready: "Ready",
  served: "Served",
  billed: "Billed",
};

export function OrderStatus({ order }: OrderStatusProps) {
  return (
    <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
      <h2 className="mb-4 text-lg font-semibold text-espresso-black">Order Status</h2>
      <p className="text-2xl font-semibold text-cinnamon-brown">{statusLabelMap[order.status] ?? order.status}</p>
      <p className="mt-2 text-sm text-muted-beige">
        Estimated time: {order.estimatedMinutes ? `${order.estimatedMinutes} min` : "Not available"}
      </p>
    </div>
  );
}
