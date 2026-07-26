"use client";

import Image from "next/image";
import { MenuItem } from "@/types/menu";
import { useCart } from "@/hooks/useCart";

const dishImages = [
  "/images/dishes/dish-1.png",
  "/images/dishes/dish-2.png",
  "/images/dishes/dish-3.png",
  "/images/dishes/dish-4.png",
];

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addItem } = useCart();
  const imageIndex = Math.abs(
    item.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % dishImages.length;
  const dishImage = dishImages[imageIndex];

  return (
    <div className="rounded-3xl border border-cream bg-white p-5 shadow-cinnamon">
      <div className="relative h-44 overflow-hidden rounded-3xl bg-soft-milk">
        <Image src={dishImage} alt={item.name} fill className="object-cover" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={`h-3.5 w-3.5 rounded-full ${item.name.toLowerCase().includes("veg") ? "bg-[#7AAE7A]" : "bg-[#D17F62]"}`} />
            <h3 className="text-lg font-semibold text-espresso-black">{item.name}</h3>
          </div>
          <p className="text-sm text-muted-beige">Delicious choice for your table.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-[#2D1B12]">
    ₹{item.price.toFixed(0)}
  </p>
          <p className="mt-1 text-xs text-muted-beige">{item.isAvailable ? "Available" : "Unavailable"}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
<button
  type="button"
  onClick={() =>
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    })
  }
  disabled={!item.isAvailable}
  className="
    rounded-xl
    bg-[#8B5E3C]
    px-4 py-2.5
    text-sm font-semibold
    text-[#FFF8F2]
    transition-all duration-200
    hover:bg-[#744B2E]
    active:scale-95
    disabled:cursor-not-allowed
    disabled:bg-[#D7B9A2]
    disabled:text-[#F6EFE9]
  "
>
  Add
</button>
      </div>
    </div>
  );
}
