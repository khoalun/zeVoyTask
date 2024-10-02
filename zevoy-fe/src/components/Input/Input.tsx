import React from "react";
import { twMerge } from "tailwind-merge";

export interface LocalInputProps {
  variant?: string;
  multiline?: boolean;
}

export interface InputProps
  extends Omit<
      React.AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
      "variant"
    >,
    LocalInputProps {}

export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>((props, ref) => {
  const { className, multiline, ...others } = props;

  if (multiline) {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={twMerge(
          "resize-none bg-background disabled:cursor-not-allowed disabled:opacity-50 px-3 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground w-full",
          className
        )}
        {...others}
      />
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      className={twMerge(
        "h-9 bg-background disabled:cursor-not-allowed disabled:opacity-50 px-3 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground w-full",
        className
      )}
      {...others}
    />
  );
});
