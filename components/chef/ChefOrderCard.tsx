"use client";

import React, { useState } from "react";
import { OrderListItem } from "@/services/orders";

interface ChefOrderCardProps {
  order: OrderListItem;
  onAccept?: (orderId: string, estimatedMinutes?: number) => void;
  onReady?: (orderId: string) => void;
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

export function ChefOrderCard({ order, onAccept, onReady }: ChefOrderCardProps) {
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const statusColors: Record<string, string> = {
    placed: "bg-amber-100 text-amber-900 border-amber-300",
    accepted: "bg-sky-100 text-sky-900 border-sky-300",
    ready: "bg-emerald-100 text-emerald-900 border-emerald-300",
  };

  const statusLabels: Record<string, string> = {
    placed: "Placed",
    accepted: "Preparing",
    ready: "Ready",
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

      <div className="mt-4 flex flex-col gap-2">
        {order.status === "placed" && onAccept && (
          <>
            {showTimeInput ? (
              <div className="flex items-center gap-2 rounded-2xl bg-soft-milk p-2">
                <label className="text-xs font-semibold text-muted-beige whitespace-nowrap">
                  Est. time:
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 15)}
                  className="w-16 rounded-xl border border-cream bg-white px-2 py-1.5 text-center text-sm font-semibold text-espresso-black"
                />
                <span className="text-xs text-muted-beige">min</span>
                <button
                  type="button"
                  onClick={() => {
                    onAccept(order.id, estimatedMinutes);
                    setShowTimeInput(false);
                  }}
                  className="flex-1 rounded-2xl bg-cinnamon-brown px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#8b593f]"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => setShowTimeInput(false)}
                  className="rounded-2xl bg-white border border-cream px-3 py-2 text-sm font-semibold text-muted-beige"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTimeInput(true)}
                className="w-full rounded-2xl bg-cinnamon-brown px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8b593f]"
              >
                Start Preparing
              </button>
            )}
          </>
        )}
        {order.status === "accepted" && onReady && (
          <button
            type="button"
            onClick={() => onReady(order.id)}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Mark Ready
          </button>
        )}
      </div>
    </div>
  );
}