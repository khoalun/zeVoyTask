import { SVGProps } from "react";

export const Undo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.22 6.032a.75.75 0 0 0 0 1.06l3.75 3.75a.75.75 0 0 0 1.06-1.06l-2.47-2.47h5.69a4.25 4.25 0 0 1 0 8.5H10a.75.75 0 0 0 0 1.5h1.25a5.75 5.75 0 1 0 0-11.5H5.56l2.47-2.47a.75.75 0 1 0-1.06-1.06l-3.75 3.75Z"
      clipRule="evenodd"
    />
  </svg>
);
