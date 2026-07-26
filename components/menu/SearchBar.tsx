"use client";

import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="rounded-3xl border border-cream bg-white p-4 shadow-cinnamon">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search dishes..."
        className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
