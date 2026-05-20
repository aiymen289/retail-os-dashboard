import useSWR from "swr";
import { fetchDashboardMetrics, DashboardMetrics } from "@/lib/api";

export function useMetrics() {
  const { data, error, isLoading, mutate } = useSWR<DashboardMetrics>(
    "dashboard-metrics",
    fetchDashboardMetrics,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    metrics: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
