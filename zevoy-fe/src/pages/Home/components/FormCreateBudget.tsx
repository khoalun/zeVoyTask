import {
  Typography,
  SelectField,
  SelectValue,
  InputField,
  Button,
} from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBudget, useToast } from "@hooks";
import { Currency } from "@models";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const budgetPlanSchema = z.object({
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
    ),
  currency: z.nativeEnum(Currency),
});

type SchemaType = z.infer<typeof budgetPlanSchema>;

export interface FormCreateBudgetProps {
  hideTitle?: boolean;
}

export function FormCreateBudget({ hideTitle }: FormCreateBudgetProps) {
  const { mutateAsync } = useCreateBudget();
  const { toast } = useToast();
  const {
    handleSubmit,
    trigger,
    control,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SchemaType>({
    resolver: zodResolver(budgetPlanSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      await mutateAsync(data);
      toast({
        title: "Budget plan created",
        description: "You have successfully created a budget plan",
        variant: "success",
      });
    } catch (error: Error | any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const disabled = isSubmitting;

  return (
    <>
      {!hideTitle && (
        <Typography as="h2" textStyle="heading2">
          Create your first budget
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
        <Controller
          name="currency"
          control={control}
          render={({ field }) => {
            return (
              <SelectField
                label="Currency"
                selectProps={{
                  disabled,
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
            disabled,
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
