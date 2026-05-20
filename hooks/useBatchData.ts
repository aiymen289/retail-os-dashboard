import useSWR from "swr";
import { fetchAllInventory, InventoryItemDetail } from "@/lib/api";

export function useBatchData() {
  const { data, error, isLoading, mutate } = useSWR<InventoryItemDetail[]>(
    "batch-data",
    fetchAllInventory,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    batches: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
