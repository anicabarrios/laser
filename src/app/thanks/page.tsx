import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";
import { PrimaryLink } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Thank you" };

const NEXT_STEPS = [
  "We review your file and prepare the engraving.",
  "We send you a proof, if you asked for one.",
  `We engrave and ship within ${site.shipDays} days. You get an email with a tracking number.`,
];

export default function Page() {
  return (
    <>
      <ClearCartOnSuccess />
      <header className="flex h-14 flex-none items-center justify-center border-b border-line bg-surface">
        <span className="font-display text-xl font-bold tracking-tight">{site.name}</span>
      </header>

      <main className="flex flex-1 flex-col items-center gap-3 px-5 pt-10 pb-4">
        <div className="flex size-[72px] items-center justify-center rounded-full bg-copper text-ground">
          <CheckIcon size={36} />
        </div>
        <h1 className="mt-2 text-center font-display text-[28px] leading-[1.15] font-bold tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-center text-[15px] leading-normal text-muted">We sent a confirmation to your email.</p>

        <section className="mt-4 flex w-full flex-col gap-3.5 rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-display text-lg font-bold">What happens next</h2>
          {NEXT_STEPS.map((text, i) => (
            <div key={text} className="flex items-start gap-3">
              <span className="flex size-7 flex-none items-center justify-center rounded-full bg-seg text-sm font-semibold">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[15px] leading-snug">{text}</span>
            </div>
          ))}
        </section>
      </main>

      <div className="sticky bottom-0 flex flex-none flex-col gap-1 border-t border-line bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        <PrimaryLink href="/" className="flex-none">
          Back to home
        </PrimaryLink>
        <Link href={`mailto:${site.contactEmail}`} className="flex min-h-11 items-center justify-center text-sm font-semibold text-muted">
          Questions? Contact us
        </Link>
      </div>
    </>
  );
}
