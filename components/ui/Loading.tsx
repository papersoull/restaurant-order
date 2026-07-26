import React from "react";

export function Loading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-slate-500 shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
