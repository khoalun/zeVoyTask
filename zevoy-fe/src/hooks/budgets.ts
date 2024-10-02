import {
  createBudget,
  createBudgetEntry,
  CreateBudgetEntryRequest,
  CreateBudgetRequest,
  deleteBudgetEntry,
  editBudgetEntry,
  getBudgetEntries,
  getBudgetStats,
  getCurrentBudget,
} from "@apis";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "./toast";

export function useGetCurrentBudget() {
  return useQuery({
    queryKey: ["budgets", "current"],
    queryFn: async () => {
      const budget = await getCurrentBudget();
      return budget;
    },
    // Refetch every 2 minutes
    refetchInterval: 1000 * 60 * 2,
  });
}

export function useGetBudgetStats({ budgetId }: { budgetId?: string }) {
  return useQuery({
    queryKey: ["budgets", budgetId, "stats"],
    queryFn: async () => {
      const stats = await getBudgetStats(budgetId || "");
      return stats;
    },
    enabled: !!budgetId,
  });
}

export function useGetBudgetEntries({
  budgetId,
  limit,
  offset,
}: {
  budgetId?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [
      "budgets",
      budgetId,
      "entries",
      {
        limit,
        offset,
      },
    ],
    queryFn: async () => {
      const entries = await getBudgetEntries({
        budgetId: budgetId || "",
        limit,
        offset,
      });
      return entries;
    },
    enabled: !!budgetId,
    placeholderData: keepPreviousData,
  });
}

export function useCreateBudget() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBudgetRequest) => {
      await createBudget(data);
    },
    onSettled: () => {
      client.invalidateQueries({
        queryKey: ["budgets"],
      });
    },
  });
}

export function useCreateBudgetEntry() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateBudgetEntryRequest;
    }) => {
      await createBudgetEntry(id, data);
    },
    onSettled: () => {
      client.invalidateQueries({
        queryKey: ["budgets"],
      });
    },
  });
}

export function useEditBudgetEntry() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      budgetId,
      entryId,
      data,
    }: {
      budgetId: string;
      entryId: string;
      data: CreateBudgetEntryRequest;
    }) => {
      await editBudgetEntry(budgetId, entryId, data);
    },
    onSettled: () => {
      client.invalidateQueries({
        queryKey: ["budgets"],
      });
    },
  });
}

export function useDeleteBudgetEntry() {
  const client = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      budgetId,
      entryId,
    }: {
      budgetId: string;
      entryId: string;
    }) => {
      await deleteBudgetEntry(budgetId, entryId);
    },
    onSettled: () => {
      client.invalidateQueries({
        queryKey: ["budgets"],
      });
    },
    onSuccess: () => {
      toast({
        title: "Entry deleted",
        variant: "success",
      });
    },
    onError: (e) => {
      toast({
        title: "Failed to delete entry",
        variant: "destructive",
        description: e.message,
      });
    },
  });
}
