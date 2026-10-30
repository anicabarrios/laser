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
      <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-tight">What should we engrave on?</h1>
      <p className="mb-1 text-[15px] leading-snug text-muted">Each material gives the engraving a different look.</p>

      {MATERIALS.map((m) => {
        const selected = m.id === material;
        return (
          <button
            key={m.id}
            type="button"
            aria-pressed={selected}
            onClick={() => setMaterial(m.id)}
            className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-3 text-left ${
              selected ? "border-copper bg-tint" : "border-line bg-surface"
            }`}
          >
            <Swatch material={m.id} className="size-24 flex-none rounded-xl border border-black/10" />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="font-display text-xl font-bold">{m.name}</span>
              <span className="text-sm leading-snug text-muted">{m.blurb}</span>
            </span>
            <span
              className={`flex size-6 flex-none items-center justify-center rounded-full ${
                selected ? "bg-copper text-ground" : "border-2 border-edge"
              }`}
            >
              {selected && <CheckIcon size={16} />}
            </span>
          </button>
        );
      })}

      <div className="mt-2 flex items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-dashed border-edge px-4 py-3.5">
        <span className="text-sm leading-snug text-muted">Not sure what to pick?</span>
        <a href={`mailto:${site.contactEmail}`} className="flex min-h-11 flex-none items-center text-sm font-semibold text-copper">
          Message us
        </a>
      </div>
    </WizardShell>
  );
}
