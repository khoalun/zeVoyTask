import { SVGProps } from "react";

export const Check = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M18.509 6.668c.457.436.475 1.16.039 1.617l-7.626 8.008a1.144 1.144 0 0 1-1.609.047L5.5 12.781a1.144 1.144 0 1 1 1.56-1.672l2.986 2.786 6.845-7.188a1.144 1.144 0 0 1 1.618-.04Z"
      clipRule="evenodd"
    />
  </svg>
);
