import { SelectField, SelectValue, InputField, Button } from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBudgetEntry, useEditBudgetEntry, useToast } from "@hooks";
import {
  BudgetEntryGroupTypeExpenseLabel,
  BudgetEntryGroupTypeIncomeLabel,
  BudgetEntryType,
} from "@models";
import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const entrySchema = z.object({
  type: z.nativeEnum(BudgetEntryType),
  groupType: z.string(),
  amount: z.coerce.number().positive().nonnegative().min(1),
  description: z.string().max(255).optional(),
});

type SchemaType = z.infer<typeof entrySchema>;

export function FormBudgetEntry({
  budgetId: id,
  onSuccessfulSubmit,
  defaultValues,
  mode = "create",
  editId,
}: {
  budgetId: string;
  onSuccessfulSubmit?: () => void;
  defaultValues?: SchemaType;
  mode?: "create" | "edit";
  editId?: string;
}) {
  const { toast } = useToast();
  const { mutateAsync: createBudgetEntry, isPending: isPendingCreate } =
    useCreateBudgetEntry();
  const { mutateAsync: editBudgetEntry, isPending: isPendingEdit } =
    useEditBudgetEntry();
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SchemaType>({
    resolver: zodResolver(entrySchema),
    mode: "onBlur",
    defaultValues,
  });

  const createAction = async (data: SchemaType) => {
    try {
      await createBudgetEntry({
        id,
        data: {
          type: data.type,
          groupType: parseInt(data.groupType),
          amount: data.amount,
          description: data.description,
        },
      });
      toast({
        title: "Success",
        description: "Budget entry created",
        variant: "success",
      });
      onSuccessfulSubmit?.();
    } catch (error: Error | any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const editAction = async (data: SchemaType) => {
    try {
      if (!editId) {
        throw new Error("Edit ID is required");
      }
      await editBudgetEntry({
        budgetId: id,
        entryId: editId,
        data: {
          type: data.type,
          groupType: parseInt(data.groupType),
          amount: data.amount,
          description: data.description,
        },
      });
      toast({
        title: "Success",
        description: "Budget entry updated",
        variant: "success",
      });
      onSuccessfulSubmit?.();
    } catch (error: Error | any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitAction = async (data: SchemaType) => {
    try {
      if (mode === "create") {
        await createAction(data);
      } else {
        await editAction(data);
      }
      onSuccessfulSubmit?.();
    } catch (error: Error | any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const disabled = isSubmitting || isPendingCreate || isPendingEdit;

  const typeSelected = watch("type");

  useEffect(() => {
    if (typeSelected) {
      if (defaultValues?.type !== typeSelected) {
        setValue("groupType", "");
      } else {
        setValue("groupType", defaultValues?.groupType);
      }
    }
  }, [defaultValues?.groupType, defaultValues?.type, setValue, typeSelected]);

  const groupTypeValues = useMemo(() => {
    if (!typeSelected) return [];

    if (typeSelected === BudgetEntryType.INCOME) {
      return Object.entries(BudgetEntryGroupTypeIncomeLabel).map(
        ([key, value]) => ({
          label: value,
          value: key,
        })
      );
    }

    if (typeSelected === BudgetEntryType.EXPENSE) {
      return Object.entries(BudgetEntryGroupTypeExpenseLabel).map(
        ([key, value]) => ({
          label: value,
          value: key,
        })
      );
    }

    return [];
  }, [typeSelected]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitAction)}
      className="mt-4 space-y-6"
    >
      <Controller
        name="type"
        control={control}
        render={({ field }) => {
          return (
            <SelectField
              label="Type"
              selectProps={{
                disabled,
                value: field.value?.toString(),
                onValueChange: (value) => {
                  setValue("type", parseInt(value));
                },
                renderTrigger: <SelectValue placeholder="Select type" />,
              }}
              values={[
                { label: "Income", value: BudgetEntryType.INCOME.toString() },
                { label: "Expense", value: BudgetEntryType.EXPENSE.toString() },
              ]}
              error={errors.type?.message}
            />
          );
        }}
      />

      <Controller
        name="groupType"
        control={control}
        render={({ field }) => {
          return (
            <SelectField
              label="Group type"
              selectProps={{
                disabled,
                value: field.value?.toString(),
                onValueChange: (value) => {
                  setValue("groupType", value);
                },
                renderTrigger: <SelectValue placeholder="Select group type" />,
              }}
              values={groupTypeValues}
              error={errors.groupType?.message}
            />
          );
        }}
      />

      <InputField
        label="Amount"
        inputProps={{
          type: "number",
          ...register("amount"),
          disabled,
        }}
        error={errors.amount?.message}
      />
      <InputField
        label="Description"
        inputProps={{
          type: "description",
          ...register("description"),
          disabled,
          multiline: true,
          rows: 3,
        }}
        error={errors.description?.message}
      />
      <div className="text-center">
        <Button
          intent="fill"
          colorStyle="primary"
          type="submit"
          disabled={disabled}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
