import type { IconProps } from "./types";

export const CodePreviewIcon = ({ size = 40, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Number(size) * 1.25}
      fill="none"
      {...props}
    >
      <title>Code Preview</title>
      <rect width="38" height="48" x="1" y="1" fill="var(--gray-2)" rx="2" />
      <rect
        width="39"
        height="49"
        x=".5"
        y=".5"
        stroke="var(--gray-a4)"
        rx="2.5"
      />
      <rect width="2" height="2" x="5" y="7" fill="var(--gray-6)" rx="1" />
      <rect width="4" height="2" x="9" y="7" fill="var(--blue-9)" rx="1" />
      <rect width="6" height="2" x="15" y="7" fill="var(--amber-9)" rx="1" />
      <rect width="2" height="2" x="5" y="11.25" fill="var(--gray-6)" rx="1" />
      <rect width="4" height="2" x="9" y="11.25" fill="var(--blue-9)" rx="1" />
      <rect width="6" height="2" x="15" y="11.25" fill="var(--gray-8)" rx="1" />
      <rect width="3" height="2" x="23" y="11.25" fill="var(--blue-9)" rx="1" />
      <rect
        width="6"
        height="2"
        x="28"
        y="11.25"
        fill="var(--amber-9)"
        rx="1"
      />
      <rect width="2" height="2" x="5" y="15.5" fill="var(--gray-6)" rx="1" />
      <rect width="2" height="2" x="5" y="19.75" fill="var(--gray-6)" rx="1" />
      <rect width="4" height="2" x="9" y="19.75" fill="var(--blue-9)" rx="1" />
      <rect width="6" height="2" x="15" y="19.75" fill="var(--gray-8)" rx="1" />
      <rect width="2" height="2" x="23" y="19.75" fill="var(--blue-9)" rx="1" />
      <rect width="2" height="2" x="27" y="19.75" fill="var(--gray-8)" rx="1" />
      <rect
        width="4"
        height="2"
        x="31"
        y="19.75"
        fill="var(--amber-9)"
        rx="1"
      />
      <rect width="2" height="2" x="5" y="24" fill="var(--gray-6)" rx="1" />
      <rect width="8" height="2" x="15" y="24" fill="var(--blue-6)" rx="1" />
      <rect width="10" height="2" x="25" y="24" fill="var(--amber-9)" rx="1" />
      <rect width="2" height="2" x="5" y="28.25" fill="var(--gray-6)" rx="1" />
      <rect width="6" height="2" x="15" y="28.25" fill="var(--blue-6)" rx="1" />
      <rect
        width="9"
        height="2"
        x="23"
        y="28.25"
        fill="var(--amber-9)"
        rx="1"
      />
      <rect width="2" height="2" x="5" y="32.5" fill="var(--gray-6)" rx="1" />
      <rect width="2" height="2" x="5" y="36.75" fill="var(--gray-6)" rx="1" />
      <rect width="2" height="2" x="5" y="41" fill="var(--gray-6)" rx="1" />
    </svg>
  );
};
