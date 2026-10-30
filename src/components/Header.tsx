import Link from "next/link";
import { site } from "@/lib/site";
import { BackIcon } from "./icons";
import { CartLink } from "./CartLink";

export function HomeHeader() {
  return (
    <header className="flex h-[60px] flex-none items-center justify-between border-b border-line bg-surface pr-2 pl-5">
      <Link href="/" className="font-display text-xl font-bold tracking-tight">
        {site.name}
      </Link>
      <CartLink />
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
    <header className="flex h-14 flex-none items-center justify-between border-b border-line bg-surface px-2">
      <Link href={backHref} aria-label="Back" className="flex size-11 items-center justify-center">
        <BackIcon />
      </Link>
      <span className="font-display text-[17px] font-bold">{title}</span>
      {showCart ? <CartLink /> : <span className="size-11" />}
    </header>
  );
}
