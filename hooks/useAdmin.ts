"use client";

import { useEffect, useState, useCallback } from "react";
import { getAnalytics, AnalyticsResponse } from "@/services/admin";

interface AdminState {
  analytics: AnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useAdmin() {
  const [state, setState] = useState<AdminState>({
    analytics: null,
    isLoading: true,
    error: null,
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getAnalytics();
      setState({
        analytics: data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch analytics",
      }));
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  return {
    ...state,
    refresh: fetchAnalytics,
  };
}