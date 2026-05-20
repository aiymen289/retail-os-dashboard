import useSWR from "swr";
import { fetchActivityFeed, ActivityEvent } from "@/lib/api";

export function useActivityFeed() {
  const { data, error, isLoading, mutate } = useSWR<ActivityEvent[]>(
    "activity-feed",
    fetchActivityFeed,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 120000, // 2 minutes
    }
  );

  return {
    activities: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
