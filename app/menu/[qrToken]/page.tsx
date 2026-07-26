"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMenu } from "@/hooks/useMenu";
import { useCart } from "@/hooks/useCart";
import { getTable } from "@/services/table";
import { createOrder } from "@/services/orders";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchBar } from "@/components/menu/SearchBar";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { MenuSkeleton } from "@/components/menu/MenuSkeleton";
import { Loading } from "@/components/ui/Loading";
import { Error } from "@/components/ui/Error";

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const qrToken = params?.qrToken as string;
  const [tableError, setTableError] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const { categories, isLoading, error } = useMenu();
  const { items, totalQuantity, clearCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    getTable(qrToken)
      .then((table) => {
        if (!isMounted) return;
        setTableNumber(table.tableNumber);
        setTableError(null);
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        setTableError(
          fetchError instanceof Error
            ? fetchError.message || "Invalid table QR code"
            : "Invalid table QR code"
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsTableLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [qrToken]);

  const activeCategories = useMemo(() => {
    if (categories.length === 0) return [];
    return categories;
  }, [categories]);

  useEffect(() => {
    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [activeCategoryId, categories]);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setCheckoutError("Add items to your cart before placing an order.");
      return;
    }

    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const orderResponse = await createOrder({
        qrToken,
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      });
      clearCart();
      router.push(`/track/${orderResponse.order_id}`);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message || "Failed to place order" : "Failed to place order"
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (isTableLoading) {
    return <Loading />;
  }

  if (tableError) {
    return <Error title="Invalid QR Code" message={tableError} />;
  }

  if (error) {
    return <Error title="Menu Load Failed" message={error} />;
  }

  return (
    <main className="min-h-screen bg-soft-milk px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-cream bg-white p-6 shadow-cinnamon">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-beige">Table {tableNumber}</p>
              <h1 className="text-3xl font-semibold text-espresso-black">Browse the menu</h1>
            </div>
            <div className="rounded-3xl bg-pastel-apricot px-4 py-3 text-sm font-semibold text-espresso-black">
              {totalQuantity} items in cart
            </div>
          </div>
          {checkoutError ? (
            <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {checkoutError}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryTabs
            categories={activeCategories}
            activeCategoryId={activeCategoryId || activeCategories[0]?.id || ""}
            onSelect={setActiveCategoryId}
          />
        </div>

        {isLoading ? <MenuSkeleton /> : <MenuGrid categories={activeCategories} searchQuery={searchQuery} activeCategoryId={activeCategoryId || activeCategories[0]?.id || ""} />}
      </div>

      <CartDrawer onCheckout={handleCheckout} isLoading={isCheckoutLoading} />
    </main>
  );
}
