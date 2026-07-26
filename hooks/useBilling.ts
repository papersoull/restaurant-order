"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrders, OrderListItem } from "@/services/orders";
import { getBills, generateBill, BillResponse } from "@/services/bills";

interface BillingState {
  servedOrders: OrderListItem[];
  billedOrders: OrderListItem[];
  bills: BillResponse[];
  isLoading: boolean;
  error: string | null;
}

export function useBilling() {
  const [state, setState] = useState<BillingState>({
    servedOrders: [],
    billedOrders: [],
    bills: [],
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const [servedOrders, billedOrders, bills] = await Promise.all([
        getOrders("served"),
        getOrders("billed"),
        getBills(),
      ]);

      setState({
        servedOrders,
        billedOrders,
        bills,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch billing data",
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleGenerateBill = async (orderId: string) => {
    try {
      await generateBill({ orderId });
      await fetchData();
    } catch (error) {
      console.error("Failed to generate bill", error);
    }
  };

  return {
    ...state,
    generateBill: handleGenerateBill,
    refresh: fetchData,
  };
}