import { SVGProps } from "react";

export const Unroll = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.47 5.53a.75.75 0 1 0 1.06-1.06L9.237 2.177a1.75 1.75 0 0 0-2.474 0L4.47 4.47a.75.75 0 0 0 1.06 1.06l2.293-2.293a.25.25 0 0 1 .354 0L10.47 5.53Zm-4.94 4.94a.75.75 0 0 0-1.06 1.06l2.293 2.293a1.75 1.75 0 0 0 2.474 0l2.293-2.293a.75.75 0 1 0-1.06-1.06l-2.293 2.293a.25.25 0 0 1-.354 0L5.53 10.47Z"
      clipRule="evenodd"
    />
  </svg>
);
