"use client";

import type { ReactNode } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { WizardHeader } from "./Header";
import { Container } from "./ui";

const STEPS = 5;

export function StepProgress({ step, label }: { step: number; label: string }) {
  return (
    <Container className="flex-none pt-3.5 md:pt-6">
      <div className="flex justify-between text-[13px] font-semibold text-muted md:text-sm">
        <span>
          Step {step} of {STEPS}
        </span>
        <span>{label}</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5 md:gap-2" role="presentation">
        {Array.from({ length: STEPS }, (_, i) => (
          <div key={i} className={`h-1 rounded-sm md:h-1.5 ${i < step ? "bg-copper" : "bg-seg"}`} />
        ))}
      </div>
    </Container>
  );
}

/** Sticky bottom bar: a price on the left and the main action on the right. */
export function BottomBar({
  label = "Total",
  amount,
  action,
  className = "",
}: {
  label?: string;
  amount: string;
  action: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sticky bottom-0 z-10 flex-none border-t border-line bg-surface ${className}`}>
      <Container className="flex items-center gap-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] md:justify-between md:pt-4 md:pb-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted">{label}</span>
          <span className="font-display text-[22px] font-bold md:text-2xl">{amount}</span>
        </div>
        {action}
      </Container>
    </div>
  );
}

/**
 * Frame for every wizard step. The step content only renders after hydration
 * because it depends on state kept in the browser (draft and cart).
 * `aside` is an optional side panel that only shows on desktop (lg and up).
 */
export function WizardShell({
  step,
  label,
  backHref,
  bottom,
  aside,
  children,
}: {
  step: number;
  label: string;
  backHref: string;
  bottom?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const hydrated = useHydrated();
  return (
    <>
      <WizardHeader backHref={backHref} />
      <StepProgress step={step} label={label} />
      <Container className="flex flex-1 flex-col">
        <div
          className={`flex flex-1 flex-col py-4 md:py-8 ${
            aside ? "lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-12" : ""
          }`}
        >
          <main className="flex flex-col gap-3 md:gap-4">{hydrated ? children : null}</main>
          {hydrated && aside ? <aside className="hidden lg:sticky lg:top-8 lg:block">{aside}</aside> : null}
        </div>
      </Container>
      {hydrated ? bottom : null}
    </>
  );
}
