"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { DateFilter } from "@/components/ui/DateFilter";
import { Loading } from "@/components/ui/Loading";
import { Error as ErrorMessage } from "@/components/ui/Error";

interface ActivityItem {
  id: string;
  type: string;
  action: string;
  details: string;
  user: string;
  userRole: string | null;
  timestamp: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const typeColors: Record<string, string> = {
  order: "bg-amber-100 text-amber-900",
  billing: "bg-emerald-100 text-emerald-900",
  staff: "bg-blue-100 text-blue-900",
  menu: "bg-purple-100 text-purple-900",
  login: "bg-sky-100 text-sky-900",
};

const typeLabels: Record<string, string> = {
  order: "Order",
  billing: "Billing",
  staff: "Staff",
  menu: "Menu",
  login: "Login",
};

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/admin/activity?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      const data = await res.json();
      setActivities(data.activities);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err?.message || "Failed to load activity");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, typeFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

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
    setTypeFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasFilters = search || typeFilter || dateFrom || dateTo;

  return (
    <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-beige">
                System Activity
              </p>
              <h1 className="text-3xl font-semibold text-espresso-black">Activity Log</h1>
            </div>
            <a
              href="/admin"
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
                placeholder="Search action, details, or user..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-cream bg-soft-milk text-espresso-black focus:outline-none focus:border-cinnamon-brown transition"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cinnamon-brown text-white text-sm font-semibold hover:bg-[#8b593f] transition"
              >
                Search
              </button>
            </form>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl text-sm border border-cream bg-white text-espresso-black focus:outline-none focus:border-cinnamon-brown transition"
            >
              <option value="">All Types</option>
              <option value="order">Order Logs</option>
              <option value="billing">Billing Logs</option>
              <option value="staff">Staff Activity</option>
              <option value="menu">Menu Changes</option>
              <option value="login">Login History</option>
            </select>
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
          <ErrorMessage title="Failed to Load Activity" message={error || ""} />
        ) : activities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-cream bg-white/50 p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-muted-beige">No activity found</p>
            <p className="text-sm text-muted-beige mt-1">System activity will appear here.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-cream text-xs uppercase tracking-[0.2em] text-muted-beige">
                    <th className="pb-3 pr-4 font-semibold">Type</th>
                    <th className="pb-3 pr-4 font-semibold">Action</th>
                    <th className="pb-3 pr-4 font-semibold">Details</th>
                    <th className="pb-3 pr-4 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b border-cream/50 hover:bg-soft-milk/50 transition">
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            typeColors[activity.type] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {typeLabels[activity.type] || activity.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-medium text-espresso-black">
                        {activity.action}
                      </td>
                      <td className="py-3 pr-4 text-muted-beige text-xs max-w-xs">
                        {activity.details}
                      </td>
                      <td className="py-3 pr-4 text-muted-beige">
                        {activity.user}
                        {activity.userRole && (
                          <span className="text-xs text-muted-beige/60 ml-1">
                            ({activity.userRole})
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-muted-beige text-xs whitespace-nowrap">
                        {new Date(activity.timestamp).toLocaleString()}
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