import {
  Collapsible,
  CollapsibleTrigger,
  Typography,
  CollapsibleContent,
  IconButton,
} from "@components";
import {
  BudgetEntryType,
  BudgetEntryGroupTypeIncomeLabel,
  BudgetEntryGroupTypeIncomeIcon,
  BudgetEntryGroupTypeExpenseLabel,
  BudgetEntryGroupTypeExpenseIcon,
} from "@models";
import { formatAmount } from "@utils";
import { ChevronDownIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export interface EntryDisplayProps {
  type: BudgetEntryType;
  amount: number;
  description?: string;
  groupType: number;
  currency: string;
  date: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isPending?: boolean;
}

export function EntryDisplay({
  type,
  amount,
  description,
  groupType,
  currency,
  date,
  onEdit,
  onDelete,
  isPending: isLocked,
}: EntryDisplayProps) {
  const isIncome = type === BudgetEntryType.INCOME;

  const groupTypeDisplay = useMemo(() => {
    if (type === BudgetEntryType.INCOME) {
      return {
        label: BudgetEntryGroupTypeIncomeLabel[groupType],
        icon: BudgetEntryGroupTypeIncomeIcon[groupType],
        color: "text-green-600",
      };
    }

    if (type === BudgetEntryType.EXPENSE) {
      return {
        label: BudgetEntryGroupTypeExpenseLabel[groupType],
        icon: BudgetEntryGroupTypeExpenseIcon[groupType],
        color: "text-red-600",
      };
    }
  }, [groupType, type]);

  const Icon = groupTypeDisplay?.icon;

  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full">
        <div
          className="
      flex justify-between items-center
      py-2 border-b border-[#EFF2F7]
    "
        >
          <div className="flex items-center">
            <Typography as="p" className="font-medium">
              {Icon && (
                <Icon
                  className={twMerge(
                    ["inline-block mr-2"],
                    groupTypeDisplay?.color
                  )}
                />
              )}
              <span className="font-medium">{groupTypeDisplay?.label}</span>
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <Typography
              as="p"
              className={twMerge(["font-medium"], groupTypeDisplay?.color)}
            >
              {isIncome ? "+" : "-"} {currency}
              {formatAmount(amount)}
            </Typography>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-4 py-2">
          <div className="flex justify-between">
            <Typography className="text-sm text-[#6B7280] font-medium">
              {date}
            </Typography>
            <div className="flex gap-1">
              <IconButton
                title={`Edit ${groupTypeDisplay?.label} entry`}
                onClick={onEdit}
                disabled={isLocked}
              >
                <PencilIcon size={16} />
              </IconButton>
              <IconButton
                title={`Delete ${groupTypeDisplay?.label} entry`}
                onClick={onDelete}
                disabled={isLocked}
              >
                <TrashIcon size={16} />
              </IconButton>
            </div>
          </div>
          {description && (
            <Typography as="p" className="text-sm mt-1">
              {description}
            </Typography>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
