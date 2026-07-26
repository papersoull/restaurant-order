"use client";

import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export function CartItem({ itemId, name, price, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-cream bg-white p-4 shadow-cinnamon">
      <div>
        <p className="font-semibold text-espresso-black">{name}</p>
        <p className="text-sm text-muted-beige">₹{price.toFixed(0)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQuantity(itemId, quantity - 1)}
          className="h-9 w-9 rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
        >
          -
        </button>
        <span className="min-w-[32px] text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(itemId, quantity + 1)}
          className="h-9 w-9 rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => removeItem(itemId)}
          className="ml-4 text-sm text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
