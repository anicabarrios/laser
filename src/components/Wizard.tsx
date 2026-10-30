"use client";

import type { ReactNode } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { WizardHeader } from "./Header";

const STEPS = 5;

export function StepProgress({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex-none px-5 pt-3.5">
      <div className="flex justify-between text-[13px] font-semibold text-muted">
        <span>
          Step {step} of {STEPS}
        </span>
        <span>{label}</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5" role="presentation">
        {Array.from({ length: STEPS }, (_, i) => (
          <div key={i} className={`h-1 rounded-sm ${i < step ? "bg-copper" : "bg-seg"}`} />
        ))}
      </div>
    </div>
  );
}

/** Sticky bottom bar: a price on the left and the main action on the right. */
export function BottomBar({ label = "Total", amount, action }: { label?: string; amount: string; action: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-none items-center gap-4 border-t border-line bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
      <div className="flex flex-col">
        <span className="text-xs text-muted">{label}</span>
        <span className="font-display text-[22px] font-bold">{amount}</span>
      </div>
      {action}
    </div>
  );
}

/**
 * Frame for every wizard step. The step content only renders after hydration
 * because it depends on state kept in the browser (draft and cart).
 */
export function WizardShell({
  step,
  label,
  backHref,
  bottom,
  children,
}: {
  step: number;
  label: string;
  backHref: string;
  bottom?: ReactNode;
  children: ReactNode;
}) {
  const hydrated = useHydrated();
  return (
    <>
      <WizardHeader backHref={backHref} />
      <StepProgress step={step} label={label} />
      <main className="flex flex-1 flex-col gap-3 px-5 py-4">{hydrated ? children : null}</main>
      {hydrated ? bottom : null}
    </>
  );
}
