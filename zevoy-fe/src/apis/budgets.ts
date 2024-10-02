import axios from "axios";

import { config } from "@configs";
import { Budget, BudgetEntry, Currency } from "@models";

export async function getCurrentBudget() {
  const result = await axios.get<{ data?: Budget }>(
    `${config.API_ENDPOINT}/budgets/current`,
    {
      withCredentials: true,
    }
  );
  return result.data.data || null;
}

export async function getBudgetStats(budgetId: string) {
  const result = await axios.get<{
    data?: {
      totalIncome: number;
      totalExpense: number;
      balance: number;
      start: number;
    };
  }>(`${config.API_ENDPOINT}/budgets/${budgetId}/stats`, {
    withCredentials: true,
  });
  return result.data.data || null;
}

export interface CreateBudgetRequest {
  amount?: number;
  currency?: Currency;
  usePrevious?: boolean;
}

export async function createBudget(data: CreateBudgetRequest) {
  const result = await axios.post<{ data: Budget }>(
    `${config.API_ENDPOINT}/budgets`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data.data;
}

export interface CreateBudgetEntryRequest {
  amount: number;
  description?: string;
  type: number;
  groupType: number;
}

export async function createBudgetEntry(
  budgetId: string,
  data: CreateBudgetEntryRequest
) {
  const result = await axios.post<{ data: BudgetEntry }>(
    `${config.API_ENDPOINT}/budgets/${budgetId}/entries`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data.data;
}

export async function getBudgetEntries({
  budgetId,
  limit,
  offset,
}: {
  budgetId: string;
  limit?: number;
  offset?: number;
}) {
  const result = await axios.get<{
    data: BudgetEntry[];
    meta: {
      total: number;
      limit: number;
      offset: number;
    };
  }>(
    `${config.API_ENDPOINT}/budgets/${budgetId}/entries?${
      limit ? `limit=${limit}&` : ""
    }${offset ? `offset=${offset}&` : ""}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
}

export interface EditBudgetEntryRequest {
  amount: number;
  description?: string;
  type: number;
  groupType: number;
}

export async function editBudgetEntry(
  budgetId: string,
  entryId: string,
  data: EditBudgetEntryRequest
) {
  const result = await axios.put<{ data: BudgetEntry }>(
    `${config.API_ENDPOINT}/budgets/${budgetId}/entries/${entryId}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data.data;
}

export async function deleteBudgetEntry(budgetId: string, entryId: string) {
  await axios.delete(
    `${config.API_ENDPOINT}/budgets/${budgetId}/entries/${entryId}`,
    {
      withCredentials: true,
    }
  );
}
