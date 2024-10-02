import {
  BathIcon,
  CarIcon,
  CircleHelpIcon,
  DramaIcon,
  FuelIcon,
  GiftIcon,
  HandCoinsIcon,
  HandshakeIcon,
  HeartPulseIcon,
  HouseIcon,
  PizzaIcon,
  ShoppingCartIcon,
  WalletIcon,
} from "lucide-react";

export enum BoardObjectType {
  TEXT = "TEXT",
  POINT = "POINT",
  LINE = "LINE",
  POLYGON = "POLYGON",
  NOTE = "NOTE",
  MORE = "MORE",
}

export interface PointMarker {
  id: string;
  lat: number;
  lng: number;
  labelSize: string;
  category: string;
  installYear: number;
  usageState: string;
  owner: string;
}

export interface User {
  id: string;
  email: string;
}

export enum Currency {
  USD = 1,
  EUR = 2,
}

export interface Budget {
  id: string;
  user_id: string;
  total_amount: number;
  month: string;
  created_at: string;
  currency: Currency;
}

export function getCurrencySymbol(currency: Currency) {
  switch (currency) {
    case Currency.USD:
      return "$";
    case Currency.EUR:
      return "€";
  }
}

export enum BudgetEntryType {
  INCOME = 1,
  EXPENSE = 2,
}

export enum BudgetEntryGroupTypeIncome {
  SALARY = 1,
  GIFTS = 2,
  FREELANCE = 3,
  OTHER = 4,
}

export const BudgetEntryGroupTypeIncomeLabel: {
  [key: number]: string;
} = {
  [BudgetEntryGroupTypeIncome.SALARY]: "Salary",
  [BudgetEntryGroupTypeIncome.GIFTS]: "Gifts",
  [BudgetEntryGroupTypeIncome.FREELANCE]: "Freelance",
  [BudgetEntryGroupTypeIncome.OTHER]: "Other",
};

export enum BudgetEntryGroupTypeExpense {
  FOOD = 1,
  HOUSING = 2,
  TRANSPORTATION = 3,
  HEALTH = 4,
  INSURANCE = 5,
  ENTERTAINMENT = 6,
  SHOPPING = 7,
  UTILITIES = 8,
  PERSONAL_CARE = 9,
  OTHER = 10,
}

export const BudgetEntryGroupTypeExpenseLabel: {
  [key: number]: string;
} = {
  [BudgetEntryGroupTypeExpense.FOOD]: "Food",
  [BudgetEntryGroupTypeExpense.HOUSING]: "Housing",
  [BudgetEntryGroupTypeExpense.TRANSPORTATION]: "Transportation",
  [BudgetEntryGroupTypeExpense.HEALTH]: "Health",
  [BudgetEntryGroupTypeExpense.INSURANCE]: "Insurance",
  [BudgetEntryGroupTypeExpense.ENTERTAINMENT]: "Entertainment",
  [BudgetEntryGroupTypeExpense.SHOPPING]: "Shopping",
  [BudgetEntryGroupTypeExpense.UTILITIES]: "Utilities",
  [BudgetEntryGroupTypeExpense.PERSONAL_CARE]: "Personal Care",
  [BudgetEntryGroupTypeExpense.OTHER]: "Other",
};

export const BudgetEntryGroupTypeExpenseIcon: {
  [key: number]: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
} = {
  [BudgetEntryGroupTypeExpense.FOOD]: PizzaIcon,
  [BudgetEntryGroupTypeExpense.HOUSING]: HouseIcon,
  [BudgetEntryGroupTypeExpense.TRANSPORTATION]: CarIcon,
  [BudgetEntryGroupTypeExpense.HEALTH]: HeartPulseIcon,
  [BudgetEntryGroupTypeExpense.INSURANCE]: HandCoinsIcon,
  [BudgetEntryGroupTypeExpense.ENTERTAINMENT]: DramaIcon,
  [BudgetEntryGroupTypeExpense.SHOPPING]: ShoppingCartIcon,
  [BudgetEntryGroupTypeExpense.UTILITIES]: FuelIcon,
  [BudgetEntryGroupTypeExpense.PERSONAL_CARE]: BathIcon,
  [BudgetEntryGroupTypeExpense.OTHER]: CircleHelpIcon,
};

export const BudgetEntryGroupTypeIncomeIcon: {
  [key: number]: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
} = {
  [BudgetEntryGroupTypeIncome.SALARY]: WalletIcon,
  [BudgetEntryGroupTypeIncome.GIFTS]: GiftIcon,
  [BudgetEntryGroupTypeIncome.FREELANCE]: HandshakeIcon,
  [BudgetEntryGroupTypeIncome.OTHER]: CircleHelpIcon,
};

export interface BudgetEntry {
  id: string;
  budget_id: string;
  description?: string;
  amount: number;
  type: BudgetEntryType;
  group_type: BudgetEntryGroupTypeIncome | BudgetEntryGroupTypeExpense;
  created_at: string;
}
