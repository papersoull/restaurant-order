"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { Loading } from "@/components/ui/Loading";
import { Error } from "@/components/ui/Error";
import { TrackingHeader } from "@/components/tracking/TrackingHeader";
import { OrderStatus } from "@/components/tracking/OrderStatus";
import { OrderTimeline } from "@/components/tracking/OrderTimeline";
import { fetchJson } from "@/lib/api";

interface BillInfo {
  subtotal: number;
  taxAmount: number;
  total: number;
  items: { name: string; quantity: number; priceAtOrder: number }[];
}

export default function TrackPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;
  const { order, isLoading, error } = useOrderTracking(orderId);
  const [bill, setBill] = useState<BillInfo | null>(null);

  useEffect(() => {
    if (order?.status === "billed" && orderId) {
      fetchJson<BillInfo>(`/api/bills/order/${orderId}`)
        .then((data) => setBill(data))
        .catch(() => {});
    } else {
      setBill(null);
    }
  }, [order?.status, orderId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !order) {
    return <Error title="Tracking failed" message={error || "Order not found."} />;
  }

  return (
    <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <TrackingHeader order={order} />
        <div className="grid gap-6 lg:grid-cols-2">
          <OrderStatus order={order} />
          <OrderTimeline order={order} />
        </div>

        {/* Bill Section - shown when order is billed */}
        {bill && (
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-cinnamon">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                Paid
              </span>
              <h2 className="text-xl font-semibold text-espresso-black">Bill Summary</h2>
            </div>
            <div className="space-y-2">
              {bill.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl bg-soft-milk p-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-espresso-black">{item.name}</p>
                    <span className="text-xs text-muted-beige">x{item.quantity}</span>
                  </div>
                  <p className="text-sm font-semibold text-espresso-black">₹{(item.priceAtOrder * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-cream pt-4">
              <div className="flex justify-between text-sm text-muted-beige">
                <span>Subtotal</span>
                <span>₹{bill.subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-beige">
                <span>GST (5%)</span>
                <span>₹{bill.taxAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-espresso-black">
                <span>Total Amount Paid</span>
                <span>₹{bill.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 rounded-3xl border border-cream bg-white p-6 shadow-cinnamon sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-beige">Need more from the menu?</p>
            <p className="mt-1 text-lg font-semibold text-espresso-black">Order again on the same table.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/menu/${order.tableQrToken}`)}
            className="rounded-3xl bg-cinnamon-brown px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8b593f]"
          >
            Back to menu
          </button>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.name}-${item.quantity}`} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-slate-600">x{item.quantity}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">₹{item.priceAtOrder.toFixed(0)}</p>
                {item.specialInstruction ? (
                  <p className="mt-2 text-sm text-slate-500">Note: {item.specialInstruction}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
