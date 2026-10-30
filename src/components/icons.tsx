import type { ReactNode, SVGProps } from "react";
import type { MotifId } from "@/lib/ids";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Svg({ size = 24, strokeWidth = 1.8, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const CartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);
export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);
export const NextIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const CheckIcon = (p: IconProps) => (
  <Svg strokeWidth={2.4} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const UploadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const MinusIcon = (p: IconProps) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const PlusIcon = (p: IconProps) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);
export const EyeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
export const MoveIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v18M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4M7 8l-4 4 4 4M17 8l4 4-4 4" />
  </Svg>
);

/** The six gallery motifs. Stroke colour comes from `currentColor`. */
export function MotifIcon({ id, className }: { id: MotifId; className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {id === "ring" && (
        <>
          <circle cx="18" cy="18" r="12" />
          <circle cx="18" cy="18" r="6" />
        </>
      )}
      {id === "star" && <path d="M18 5l4.2 8.6 9.3 1.3-6.7 6.6 1.6 9.3L18 26.4l-8.4 4.4 1.6-9.3-6.7-6.6 9.3-1.3L18 5Z" />}
      {id === "diamond" && (
        <>
          <path d="M18 5l13 13-13 13L5 18 18 5Z" />
          <path d="M18 12l6 6-6 6-6-6 6-6Z" />
        </>
      )}
      {id === "waves" && (
        <>
          <path d="M5 22c4-8 8-8 13 0s9 8 13 0" />
          <path d="M5 14c4-8 8-8 13 0s9 8 13 0" />
        </>
      )}
      {id === "peak" && (
        <>
          <path d="M18 5L5 29h26L18 5Z" />
          <path d="M18 15v8" />
        </>
      )}
      {id === "grid" && (
        <>
          <rect x="6" y="6" width="24" height="24" rx="4" />
          <path d="M6 18h24M18 6v24" />
        </>
      )}
    </svg>
  );
}
