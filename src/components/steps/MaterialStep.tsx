"use client";

import { MATERIALS, formatUSD, materialFromCents } from "@/lib/catalog";
import { site } from "@/lib/site";
import { useDraft } from "@/lib/store";
import { CheckIcon } from "../icons";
import { PrimaryLink, Swatch } from "../ui";
import { BottomBar, WizardShell } from "../Wizard";

export function MaterialStep() {
  const material = useDraft((s) => s.material);
  const setMaterial = useDraft((s) => s.setMaterial);

  return (
    <WizardShell
      step={1}
      label="Material"
      backHref="/"
      bottom={
        <BottomBar
          label="From"
          amount={material ? formatUSD(materialFromCents(material)) : "–"}
          action={
            <PrimaryLink href="/order/product" disabled={!material}>
              Next
            </PrimaryLink>
          }
        />
      }
    >
      <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-tight md:text-4xl">What should we engrave on?</h1>
      <p className="mb-1 text-[15px] leading-snug text-muted md:mb-3 md:text-lg">Each material gives the engraving a different look.</p>

      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-5">
        {MATERIALS.map((m) => {
          const selected = m.id === material;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setMaterial(m.id)}
              className={`relative flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-3 text-left md:flex-col md:items-stretch md:gap-4 md:p-4 ${
                selected ? "border-copper bg-tint" : "border-line bg-surface md:hover:border-edge"
              }`}
            >
              <Swatch material={m.id} className="size-24 flex-none rounded-xl border border-black/10 md:h-44 md:w-full" />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-display text-xl font-bold md:text-2xl">{m.name}</span>
                <span className="text-sm leading-snug text-muted md:text-[15px]">{m.blurb}</span>
              </span>
              <span
                className={`flex size-6 flex-none items-center justify-center rounded-full md:absolute md:top-7 md:right-7 ${
                  selected ? "bg-copper text-ground" : "border-2 border-edge md:bg-ground/50"
                }`}
              >
                {selected && <CheckIcon size={16} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-dashed border-edge px-4 py-3.5 md:max-w-xl">
        <span className="text-sm leading-snug text-muted">Not sure what to pick?</span>
        <a href={`mailto:${site.contactEmail}`} className="flex min-h-11 flex-none items-center text-sm font-semibold text-copper">
          Message us
        </a>
      </div>
    </WizardShell>
  );
}
