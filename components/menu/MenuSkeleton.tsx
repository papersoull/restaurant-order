import React from "react";

export function MenuSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 rounded-3xl bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-3/4 rounded-full bg-slate-200" />
            <div className="h-4 w-1/2 rounded-full bg-slate-200" />
            <div className="h-10 rounded-3xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
