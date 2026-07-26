"use client";

import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <p className="text-sm text-muted-beige">
        Showing page {page} of {totalPages} ({total} total records)
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-2 rounded-xl text-sm font-medium border border-cream bg-white text-espresso-black hover:bg-soft-milk disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        {getPageNumbers().map((p, idx) =>
          typeof p === "string" ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted-beige text-sm">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                p === page
                  ? "bg-cinnamon-brown text-white shadow-sm"
                  : "border border-cream bg-white text-espresso-black hover:bg-soft-milk"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-2 rounded-xl text-sm font-medium border border-cream bg-white text-espresso-black hover:bg-soft-milk disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}