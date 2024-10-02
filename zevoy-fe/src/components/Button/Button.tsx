import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const buttonVariants = cva(
  "font-medium font-medium py-2 px-6 rounded-[12px] disabled:text-[rgba(0,0,0,0.4)] disabled:bg-[rgba(0,0,0,0.1)] disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ",
  {
    variants: {
      intent: {
        fill: ["bg-[rgba(0,0,0,0.1)] hover:bg-[#DEE2E9]"],
        outline: ["border border-[rgba(0,0,0,0.1)] hover:bg-[#F7F8FA]"],
      },
      colorStyle: {
        default: [""],
        primary: [""],
        danger: ["text-red-600"],
      },
      size: {
        default: ["text-base"],
        icon: ["text-sm"],
      },
    },
    compoundVariants: [
      {
        intent: "fill",
        colorStyle: "primary",
        class: "text-white bg-[#007AFF] hover:bg-[#1475DE]",
      },
      {
        intent: "outline",
        colorStyle: "primary",
        class: "text-[#007AFF] border-[#007AFF] hover:bg-[#F7F8FA]",
      },
      {
        intent: "fill",
        colorStyle: "danger",
        class: "text-white bg-red-600 hover:bg-red-700",
      },
      {
        intent: "outline",
        colorStyle: "danger",
        class: "text-red-600 border-red-600 hover:bg-[#F7F8FA]",
      },
    ],
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement> &
        React.ButtonHTMLAttributes<HTMLButtonElement>,
      keyof ButtonVariantProps
    >,
    ButtonVariantProps {}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    intent = "fill",
    href,
    children,
    className,
    colorStyle = "default",
    type = "button",
    ...others
  } = props;
  const tag = href ? "a" : "button";

  return React.createElement(
    tag,
    {
      className: twMerge(
        buttonVariants({
          colorStyle,
          intent,
        }),
        className
      ),
      href,
      type,
      ref,
      ...others,
    },
    children
  );
});
