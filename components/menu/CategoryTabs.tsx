"use client";

import React from "react";
import { MenuCategory } from "@/types/menu";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-[#8B5E3C] text-white shadow-lg ring-2 ring-[#E8D2BF]"
                  : "bg-white border border-[#E6D8CB] text-[#4B3621] hover:bg-[#F5E9DC] hover:border-[#C8A98B]"
              }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}