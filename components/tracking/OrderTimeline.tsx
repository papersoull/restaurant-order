import React from "react";
import { OrderTrackingResponse } from "@/types/order";

interface OrderTimelineProps {
  order: OrderTrackingResponse;
}

const timelineSteps = [
  { key: "placed", label: "Placed" },
  { key: "accepted", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" },
];

export function OrderTimeline({ order }: OrderTimelineProps) {
  const currentStepIndex = timelineSteps.findIndex((step) => step.key === order.status);

  return (
    <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
      <h2 className="mb-5 text-lg font-semibold text-espresso-black">Order Timeline</h2>
      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          return (
            <div key={step.key} className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                  isActive ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-100 text-slate-500"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className={`text-sm font-semibold ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
