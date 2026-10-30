"use client";

import Link from "next/link";
import { formatUSD, getProduct, getSize, unitPriceCents } from "@/lib/catalog";
import { useDesignView, useDraft } from "@/lib/store";
import { useGuard } from "@/lib/use-guard";
import { MoveIcon } from "../icons";
import { PlacementStage } from "../PlacementStage";
import { PrimaryLink } from "../ui";
import { BottomBar, WizardShell } from "../Wizard";

const secondary =
  "flex h-12 flex-1 cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-ink bg-transparent text-[15px] font-semibold";

export function PlacementStep() {
  const material = useDraft((s) => s.material);
  const productId = useDraft((s) => s.product);
  const sizeId = useDraft((s) => s.size);
  const placement = useDraft((s) => s.placement);
  const setPlacement = useDraft((s) => s.setPlacement);
  const design = useDesignView();

  const product = productId ? getProduct(productId) : null;
  const size = product && sizeId ? getSize(product, sizeId) : undefined;
  const ready = Boolean(material && product && size && design);
  useGuard(ready, material && product && size ? "/order/design" : "/order/material");

  const price = material && productId && sizeId ? unitPriceCents(material, productId, sizeId) : null;

  return (
    <WizardShell
      step={4}
      label="Placement"
      backHref="/order/design"
      bottom={
        <BottomBar
          amount={price !== null ? formatUSD(price) : "–"}
          action={<PrimaryLink href="/order/review">Next</PrimaryLink>}
        />
      }
    >
      {material && product && size && design && (
        <>
          <PlacementStage
            material={material}
            product={product}
            size={size}
            design={design}
            placement={placement}
            onChange={setPlacement}
            height={300}
          />

          <div className="flex items-center gap-2 text-[13px] text-muted">
            <MoveIcon size={18} />
            Drag to move, pinch to resize.
          </div>

          <div className="flex flex-col gap-1 rounded-[14px] border border-line bg-surface px-4 py-3">
            <label className="flex flex-col text-sm font-semibold">
              <span className="flex justify-between">
                <span>Size</span>
                <span className="font-medium text-muted">{Math.round(placement.scale * 100)}%</span>
              </span>
              <input
                type="range"
                min={10}
                max={100}
                value={Math.round(placement.scale * 100)}
                aria-label="Design size"
                onChange={(e) => setPlacement({ scale: Number(e.target.value) / 100 })}
                className="m-0 h-11 w-full accent-copper"
              />
            </label>
            <label className="flex flex-col text-sm font-semibold">
              <span className="flex justify-between">
                <span>Rotation</span>
                <span className="font-medium text-muted">{placement.rotation}°</span>
              </span>
              <input
                type="range"
                min={-180}
                max={180}
                value={placement.rotation}
                aria-label="Design rotation"
                onChange={(e) => setPlacement({ rotation: Number(e.target.value) })}
                className="m-0 h-11 w-full accent-copper"
              />
            </label>
          </div>

          <div className="flex gap-2.5">
            <button type="button" className={secondary} onClick={() => setPlacement({ x: 0.5, y: 0.5 })}>
              Center
            </button>
            <Link href="/order/design" className={secondary}>
              Change design
            </Link>
          </div>
        </>
      )}
    </WizardShell>
  );
}
