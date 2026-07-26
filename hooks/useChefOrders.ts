"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus, OrderListItem } from "@/services/orders";

interface ChefOrdersState {
  placed: OrderListItem[];
  accepted: OrderListItem[];
  ready: OrderListItem[];
  isLoading: boolean;
  error: string | null;
}

export function useChefOrders() {
  const [state, setState] = useState<ChefOrdersState>({
    placed: [],
    accepted: [],
    ready: [],
    isLoading: true,
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const [placedOrders, acceptedOrders, readyOrders] = await Promise.all([
        getOrders("placed"),
        getOrders("accepted"),
        getOrders("ready"),
      ]);

      setState({
        placed: placedOrders,
        accepted: acceptedOrders,
        ready: readyOrders,
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

  const moveToAccepted = async (orderId: string, estimatedMinutes?: number) => {
    try {
      await updateOrderStatus(orderId, "accepted", estimatedMinutes);
      await fetchOrders();
    } catch (error) {
      console.error("Failed to accept order", error);
    }
  };

  const moveToReady = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "ready");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to mark order ready", error);
    }
  };

  return {
    ...state,
    moveToAccepted,
    moveToReady,
    refresh: fetchOrders,
  };
}