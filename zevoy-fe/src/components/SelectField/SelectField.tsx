import { SelectProps, Select, SelectGroup, SelectItem } from "@components";
import { useId } from "react";

export interface SelectFieldProps {
  label: string | React.ReactNode;
  id?: string;
  error?: string | React.ReactNode;
  selectProps: Omit<SelectProps, "children" | "id">;
  className?: string;
  values: { value: string; label: string }[];
}

export function SelectField(props: SelectFieldProps) {
  const { label, selectProps, className, error, id: propId, values } = props;

  const genId = useId();

  const id = propId || genId;

  return (
    <div className={className}>
      <label htmlFor={id} className={`block font-medium mb-1`}>
        {label}
      </label>
      <Select id={id} {...selectProps} error={!!error}>
        <SelectGroup>
          {values.map((value) => (
            <SelectItem key={value.value} value={value.value}>
              {value.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </Select>
      {error && (
        <p
          aria-live="polite"
          id={`${id}-error`}
          className="pl-2 mt-2 text-red-600 text-xs semi-bold"
        >
          {error}
        </p>
      )}
    </div>
  );
}
