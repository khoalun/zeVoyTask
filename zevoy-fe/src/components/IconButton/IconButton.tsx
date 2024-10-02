import { twMerge } from "tailwind-merge";

export interface LocalIconButtonProps {
  variant?: string;
}

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "variant">,
    LocalIconButtonProps {}

export function IconButton(props: IconButtonProps) {
  const { children, className, ...others } = props;
  return (
    <button
      type="button"
      className={twMerge(
        "p-1.5 text-[20px] rounded-[8px] hover:bg-background focus:bg-background transition-colors",
        className
      )}
      {...others}
    >
      {children}
    </button>
  );
}
