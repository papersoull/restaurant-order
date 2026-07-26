"use client";

import React from "react";
import { useBilling } from "@/hooks/useBilling";
import { Loading } from "@/components/ui/Loading";
import { Error as ErrorMessage } from "@/components/ui/Error";

export default function BillingDashboard() {
  const { servedOrders, billedOrders, bills, isLoading, error, generateBill } = useBilling();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Loading />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ErrorMessage title="Billing Dashboard Error" message={error} />
        </div>
      </main>
    );
  }

  const getBillForOrder = (orderId: string) => bills.find((b) => b.orderId === orderId);

  // Get the most recently billed order only
  const lastBilledOrder = billedOrders.length > 0 ? billedOrders[0] : null;
  const lastBill = lastBilledOrder ? getBillForOrder(lastBilledOrder.id) : null;

  return (
    <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-beige">
                Billing Counter
              </p>
              <h1 className="text-3xl font-semibold text-espresso-black">Billing Dashboard</h1>
            </div>
            <div className="rounded-3xl bg-pastel-apricot px-4 py-3 text-sm font-semibold text-espresso-black">
              {servedOrders.length} pending bills
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Orders - Ready to Bill (always visible) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-espresso-black">Active Orders</h2>
              <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-900">
                {servedOrders.length}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {servedOrders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-cream bg-white/50 p-8 text-center shadow-sm">
                  <p className="text-sm text-muted-beige">No orders ready for billing.</p>
                </div>
              ) : (
                servedOrders.map((order) => {
                  const subtotal = order.items.reduce(
                    (sum, item) => sum + item.priceAtOrder * item.quantity,
                    0
                  );
                  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
                  const total = subtotal + taxAmount;

                  return (
                    <div
                      key={order.id}
                      className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-2xl font-semibold text-espresso-black">
                            #{order.displayNumber}
                          </p>
                          <p className="mt-1 text-sm text-muted-beige">Table {order.tableNumber}</p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                          Served
                        </span>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-2xl bg-soft-milk p-3"
                          >
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-espresso-black">{item.name}</p>
                              <span className="text-xs text-muted-beige">x{item.quantity}</span>
                            </div>
                            <p className="text-sm font-semibold text-espresso-black">
                              ₹{(item.priceAtOrder * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-1.5 border-t border-cream pt-4">
                        <div className="flex justify-between text-sm text-muted-beige">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-beige">
                          <span>GST (5%)</span>
                          <span>₹{taxAmount.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-espresso-black">
                          <span>Grand Total</span>
                          <span>₹{total.toFixed(0)}</span>
                        </div>
                      </div>

                      <button
  type="button"
  onClick={() => generateBill(order.id)}
  className="mt-4 w-full rounded-2xl border border-[#D8C3AE] bg-[#F5E9DC] px-4 py-3 text-sm font-semibold text-[#5C3A21] shadow-md transition-all duration-200 hover:bg-[#EEDCC9] hover:border-[#C9A98A]"
>
  Generate Bill & Close Order
</button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Last 2 Billed Orders */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-espresso-black">Recently Billed</h2>
              <a
  href="/billing/history"
  className="rounded-xl border border-[#D8C3AE] bg-[#F5E9DC] px-4 py-1.5 text-sm font-semibold text-[#5C3A21] shadow-sm transition-all duration-200 hover:bg-[#EEDCC9] hover:border-[#C9A98A]"
>
  View All Bills
</a>
            </div>
            <div className="flex flex-col gap-4">
              {!lastBilledOrder || !lastBill ? (
                <div className="rounded-3xl border border-dashed border-cream bg-white/50 p-8 text-center shadow-sm">
                  <p className="text-sm text-muted-beige">No orders billed yet.</p>
                </div>
              ) : (
                <>
                  <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold text-espresso-black">
                          #{lastBilledOrder.displayNumber}
                        </p>
                        <p className="mt-1 text-sm text-muted-beige">Table {lastBilledOrder.tableNumber}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                        Billed
                      </span>
                    </div>

                    <div className="space-y-3 rounded-2xl bg-soft-milk p-4">
                      <div className="space-y-1.5">
                        {lastBill.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-espresso-black">{item.name}</span>
                              <span className="text-xs text-muted-beige">x{item.quantity}</span>
                            </div>
                            <span className="text-espresso-black">₹{(item.priceAtOrder * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-cream pt-3 space-y-1.5">
                        <div className="flex justify-between text-sm text-muted-beige">
                          <span>Subtotal</span>
                          <span>₹{lastBill.subtotal.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-beige">
                          <span>GST (5%)</span>
                          <span>₹{lastBill.taxAmount.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-espresso-black">
                          <span>Grand Total</span>
                          <span>₹{lastBill.total.toFixed(0)}</span>
                        </div>
                        <p className="pt-1 text-xs text-muted-beige">
                          Billed at {new Date(lastBill.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
