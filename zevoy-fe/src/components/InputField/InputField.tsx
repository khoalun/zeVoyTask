import React, { useId } from "react";

import { Input, InputProps } from "@components";

export interface InputFieldProps {
  label: string | React.ReactNode;
  error?: string | React.ReactNode;
  inputProps: InputProps;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  inputProps,
  className,
}) => {
  const genId = useId();

  const id = inputProps.id || genId;

  return (
    <div className={className}>
      <label htmlFor={id} className={`block font-medium mb-2`}>
        {label}
      </label>
      <Input
        {...inputProps}
        id={id}
        className={inputProps.className}
        aria-describedby={`${id}-error`}
        aria-invalid={error ? "true" : "false"}
      />
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
};
