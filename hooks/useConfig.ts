import useSWR from "swr";
import { fetchConfig, Config } from "@/lib/api";

export function useConfig() {
  const { data, error, isLoading, mutate } = useSWR<Config>(
    "config",
    fetchConfig,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    config: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
