export enum Currency {
  USD = 1,
  EUR = 2,
}

export interface Budget {
  id: string;
  user_id: number;
  total_amount: number;
  month: string;
  start?: number;
  created_at: Date;
  currency: Currency;
}

export enum BudgetEntryType {
  INCOME = 1,
  EXPENSE = 2,
}
