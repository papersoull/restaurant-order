import React from "react";
import { OrderTrackingResponse } from "@/types/order";

interface TrackingHeaderProps {
  order: OrderTrackingResponse;
}

export function TrackingHeader({ order }: TrackingHeaderProps) {
  return (
    <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Order Number</p>
          <h1 className="text-3xl font-semibold">#{order.displayNumber}</h1>
        </div>
        <div className="space-y-2 text-slate-700">
          <p className="text-sm">Table {order.tableNumber}</p>
          <p className="text-sm">Placed at {new Date(order.placedAt).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
