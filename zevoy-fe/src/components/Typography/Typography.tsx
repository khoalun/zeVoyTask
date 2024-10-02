import { PolymorphicProps } from "@types";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const variants = cva("", {
  variants: {
    textStyle: {
      heading: [
        "font-bold text-[22px] leading-[28px] lg:text-[24px] lg:leading-[32px]",
      ],
      heading2: ["font-bold text-[18px] lg:text-[20px] lg:leading-[28px]"],
      subheading: ["font-medium text-[18px] leading-[24px]"],
      body: ["font-normal text-[16px] leading-[24px]"],
    },
  },
});

type TypographyVariants = VariantProps<typeof variants>;

export type TypographyProps<T extends React.ElementType> = PolymorphicProps<T> &
  TypographyVariants & {
    className?: string;
  };

export function Typography<T extends React.ElementType = "p">({
  as,
  textStyle = "body",
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as || "p";

  return (
    <Component
      {...props}
      className={twMerge(
        variants({
          textStyle,
        }),
        className
      )}
    />
  );
}
