"use client";

import React from "react";
import { OrderListItem } from "@/services/orders";

interface WaiterOrderCardProps {
  order: OrderListItem;
  onServe?: (orderId: string) => void;
}

function getElapsedMinutes(placedAt: string): string {
  const diffMs = Date.now() - new Date(placedAt).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m ago`;
}

export function WaiterOrderCard({ order, onServe }: WaiterOrderCardProps) {
  const statusColors: Record<string, string> = {
    ready: "bg-emerald-100 text-emerald-900 border-emerald-300",
    served: "bg-purple-100 text-purple-900 border-purple-300",
  };

  const statusLabels: Record<string, string> = {
    ready: "Ready to Serve",
    served: "Served",
  };

  return (
    <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-espresso-black">#{order.displayNumber}</p>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                statusColors[order.status] || "bg-slate-100 text-slate-700 border-slate-300"
              }`}
            >
              {statusLabels[order.status] || order.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-beige">Table {order.tableNumber}</p>
        </div>
        <div className="rounded-3xl bg-soft-milk px-4 py-2 text-xs font-semibold text-espresso-black">
          {getElapsedMinutes(order.placedAt)}
        </div>
      </div>

      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-cream bg-soft-milk p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-espresso-black">{item.name}</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-espresso-black">
                x{item.quantity}
              </span>
            </div>
            {item.specialInstruction && (
              <p className="mt-1 text-sm italic text-cinnamon-brown">
                📝 {item.specialInstruction}
              </p>
            )}
          </div>
        ))}
      </div>

      {order.status === "ready" && onServe && (
        <button
          type="button"
          onClick={() => onServe(order.id)}
          className="mt-4 w-full rounded-2xl bg-cinnamon-brown px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8b593f]"
        >
          Mark Served
        </button>
      )}
    </div>
  );
}