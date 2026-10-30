import Link from "next/link";
import { site } from "@/lib/site";
import { BackIcon } from "./icons";
import { CartLink } from "./CartLink";

export function HomeHeader() {
  return (
    <header className="flex-none border-b border-line bg-surface">
      <div className="mx-auto flex h-[60px] w-full max-w-6xl items-center justify-between pr-2 pl-5 md:h-[68px] md:px-8">
        <Link href="/" className="font-display text-xl font-bold tracking-tight md:text-2xl">
          {site.name}
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/order/material"
            className="hidden h-11 items-center rounded-xl bg-copper px-5 text-sm font-semibold text-ground transition hover:brightness-105 md:flex"
          >
            Start your order
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}

export function WizardHeader({
  backHref,
  title = "New order",
  showCart = true,
}: {
  backHref: string;
  title?: string;
  showCart?: boolean;
}) {
  return (
    <header className="flex-none border-b border-line bg-surface">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-2 md:h-16 md:px-5">
        <Link href={backHref} aria-label="Back" className="flex size-11 items-center justify-center">
          <BackIcon />
        </Link>
        <span className="font-display text-[17px] font-bold md:text-lg">{title}</span>
        {showCart ? <CartLink /> : <span className="size-11" />}
      </div>
    </header>
  );
}
