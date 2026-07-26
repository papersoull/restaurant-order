"use client";

import React from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Loading } from "@/components/ui/Loading";
import { Error as ErrorMessage } from "@/components/ui/Error";

const statusLabels: Record<string, string> = {
  placed: "Placed",
  accepted: "Preparing",
  ready: "Ready",
  served: "Served",
  billed: "Billed",
};

const statusColors: Record<string, string> = {
  placed: "bg-amber-100 text-amber-900",
  accepted: "bg-sky-100 text-sky-900",
  ready: "bg-emerald-100 text-emerald-900",
  served: "bg-purple-100 text-purple-900",
  billed: "bg-slate-100 text-slate-900",
};

export default function AdminDashboard() {
  const { analytics, isLoading, error } = useAdmin();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Loading />
        </div>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ErrorMessage title="Admin Dashboard Error" message={error || "Failed to load analytics"} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-beige">
                Restaurant Management
              </p>
              <h1 className="text-3xl font-semibold text-espresso-black">Admin Dashboard</h1>
            </div>
            <div className="rounded-3xl bg-pastel-apricot px-4 py-3 text-sm font-semibold text-espresso-black">
              Cinnamon Table Bistro
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Total Orders</p>
            <p className="mt-2 text-3xl font-semibold text-espresso-black">{analytics.totalOrders}</p>
            <p className="mt-1 text-sm text-muted-beige">{analytics.todayOrders} today</p>
          </div>
          <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Total Revenue</p>
            <p className="mt-2 text-3xl font-semibold text-espresso-black">
              ₹{analytics.totalRevenue.toFixed(0)}
            </p>
            <p className="mt-1 text-sm text-muted-beige">₹{analytics.todayRevenue.toFixed(0)} today</p>
          </div>
          <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Order Status</p>
            <div className="mt-2 space-y-1">
              {analytics.orderStats.map((stat) => (
                <div key={stat.status} className="flex items-center justify-between text-sm">
                  <span className="text-muted-beige">{statusLabels[stat.status] || stat.status}</span>
                  <span className="font-semibold text-espresso-black">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Popular Items</p>
            <div className="mt-2 space-y-1">
              {analytics.popularItems.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-muted-beige truncate">{item.name}</span>
                  <span className="font-semibold text-espresso-black">{item.totalQuantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-espresso-black">Recent Activity</h2>
            <a
              href="/admin/activity"
              className="rounded-xl bg-cinnamon-brown px-5 py-2 text-sm font-semibold text-white hover:bg-[#8b593f] transition"
            >
              View All Activity
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream text-xs uppercase tracking-[0.2em] text-muted-beige">
                  <th className="pb-3 pr-4 font-semibold">Order</th>
                  <th className="pb-3 pr-4 font-semibold">Table</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 pr-4 font-semibold">Items</th>
                  <th className="pb-3 pr-4 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentOrders.slice(0, 2).map((order) => (
                  <tr key={order.id} className="border-b border-cream/50">
                    <td className="py-3 pr-4 font-semibold text-espresso-black">
                      #{order.displayNumber}
                    </td>
                    <td className="py-3 pr-4 text-muted-beige">Table {order.tableNumber}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColors[order.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-beige">{order.itemCount}</td>
                    <td className="py-3 pr-4 font-semibold text-espresso-black">
                      ₹{order.total.toFixed(0)}
                    </td>
                    <td className="py-3 text-muted-beige">
                      {new Date(order.placedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/chef"
            className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon transition hover:bg-soft-milk"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Kitchen</p>
            <p className="mt-2 text-lg font-semibold text-espresso-black">Chef Dashboard →</p>
          </a>
          <a
            href="/waiter"
            className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon transition hover:bg-soft-milk"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Service</p>
            <p className="mt-2 text-lg font-semibold text-espresso-black">Waiter Dashboard →</p>
          </a>
          <a
            href="/billing"
            className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon transition hover:bg-soft-milk"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Billing</p>
            <p className="mt-2 text-lg font-semibold text-espresso-black">Billing Dashboard →</p>
          </a>
          <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Settings</p>
            <p className="mt-2 text-lg font-semibold text-espresso-black">Restaurant Config</p>
            <p className="mt-1 text-xs text-muted-beige">Coming soon</p>
          </div>
        </div>
      </div>
    </main>
  );
}