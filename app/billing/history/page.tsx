"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { DateFilter } from "@/components/ui/DateFilter";
import { Loading } from "@/components/ui/Loading";
import { Error as ErrorMessage } from "@/components/ui/Error";

interface BillHistoryItem {
  id: string;
  displayNumber: number;
  tableNumber: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  isPrinted: boolean;
  createdAt: string;
  items: { name: string; quantity: number; priceAtOrder: number }[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SummaryInfo {
  totalRevenue: number;
  totalBills: number;
}

export default function BillingHistoryPage() {
  const [bills, setBills] = useState<BillHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [summary, setSummary] = useState<SummaryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tableNumber, setTableNumber] = useState("");
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
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/billing/history?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch billing history");
      const data = await res.json();
      setBills(data.bills);
      setPagination(data.pagination);
      setSummary(data.summary);
    } catch (err: any) {
      setError(err?.message || "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, tableNumber, dateFrom, dateTo]);

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
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasFilters = search || tableNumber || dateFrom || dateTo;

  const handlePrint = (bill: BillHistoryItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = bill.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 6px 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.priceAtOrder.toFixed(0)}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.priceAtOrder * item.quantity).toFixed(0)}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${bill.displayNumber}</title>
          <style>
            @page {
    size: 80mm auto;
    margin: 0;
}

html,
body{
    width:80mm;
    margin:0;
    padding:8px;
    font-family: monospace;
    font-size:11px;
    color:#000;
    background:white;
}

.receipt{
    width:100%;
}

h1{
    margin:0;
    text-align:center;
    font-size:18px;
}

.subtitle{
    text-align:center;
    font-size:10px;
    margin:4px 0;
}

.divider{
    border-top:1px dashed #000;
    margin:8px 0;
}

table{
    width:100%;
    border-collapse:collapse;
}

th{
    font-size:10px;
    text-align:left;
    border-bottom:1px dashed #000;
}

td{
    font-size:10px;
    padding:2px 0;
}

.right{
    text-align:right;
}

.center{
    text-align:center;
}

.footer{
    text-align:center;
    margin-top:10px;
    font-size:10px;
}
          </style>
        </head>
        <body>
          <h1>Bill</h1>
          <p class="subtitle">Cinnamon Table Bistro<br/>42, MG Road, Indore</p>
          <div class="divider"></div>
          <p><strong>Invoice #${bill.displayNumber}</strong> | Table ${bill.tableNumber}</p>
          <p>Date: ${new Date(bill.createdAt).toLocaleString()}</p>
          <div class="divider"></div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="divider"></div>
          <table>
            <tr>
              <td style="text-align: right; padding: 4px 12px;">Subtotal</td>
              <td style="text-align: right; padding: 4px 12px; width: 100px;">₹${bill.subtotal.toFixed(0)}</td>
            </tr>
            <tr>
              <td style="text-align: right; padding: 4px 12px;">GST (5%)</td>
              <td style="text-align: right; padding: 4px 12px;">₹${bill.taxAmount.toFixed(0)}</td>
            </tr>
            <tr class="total-row">
              <td style="text-align: right; padding: 4px 12px;">Grand Total</td>
              <td style="text-align: right; padding: 4px 12px;">₹${bill.total.toFixed(0)}</td>
            </tr>
          </table>
          <div class="divider"></div>
          <p class="footer">Thank you for dining with us!<br/>Visit again :)</p>
          <script>
            printWindow.document.close();
printWindow.focus();

setTimeout(() => {
  printWindow.print();
  printWindow.close();
}, 300);
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-beige">
                Billing History
              </p>
              <h1 className="text-3xl font-semibold text-espresso-black">All Bills</h1>
            </div>
            <a
              href="/billing"
              className="rounded-2xl bg-soft-milk px-5 py-2.5 text-sm font-semibold text-espresso-black hover:bg-cream transition border border-cream"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Total Revenue</p>
              <p className="mt-2 text-3xl font-semibold text-espresso-black">
                ₹{summary.totalRevenue.toFixed(0)}
              </p>
            </div>
            <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-beige">Total Bills</p>
              <p className="mt-2 text-3xl font-semibold text-espresso-black">
                {summary.totalBills}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by bill number..."
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
        ) : bills.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-cream bg-white/50 p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-muted-beige">No bills found</p>
            <p className="text-sm text-muted-beige mt-1">Completed bills will appear here.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-cream text-xs uppercase tracking-[0.2em] text-muted-beige">
                    <th className="pb-3 pr-4 font-semibold">Bill #</th>
                    <th className="pb-3 pr-4 font-semibold">Table</th>
                    <th className="pb-3 pr-4 font-semibold">Items</th>
                    <th className="pb-3 pr-4 font-semibold">Subtotal</th>
                    <th className="pb-3 pr-4 font-semibold">GST</th>
                    <th className="pb-3 pr-4 font-semibold">Total</th>
                    <th className="pb-3 pr-4 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="border-b border-cream/50 hover:bg-soft-milk/50 transition">
                      <td className="py-3 pr-4 font-semibold text-espresso-black">
                        #{bill.displayNumber}
                      </td>
                      <td className="py-3 pr-4 text-muted-beige">Table {bill.tableNumber}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-col gap-0.5">
                          {bill.items.map((item, idx) => (
                            <span key={idx} className="text-muted-beige text-xs">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-beige">₹{bill.subtotal.toFixed(0)}</td>
                      <td className="py-3 pr-4 text-muted-beige">₹{bill.taxAmount.toFixed(0)}</td>
                      <td className="py-3 pr-4 font-semibold text-espresso-black">
                        ₹{bill.total.toFixed(0)}
                      </td>
                      <td className="py-3 pr-4 text-muted-beige text-xs">
                        {new Date(bill.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePrint(bill)}
                            className="px-3 py-1.5 rounded-lg bg-soft-milk text-espresso-black text-xs font-medium hover:bg-cream transition border border-cream"
                          >
                            Print
                          </button>
                          <button
                            onClick={() => handlePrint(bill)}
                            className="px-3 py-1.5 rounded-lg bg-cinnamon-brown text-white text-xs font-medium hover:bg-[#8b593f] transition"
                          >
                            PDF
                          </button>
                        </div>
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