import { SelectField, SelectValue, InputField, Button } from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBudget, useToast } from "@hooks";
import { Currency } from "@models";
import { formatAmount } from "@utils";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const budgetPlanSchema = z
  .object({
    amount: z.coerce
      .number()
      .positive()
      .nonnegative()
      .min(1)
      .refine(
        (value) => {
          return Number.isInteger(value * 100);
        },
        {
          message: "Number must have at most 2 decimal places",
        }
      )
      .optional(),
    currency: z.nativeEnum(Currency).optional(),
    usePrevious: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.usePrevious) {
        return true;
      } else {
        return data.amount !== undefined && data.currency !== undefined;
      }
    },
    {
      message: "amount and currency are required when usePrevious is false",
      path: ["amount", "currency"],
    }
  );

type SchemaType = z.infer<typeof budgetPlanSchema>;

export interface FormCreateBudgetProps {
  balance: number;
  onCreated?: () => void;
}

export function FormCreateNextBudget({ balance, onCreated }: FormCreateBudgetProps) {
  const { mutateAsync } = useCreateBudget();
  const { toast } = useToast();
  const {
    handleSubmit,
    trigger,
    control,
    setValue,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SchemaType>({
    resolver: zodResolver(budgetPlanSchema),
    mode: "onBlur",
    defaultValues: {
      usePrevious: balance > 0,
    },
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      await mutateAsync(data);
      toast({
        title: "Budget plan created",
        description: "You have successfully created a budget plan",
        variant: "success",
      });
      onCreated?.();
    } catch (error: Error | any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const disabled = isSubmitting;

  const watchUsePrevious = watch("usePrevious");

  useEffect(() => {
    if (watchUsePrevious) {
      setValue("amount", undefined);
      setValue("currency", undefined);
    }
  }, [setValue, watchUsePrevious]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
        <Controller
          name="usePrevious"
          control={control}
          render={({ field }) => {
            return (
              <div className="flex items-center space-x-2">
                <label htmlFor="usePrevious" className="flex gap-1">
                  <input
                    type="checkbox"
                    {...register("usePrevious")}
                    disabled={disabled}
                    checked={field.value}
                    onChange={(e) => {
                      setValue("usePrevious", e.target.checked);
                      trigger("usePrevious");
                    }}
                    id="usePrevious"
                  />
                  <span>Export previous budget: {formatAmount(balance)}</span>
                </label>
              </div>
            );
          }}
        />

        <Controller
          name="currency"
          control={control}
          render={({ field }) => {
            return (
              <SelectField
                label="Currency"
                selectProps={{
                  disabled: disabled || watchUsePrevious,
                  value: field.value?.toString(),
                  onValueChange: (value) => {
                    setValue("currency", parseInt(value));
                    trigger("currency");
                  },
                  renderTrigger: <SelectValue placeholder="Select currency" />,
                }}
                values={[
                  { value: Currency.EUR.toString(), label: "EUR" },
                  { value: Currency.USD.toString(), label: "USD" },
                ]}
                error={errors.currency?.message}
              />
            );
          }}
        />

        <InputField
          label="Start amount"
          inputProps={{
            type: "number",
            ...register("amount"),
            disabled: disabled || watchUsePrevious,
          }}
          error={errors.amount?.message}
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
    </>
  );
}
