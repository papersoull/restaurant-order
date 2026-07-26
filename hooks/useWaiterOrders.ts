"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus, OrderListItem } from "@/services/orders";

interface WaiterOrdersState {
  ready: OrderListItem[];
  served: OrderListItem[];
  isLoading: boolean;
  error: string | null;
}

export function useWaiterOrders() {
  const [state, setState] = useState<WaiterOrdersState>({
    ready: [],
    served: [],
    isLoading: true,
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const [readyOrders, servedOrders] = await Promise.all([
        getOrders("ready"),
        getOrders("served"),
      ]);

      setState({
        ready: readyOrders,
        served: servedOrders,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch orders",
      }));
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const markServed = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "served");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to mark order served", error);
    }
  };

  return {
    ...state,
    markServed,
    refresh: fetchOrders,
  };
}