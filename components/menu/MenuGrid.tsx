"use client";

import { MenuCategory } from "@/types/menu";
import { MenuCard } from "@/components/menu/MenuCard";

interface MenuGridProps {
  categories: MenuCategory[];
  searchQuery: string;
  activeCategoryId: string;
}

export function MenuGrid({ categories, searchQuery, activeCategoryId }: MenuGridProps) {
  const filteredCategories = categories
    .filter((category) => category.id === activeCategoryId)
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="space-y-8">
      {filteredCategories.map((category) => (
        <section key={category.id}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-espresso-black">{category.name}</h2>
            <span className="rounded-full bg-pastel-apricot px-3 py-1 text-sm text-espresso-black">
              {category.items.length} items
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {category.items.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
      {filteredCategories.length === 0 ? (
        <div className="rounded-3xl border border-cream bg-white p-8 text-center text-espresso-black shadow-cinnamon">
          No items match your search.
        </div>
      ) : null}
    </div>
  );
}
