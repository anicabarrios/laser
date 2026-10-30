"use client";

import Link from "next/link";
import { useCart } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { CartIcon } from "./icons";

export function CartLink() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const hydrated = useHydrated();
  const shown = hydrated ? count : 0;

  return (
    <Link
      href="/cart"
      aria-label={shown > 0 ? `Cart, ${shown} item${shown === 1 ? "" : "s"}` : "Cart"}
      className="relative flex size-11 items-center justify-center"
    >
      <CartIcon />
      {shown > 0 && (
        <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-copper px-1 text-[11px] font-semibold text-ground">
          {shown}
        </span>
      )}
    </Link>
  );
}
