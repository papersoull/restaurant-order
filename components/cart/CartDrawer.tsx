"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";

export function CartDrawer({
  onCheckout,
  isLoading,
}: {
  onCheckout: () => void;
  isLoading?: boolean;
}) {
  const { items, totalQuantity, totalAmount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Cart Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 rounded-full border border-[#D8C3AE] bg-[#F5E9DC] px-5 py-3 text-[#5C3A21] shadow-xl transition-all duration-200 hover:bg-[#EEDCC9] hover:shadow-2xl"
      >
        <span className="text-sm font-semibold">Cart</span>

        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B5E3C] text-xs font-bold text-white">
          {totalQuantity}
        </span>
      </button>

      {isOpen ? (
        <div className="mt-3 w-[360px] rounded-3xl border border-cream bg-white p-5 shadow-2xl shadow-cinnamon">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Cart</h2>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-900"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">
                Your cart is empty.
              </p>
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.itemId}
                  itemId={item.itemId}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                />
              ))
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-slate-700">
            <div>
              <p className="text-sm">Total</p>
              <p className="text-lg font-semibold">
                ₹{totalAmount.toFixed(0)}
              </p>
            </div>

            <button
              type="button"
              disabled={items.length === 0 || isLoading}
              onClick={onCheckout}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? "Placing order..." : "Checkout"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}


// "use client";

// import { useState } from "react";
// import { useCart } from "@/hooks/useCart";
// import { CartItem } from "@/components/cart/CartItem";

// export function CartDrawer({
//   onCheckout,
//   isLoading,
// }: {
//   onCheckout: () => void;
//   isLoading?: boolean;
// }) {
//   const { items, totalQuantity, totalAmount } = useCart();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
// {/* Floating Cart Button */}
// <div className="fixed bottom-6 right-6 z-40">
//   <button
//     type="button"
//     onClick={() => setIsOpen(true)}
//     className="flex items-center gap-3 rounded-full border border-[#D8C3AE] bg-[#F5E9DC] px-5 py-3 text-[#5C3A21] shadow-lg transition hover:bg-[#EEDCC9]"
//   >
//     <span className="font-semibold">Cart</span>

//     <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B5E3C] text-sm font-bold text-white">
//       {totalQuantity}
//     </span>
//   </button>
// </div>

//       {/* Drawer */}
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <div
//             className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
//             onClick={() => setIsOpen(false)}
//           />

//           {/* Cart Panel */}
//           <div className="fixed top-0 right-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-[#D8C3AE] shadow-2xl"
//      style={{ backgroundColor: "#a07648" }}>
//             {/* Header */}
//             <div className="flex items-center justify-between border-b border-cream px-6 py-5">
//               <div>
//                 <h2 className="text-2xl font-bold text-espresso-black">
//                   Your Cart
//                 </h2>
//                 <p className="text-sm text-muted-beige">
//                   {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setIsOpen(false)}
//                 className="rounded-full p-2 text-2xl text-gray-500 transition hover:bg-soft-milk hover:text-black"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Cart Items */}
//             <div className="flex-1 overflow-y-auto px-6 py-5">
//               {items.length === 0 ? (
//                 <div className="flex h-full flex-col items-center justify-center text-center">
//                   <div className="mb-4 text-6xl">🛒</div>

//                   <h3 className="text-xl font-semibold text-espresso-black">
//                     Your cart is empty
//                   </h3>

//                   <p className="mt-2 text-sm text-muted-beige">
//                     Add some delicious dishes to get started.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {items.map((item) => (
//                     <CartItem
//                       key={item.itemId}
//                       itemId={item.itemId}
//                       name={item.name}
//                       price={item.price}
//                       quantity={item.quantity}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="border-t border-cream bg-white px-6 py-5">
//               <div className="mb-5 flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-beige">
//                     Total Amount
//                   </p>

//                   <p className="text-3xl font-bold text-espresso-black">
//                     ₹{totalAmount.toFixed(0)}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 disabled={items.length === 0 || isLoading}
//                 onClick={onCheckout}
//                 className="w-full rounded-2xl bg-cinnamon-brown py-4 text-lg font-semibold text-white transition hover:bg-[#7A4D32] disabled:cursor-not-allowed disabled:bg-[#d9b69e]"
//               >
//                 {isLoading ? "Placing Order..." : "Proceed to Checkout"}
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }