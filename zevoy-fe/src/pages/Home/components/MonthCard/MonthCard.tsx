import { Card, Typography, Dialog, Button } from "@components";
import { formatAmount } from "@utils";
import { useBool } from "@hooks";
import { FormCreateNextBudget } from "../FormCreateNextBudget";

export interface MonthCardProps {
  monthDisplay: string;
  isThePast?: boolean;
  startingAmount?: number;
  currency: string;
  balance: number;
}

export function MonthCard(props: MonthCardProps) {
  const { monthDisplay, isThePast, startingAmount, currency, balance } = props;
  const createBudgetDialog = useBool();
  return (
    <div className="max-w-[800px] mx-auto">
      <Card>
        <div className="flex  flex-col lg:flex-row">
          <div className="flex items-center gap-1">
            <Typography as="h2" textStyle="heading2">
              {monthDisplay}
            </Typography>
            {isThePast && (
              <Typography className="mt-2 lg:mt-0 lg:ml-auto">
                (Past)
              </Typography>
            )}
          </div>
          {isThePast && (
            <Dialog
              open={createBudgetDialog.value}
              onOpenChange={createBudgetDialog.toggle}
              headerTitle="Create next month budget tracker"
              trigger={
                <Button
                  className="mt-2 lg:mt-0 lg:ml-auto"
                  colorStyle="primary"
                >
                  Create current month
                </Button>
              }
            >
              <FormCreateNextBudget
                balance={balance}
                onCreated={createBudgetDialog.toggle}
              />
            </Dialog>
          )}
        </div>
        <Typography className="mt-2 text-md font-medium">
          Start this month
        </Typography>
        <Typography className="mt-1 font-medium text-lg">
          {currency}
          {formatAmount(startingAmount || 0)}
        </Typography>
      </Card>
    </div>
  );
}
