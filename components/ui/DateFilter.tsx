"use client";

import React from "react";

interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onPresetChange: (preset: string) => void;
}

export function DateFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onPresetChange,
}: DateFilterProps) {
  const presets = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7" },
    { label: "Last 30 Days", value: "last30" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onPresetChange(preset.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-cream bg-white text-muted-beige hover:bg-soft-milk hover:text-espresso-black transition"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs border border-cream bg-white text-espresso-black focus:outline-none focus:border-cinnamon-brown transition"
        />
        <span className="text-xs text-muted-beige">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs border border-cream bg-white text-espresso-black focus:outline-none focus:border-cinnamon-brown transition"
        />
      </div>
    </div>
  );
}