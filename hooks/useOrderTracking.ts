import { useEffect, useState } from "react";
import { getOrder } from "@/services/orders";
import { OrderTrackingResponse } from "@/types/order";

interface OrderTrackingState {
  order: OrderTrackingResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useOrderTracking(orderId: string) {
  const [state, setState] = useState<OrderTrackingState>({
    order: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    async function fetchOrder() {
      try {
        const order = await getOrder(orderId);
        if (!isMounted) return;
        setState({ order, isLoading: false, error: null });
      } catch (error) {
        if (!isMounted) return;
        setState({ order: null, isLoading: false, error: error instanceof Error ? error.message : "Failed to fetch order" });
      }
    }

    fetchOrder();
    intervalId = setInterval(fetchOrder, 5000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId]);

  return state;
}
