"use client";

import React, { useState, useEffect } from "react";
import { useWaiterOrders } from "@/hooks/useWaiterOrders";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Loading } from "@/components/ui/Loading";
import { Error } from "@/components/ui/Error";

interface ServedOrder {
  id: string;
  displayNumber: number;
  status: string;
  tableNumber: number;
  servedAt: string;
  waiterName: string | null;
  items: { name: string; quantity: number }[];
}

function getElapsedMinutes(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m ago`;
}

export default function WaiterDashboard() {
  const { ready, served, isLoading, error, markServed } = useWaiterOrders();
  const [recentServed, setRecentServed] = useState<ServedOrder[]>([]);
  const [servingId, setServingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentServed = async () => {
      try {
        const res = await fetch("/api/waiter/history?page=1&limit=2");
        if (res.ok) {
          const data = await res.json();
          setRecentServed(data.orders || []);
        }
      } catch { /* silent */ }
    };
    fetchRecentServed();
  }, [served.length]);

  const handleServe = (orderId: string) => {
    setServingId(orderId);
    markServed(orderId);
    setTimeout(() => setServingId(null), 500);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardHeader title="Waiter Dashboard" description="Monitor ready orders..." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1,2,3,4].map(i => <StatCard key={i} title="Loading" value="—" isLoading />)}
        </div>
        <Loading />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardHeader title="Waiter Dashboard" description="Service Station" />
        <Error title="Waiter Dashboard Error" message={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader title="Waiter Dashboard" description="Monitor ready orders, deliver food efficiently and manage served tables." />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Ready to Serve"
          value={ready.length}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          color="success"
          subtitle="Awaiting delivery"
        />
        <StatCard
          title="Delivered Today"
          value={served.length}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/></svg>}
          color="primary"
        />
        <StatCard
          title="Active Tables"
          value={ready.length + served.length}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
          color="info"
        />
        <StatCard
          title="Avg Delivery"
          value="—"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
          color="warning"
        />
      </div>

      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Ready to Serve */}
        <div className="bg-card rounded-card-xl border border-default shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-default">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="font-semibold text-primary-text">Ready to Serve</h2>
            </div>
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">{ready.length}</span>
          </div>
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {ready.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-sm text-muted-text">No orders ready to serve</p>
              </div>
            ) : (
              ready.map((order) => (
                <div key={order.id} className="bg-page rounded-xl p-4 border border-default animate-fade-in hover-lift">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-primary-text">#{order.displayNumber}</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-text">
                        <span>Table {order.tableNumber}</span>
                        <span>Ready {getElapsedMinutes(order.placedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-primary-text">{item.name}</span>
                        <span className="text-xs font-medium text-secondary-text bg-card px-2 py-0.5 rounded-md">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleServe(order.id)}
                    disabled={servingId === order.id}
                    className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all btn-ripple disabled:opacity-50"
                  >
                    {servingId === order.id ? "Serving..." : "Mark as Served"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Served */}
        <div className="bg-card rounded-card-xl border border-default shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-default">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <h2 className="font-semibold text-primary-text">Served</h2>
            </div>
            <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">{served.length}</span>
          </div>
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {served.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7"/></svg>
                <p className="text-sm text-muted-text">No orders served yet</p>
              </div>
            ) : (
              served.slice(0, 5).map((order) => (
                <div key={order.id} className="bg-page rounded-xl p-4 border border-default animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-primary-text">#{order.displayNumber}</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-purple-50 text-purple-700 border-purple-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Served
                        </span>
                      </div>
                      <p className="text-xs text-muted-text">Table {order.tableNumber}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs text-secondary-text bg-card px-2 py-0.5 rounded-md border border-default">{item.name} x{item.quantity}</span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-muted-text">+{order.items.length - 3}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recently Served (last 2) */}
      {recentServed.length > 0 && (
        <div className="bg-card rounded-card-xl border border-default shadow-card overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-5 py-4 border-b border-default">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <h2 className="font-semibold text-primary-text">Recently Served Orders</h2>
            </div>
            <a href="/waiter/history" className="text-sm font-medium text-primary-color hover:text-primary-hover transition px-3 py-1.5 rounded-lg hover:bg-primary-light">
              View All Served Orders →
            </a>
          </div>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {recentServed.map((order) => (
                <div key={order.id} className="bg-page rounded-xl p-4 border border-default animate-fade-in">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-primary-text">#{order.displayNumber}</span>
                      <span className="text-xs text-muted-text ml-2">Table {order.tableNumber}</span>
                    </div>
                    <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">{order.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {order.items.slice(0, 3).map((item, idx) => {
                      return (
                        <span key={idx} className="text-xs text-secondary-text bg-card px-2 py-0.5 rounded-md border border-default">{item.name} x{item.quantity}</span>
                      );
                    })}
                    {order.items.length > 3 && (
                      <span className="text-xs text-muted-text">+{order.items.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-text">
                    <span>{order.waiterName ? `Waiter: ${order.waiterName}` : ""}</span>
                    <span>{order.servedAt ? new Date(order.servedAt).toLocaleTimeString() : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}