import { Card, Typography } from "@components";
import { useGetBudgetStats, useGetCurrentBudget } from "@hooks";
import { EntryList, Welcome } from "./components";
import { formatAmount } from "@utils";
import { getCurrencySymbol } from "@models";
import { useMemo } from "react";
import { MonthCard } from "./components/MonthCard";

export function HomePage() {
  const { data: budget, isFetched } = useGetCurrentBudget();
  const { data: budgetStats } = useGetBudgetStats({ budgetId: budget?.id });

  const currencyLabel = budget?.currency
    ? getCurrencySymbol(budget.currency)
    : undefined;

  const monthDisplay = useMemo(() => {
    if (budget) {
      const date = new Date(budget.month);
      return date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    }
  }, [budget]);

  const isThePast = useMemo(() => {
    function setStartMonth(date: Date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(1);
      return date;
    }
    if (budget) {
      let date = new Date(budget.month);
      date = setStartMonth(date);
      const today = new Date();
      return date < setStartMonth(today);
    }
    return false;
  }, [budget]);

  return (
    <div className="pt-10 px-4">
      {!budget && isFetched && <Welcome />}
      {budget && monthDisplay && (
        <>
          <MonthCard
            monthDisplay={monthDisplay}
            isThePast={isThePast}
            startingAmount={budgetStats?.start}
            currency={currencyLabel || ""}
            balance={budgetStats?.balance || 0}
          />
          <div className="mt-4 flex justify-center">
            <div className="grid gap-4 md:grid-cols-3 mb-8  w-[800px]">
              <Card>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-md font-medium">Current balance</h3>
                </div>
                <div>
                  <Typography className="text-2xl font-bold">
                    {currencyLabel}
                    {formatAmount(budgetStats?.balance || 0)}
                  </Typography>
                </div>
              </Card>
              <Card>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-md font-medium">Income</h3>
                </div>
                <div>
                  <Typography className="text-2xl font-bold text-green-600">
                    {currencyLabel}
                    {formatAmount(budgetStats?.totalIncome || 0)}
                  </Typography>
                </div>
              </Card>
              <Card>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-md font-medium">Expenses</h3>
                </div>
                <div>
                  <Typography className="text-2xl font-bold text-red-600">
                    {currencyLabel}
                    {formatAmount(budgetStats?.totalExpense || 0)}
                  </Typography>
                </div>
              </Card>
            </div>
          </div>
          <EntryList budgetId={budget.id} currency={budget.currency} />
        </>
      )}
    </div>
  );
}
