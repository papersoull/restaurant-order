"use client";

import React from "react";
import { OrderListItem } from "@/services/orders";
import { ChefOrderCard } from "@/components/chef/ChefOrderCard";

interface ChefColumnProps {
  title: string;
  orders: OrderListItem[];
  accentColor: string;
  emptyLabel: string;
  onAccept?: (orderId: string, estimatedMinutes?: number) => void;
  onReady?: (orderId: string) => void;
}

export function ChefColumn({
  title,
  orders,
  accentColor,
  emptyLabel,
  onAccept,
  onReady,
}: ChefColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-espresso-black">{title}</h2>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${accentColor}`}
        >
          {orders.length}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-cream bg-white/50 p-8 text-center shadow-sm">
            <p className="text-sm text-muted-beige">{emptyLabel}</p>
          </div>
        ) : (
          orders.map((order) => (
            <ChefOrderCard
              key={order.id}
              order={order}
              onAccept={onAccept}
              onReady={onReady}
            />
          ))
        )}
      </div>
    </div>
  );
}