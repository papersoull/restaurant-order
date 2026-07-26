"use client";

import React, { useState, useEffect } from "react";
import { useChefOrders } from "@/hooks/useChefOrders";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Loading } from "@/components/ui/Loading";
import { Error } from "@/components/ui/Error";

interface CompletedOrder {
  id: string;
  displayNumber: number;
  status: string;
  tableNumber: number;
  prepTime: number | null;
  chefName: string | null;
  completionTime: string;
  items: { name: string; quantity: number }[];
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

function getEstimatedRemaining(estimatedMinutes: number | null, placedAt: string): string {
  if (!estimatedMinutes) return "—";
  const elapsed = (Date.now() - new Date(placedAt).getTime()) / 60000;
  const remaining = Math.max(0, estimatedMinutes - elapsed);
  return Math.round(remaining) + " min";
}

const statusConfig = {
  placed: { label: "New", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  accepted: { label: "Preparing", color: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
  ready: { label: "Ready", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

export default function ChefDashboard() {
  const { placed, accepted, ready, isLoading, error, moveToAccepted, moveToReady } = useChefOrders();
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await fetch("/api/chef/history?page=1&limit=2&status=ready");
        if (res.ok) {
          const data = await res.json();
          setCompletedOrders(data.orders || []);
        }
      } catch { /* silent */ }
    };
    fetchCompleted();
  }, [ready.length]);

  // Calculate average prep time
  const avgPrepTime = (() => {
    const allOrders = [...placed, ...accepted, ...ready];
    if (allOrders.length === 0) return "0 min";
    return "—";
  })();

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardHeader title="Chef Dashboard" description="Manage kitchen operations, monitor incoming orders..." />
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
        <DashboardHeader title="Chef Dashboard" description="Kitchen Display System" />
        <Error title="Chef Dashboard Error" message={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader title="Chef Dashboard" description="Manage kitchen operations, monitor incoming orders, update preparation progress and estimated completion times." />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="New Orders"
          value={placed.length}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>}
          color="warning"
        />
        <StatCard
          title="Preparing"
          value={accepted.length}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>}
          color="info"
        />
        <StatCard
          title="Ready to Serve"
          value={ready.length}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          color="success"
        />
        <StatCard
          title="Avg Prep Time"
          value={avgPrepTime}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          color="primary"
        />
      </div>

      {/* Order Columns */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Placed / New Orders */}
        <div className="bg-card rounded-card-xl border border-default shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-default">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="font-semibold text-primary-text">Incoming Orders</h2>
            </div>
            <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">{placed.length}</span>
          </div>
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {placed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                <p className="text-sm text-muted-text">No new orders yet</p>
              </div>
            ) : (
              placed.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.placed;
                return (
                  <div key={order.id} className="bg-page rounded-xl p-4 border border-default animate-fade-in hover-lift">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-primary-text">#{order.displayNumber}</span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-text">
                          <span>Table {order.tableNumber}</span>
                          <span>{getElapsedMinutes(order.placedAt)}</span>
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
                    {order.status === "placed" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-secondary-text">Est. time:</span>
                          <input
                            type="number"
                            min={1}
                            max={120}
                            value={estimatedMinutes}
                            onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 15)}
                            className="w-16 px-2 py-1 text-xs font-medium border border-default rounded-lg bg-card text-primary-text text-center focus:outline-none focus:border-primary"
                          />
                          <span className="text-xs text-muted-text">min</span>
                        </div>
                        <button
                          onClick={() => { moveToAccepted(order.id, estimatedMinutes); }}
                          className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all btn-ripple"
                        >
                          Start Preparing
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Accepted / Preparing */}
        <div className="bg-card rounded-card-xl border border-default shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-default">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <h2 className="font-semibold text-primary-text">Preparing</h2>
            </div>
            <span className="text-sm font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg">{accepted.length}</span>
          </div>
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {accepted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-sm text-muted-text">No orders being prepared</p>
              </div>
            ) : (
              accepted.map((order) => (
                <div key={order.id} className="bg-page rounded-xl p-4 border border-default animate-fade-in hover-lift">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-primary-text">#{order.displayNumber}</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-sky-50 text-sky-700 border-sky-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>Preparing
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-text">
                        <span>Table {order.tableNumber}</span>
                        <span>{getElapsedMinutes(order.placedAt)}</span>
                      </div>
                    </div>
                    {order.estimatedMinutes && (
                      <span className="text-xs font-medium text-primary-color bg-primary-50 px-2.5 py-1 rounded-lg">
                        Est: {getEstimatedRemaining(order.estimatedMinutes, order.placedAt)}
                      </span>
                    )}
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
                    onClick={() => moveToReady(order.id)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all btn-ripple"
                  >
                    Mark as Ready
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready Orders */}
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
                <p className="text-sm text-muted-text">No ready orders</p>
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
                        <span>{getElapsedMinutes(order.placedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-primary-text">{item.name}</span>
                        <span className="text-xs font-medium text-secondary-text bg-card px-2 py-0.5 rounded-md">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recently Completed */}
      <div className="bg-card rounded-card-xl border border-default shadow-card overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-default">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <h2 className="font-semibold text-primary-text">Recently Completed</h2>
          </div>
          <a href="/chef/history" className="text-sm font-medium text-primary-color hover:text-primary-hover transition px-3 py-1.5 rounded-lg hover:bg-primary-light">
            View All Prepared Orders →
          </a>
        </div>
        <div className="p-5">
          {completedOrders.length === 0 ? (
            <p className="text-sm text-muted-text text-center py-6">No recently completed orders.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {completedOrders.map((order) => (
                <div key={order.id} className="bg-page rounded-xl p-4 border border-default animate-fade-in">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-primary-text">#{order.displayNumber}</span>
                      <span className="text-xs text-muted-text ml-2">Table {order.tableNumber}</span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{order.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs text-secondary-text bg-card px-2 py-0.5 rounded-md border border-default">{item.name} x{item.quantity}</span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-muted-text">+{order.items.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-text">
                    <span>{order.chefName ? `Chef: ${order.chefName}` : ""}</span>
                    <span>{order.completionTime ? new Date(order.completionTime).toLocaleTimeString() : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}