import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { MaterialId } from "@/lib/ids";

const primary =
  "flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-copper px-6 text-base font-semibold text-ground transition active:brightness-90";
const disabledState = "cursor-not-allowed opacity-40";

/** Copper call-to-action that is a link. When disabled it is not focusable or clickable. */
export function PrimaryLink({
  href,
  disabled = false,
  className = "",
  children,
}: {
  href: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span aria-disabled="true" className={`${primary} ${disabledState} ${className}`}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={`${primary} ${className}`}>
      {children}
    </Link>
  );
}

export function PrimaryButton({
  className = "",
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${primary} ${disabled ? disabledState : "cursor-pointer"} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Material swatch used until real photos are added. */
export function Swatch({ material, className = "" }: { material: MaterialId; className?: string }) {
  return <div aria-hidden="true" className={`swatch-${material} ${className}`} />;
}

export const displayFont = "font-display";
