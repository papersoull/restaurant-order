"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { DateFilter } from "@/components/ui/DateFilter";
import { Loading } from "@/components/ui/Loading";
import { Error as ErrorMessage } from "@/components/ui/Error";

interface WaiterOrderHistory {
  id: string;
  displayNumber: number;
  status: string;
  tableNumber: number;
  placedAt: string;
  servedAt: string | null;
  deliveryTime: number | null;
  waiterName: string | null;
  readyAt: string | null;
  items: { name: string; quantity: number; priceAtOrder: number }[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusLabels: Record<string, string> = {
  served: "Served",
  billed: "Billed",
};

const statusColors: Record<string, string> = {
  served: "bg-purple-100 text-purple-900",
  billed: "bg-slate-100 text-slate-900",
};

export default function WaiterHistoryPage() {
  const [orders, setOrders] = useState<WaiterOrderHistory[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [waiterName, setWaiterName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");
      if (search) params.set("search", search);
      if (tableNumber) params.set("table", tableNumber);
      if (waiterName) params.set("waiter", waiterName);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/waiter/history?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch waiter history");
      const data = await res.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err?.message || "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, tableNumber, waiterName, dateFrom, dateTo]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDatePreset = (preset: string) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    
    switch (preset) {
      case "today":
        setDateFrom(today);
        setDateTo(today);
        break;
      case "yesterday": {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        setDateFrom(yesterday.toISOString().split("T")[0]);
        setDateTo(yesterday.toISOString().split("T")[0]);
        break;
      }
      case "last7": {
        const last7 = new Date(now);
        last7.setDate(last7.getDate() - 7);
        setDateFrom(last7.toISOString().split("T")[0]);
        setDateTo(today);
        break;
      }
      case "last30": {
        const last30 = new Date(now);
        last30.setDate(last30.getDate() - 30);
        setDateFrom(last30.toISOString().split("T")[0]);
        setDateTo(today);
        break;
      }
    }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setTableNumber("");
    setWaiterName("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasFilters = search || tableNumber || waiterName || dateFrom || dateTo;

  return (
    <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-beige">
                Service History
              </p>
              <h1 className="text-3xl font-semibold text-espresso-black">Served Orders</h1>
            </div>
            <a
              href="/waiter"
              className="rounded-2xl bg-soft-milk px-5 py-2.5 text-sm font-semibold text-espresso-black hover:bg-cream transition border border-cream"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by order number..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-cream bg-soft-milk text-espresso-black focus:outline-none focus:border-cinnamon-brown transition"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cinnamon-brown text-white text-sm font-semibold hover:bg-[#8b593f] transition"
              >
                Search
              </button>
            </form>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => { setTableNumber(e.target.value); setPage(1); }}
              placeholder="Table No."
              className="w-28 px-4 py-2.5 rounded-xl text-sm border border-cream bg-white text-espresso-black focus:outline-none focus:border-cinnamon-brown transition"
            />
            <input
              type="text"
              value={waiterName}
              onChange={(e) => { setWaiterName(e.target.value); setPage(1); }}
              placeholder="Waiter name"
              className="w-36 px-4 py-2.5 rounded-xl text-sm border border-cream bg-white text-espresso-black focus:outline-none focus:border-cinnamon-brown transition"
            />
          </div>
          <DateFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={(v) => { setDateFrom(v); setPage(1); }}
            onDateToChange={(v) => { setDateTo(v); setPage(1); }}
            onPresetChange={handleDatePreset}
          />
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-beige hover:text-espresso-black underline transition"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage title="Failed to Load History" message={error || ""} />
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-cream bg-white/50 p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-muted-beige">No served orders found</p>
            <p className="text-sm text-muted-beige mt-1">Orders that have been served will appear here.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-cream text-xs uppercase tracking-[0.2em] text-muted-beige">
                    <th className="pb-3 pr-4 font-semibold">Order</th>
                    <th className="pb-3 pr-4 font-semibold">Table</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 pr-4 font-semibold">Items</th>
                    <th className="pb-3 pr-4 font-semibold">Delivery Time</th>
                    <th className="pb-3 pr-4 font-semibold">Served Time</th>
                    <th className="pb-3 font-semibold">Waiter</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-cream/50 hover:bg-soft-milk/50 transition">
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
                      <td className="py-3 pr-4">
                        <div className="flex flex-col gap-0.5">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="text-muted-beige text-xs">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        {order.deliveryTime !== null ? (
                          <span className="font-medium text-espresso-black">{order.deliveryTime} min</span>
                        ) : (
                          <span className="text-muted-beige">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-muted-beige text-xs">
                          {order.servedAt
                            ? new Date(order.servedAt).toLocaleString()
                            : "—"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-muted-beige">{order.waiterName || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}