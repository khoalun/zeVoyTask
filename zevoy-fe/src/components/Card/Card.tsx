import React from "react";

import { twMerge } from "tailwind-merge";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card(props: CardProps) {
  const { children, className } = props;
  return (
    <div className={twMerge("bg-card rounded-2xl px-4 py-6", className)}>
      {children}
    </div>
  );
}
