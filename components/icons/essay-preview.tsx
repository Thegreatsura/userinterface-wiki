import type { IconProps } from "./types";

export const EssayPreviewIcon = ({ size = 40, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Number(size) * 1.25}
      fill="none"
      {...props}
    >
      <title>Essay Preview</title>
      <rect width="38" height="48" x="1" y="1" fill="var(--gray-2)" rx="2" />
      <rect
        width="39"
        height="49"
        x=".5"
        y=".5"
        stroke="var(--gray-a4)"
        rx="2.5"
      />
      <rect width="11" height="2" x="7" y="7" fill="var(--gray-6)" rx="1" />
      <rect width="20" height="2" x="7" y="15.5" fill="var(--gray-6)" rx="1" />
      <rect width="14" height="2" x="7" y="19.75" fill="var(--gray-6)" rx="1" />
      <rect width="16" height="2" x="7" y="28.25" fill="var(--gray-6)" rx="1" />
      <rect width="18" height="2" x="7" y="32.5" fill="var(--gray-6)" rx="1" />
      <rect width="9" height="2" x="7" y="36.75" fill="var(--gray-6)" rx="1" />
    </svg>
  );
};
