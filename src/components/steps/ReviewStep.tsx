"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDims, formatUSD, getMaterial, getProduct, getSize, unitPriceCents } from "@/lib/catalog";
import { useCart, useDesignView, useDraft } from "@/lib/store";
import type { DesignRef } from "@/lib/types";
import { useGuard } from "@/lib/use-guard";
import { PlacementStage } from "../PlacementStage";
import { QuantityStepper } from "../QuantityStepper";
import { PrimaryButton } from "../ui";
import { BottomBar, WizardShell } from "../Wizard";

const card = "rounded-[14px] border border-line bg-surface";

export function ReviewStep() {
  const router = useRouter();
  const material = useDraft((s) => s.material);
  const productId = useDraft((s) => s.product);
  const sizeId = useDraft((s) => s.size);
  const placement = useDraft((s) => s.placement);
  const quantity = useDraft((s) => s.quantity);
  const note = useDraft((s) => s.note);
  const proof = useDraft((s) => s.proof);
  const rights = useDraft((s) => s.rights);
  const upload = useDraft((s) => s.upload);
  const { setQuantity, setNote, setProof, setRights, reset } = useDraft.getState();
  const design = useDesignView();
  const addToCart = useCart((s) => s.add);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = productId ? getProduct(productId) : null;
  const size = product && sizeId ? getSize(product, sizeId) : undefined;
  const ready = Boolean(material && product && size && design);
  const leave = useGuard(ready, material && product && size ? "/order/design" : "/order/material");

  const unit = material && productId && sizeId ? unitPriceCents(material, productId, sizeId) : null;
  const total = unit !== null ? unit * quantity : null;

  async function submit() {
    if (!material || !productId || !sizeId || !design) return;
    setBusy(true);
    setError(null);
    try {
      let ref: DesignRef;
      if (design.kind === "upload") {
        if (!upload) throw new Error("Please choose your file again.");
        let storagePath: string | undefined;
        const body = new FormData();
        body.append("file", upload.file);
        const res = await fetch("/api/upload", { method: "POST", body });
        if (res.ok) {
          storagePath = ((await res.json()) as { path: string }).path;
        } else if (res.status !== 503) {
          // 503 = file storage isn't set up yet (fine while developing); anything else is a real problem.
          const data = (await res.json().catch(() => null)) as { message?: string } | null;
          throw new Error(data?.message ?? "We couldn't upload your file. Please try again.");
        }
        ref = { kind: "upload", fileName: upload.name, mime: upload.mime, storagePath };
      } else if (design.kind === "text") {
        ref = { kind: "text", text: design.text, font: design.font, align: design.align };
      } else {
        ref = { kind: "gallery", motif: design.motif };
      }

      addToCart({
        material,
        product: productId,
        size: sizeId,
        quantity,
        design: ref,
        placement,
        note: note.trim(),
        proof,
      });
      leave();
      reset();
      router.push("/cart");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  const designLabel =
    design?.kind === "upload" ? design.name : design?.kind === "text" ? `“${design.text}”` : design ? "Gallery motif" : "";

  return (
    <WizardShell
      step={5}
      label="Review"
      backHref="/order/placement"
      bottom={
        <BottomBar
          amount={total !== null ? formatUSD(total) : "–"}
          action={
            <PrimaryButton disabled={!rights || busy || total === null} onClick={submit}>
              {busy ? "Adding…" : "Add to cart"}
            </PrimaryButton>
          }
        />
      }
    >
      {material && product && size && design && (
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-3">
            <PlacementStage
              material={material}
              product={product}
              size={size}
              design={design}
              placement={placement}
              className="h-[190px] md:h-[300px] lg:h-[360px]"
              topLabel={
                <span className="absolute top-2.5 left-2.5 rounded-full bg-ground px-2.5 py-1 text-xs font-medium">
                  Engraving preview
                </span>
              }
              bottomLabel={null}
            />

            <div className={`${card} px-4 py-1`}>
              <Row label="Material" value={getMaterial(material).name} divider />
              <Row label="Product" value={`${product.name} · ${size.label}`} divider />
              <Row label="Dimensions" value={formatDims(size.dimsMm)} divider />
              <Row label="Design" value={designLabel} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
          <div className={`${card} flex items-center justify-between py-1 pr-1 pl-4`}>
            <span className="text-[15px] font-semibold">Quantity</span>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Note (optional)
            <textarea
              value={note}
              maxLength={500}
              placeholder="E.g. engraving position, special requests"
              onChange={(e) => setNote(e.target.value)}
              className="h-[72px] resize-none rounded-xl border-[1.5px] border-edge bg-surface px-3.5 py-3 text-[15px] font-normal text-ink placeholder:text-muted"
            />
          </label>

          <label className="flex min-h-12 items-center gap-3 text-sm leading-snug">
            <input
              type="checkbox"
              checked={rights}
              onChange={(e) => setRights(e.target.checked)}
              className="m-0 size-6 flex-none accent-copper"
            />
            I have the rights to this design and am responsible for its content.
          </label>
          <label className="flex min-h-12 items-center gap-3 text-sm leading-snug">
            <input
              type="checkbox"
              checked={proof}
              onChange={(e) => setProof(e.target.checked)}
              className="m-0 size-6 flex-none accent-copper"
            />
            Send me a proof before engraving.
          </label>

          {error && (
            <p role="alert" className="rounded-xl bg-tint px-3.5 py-3 text-sm">
              {error}
            </p>
          )}
          </div>
        </div>
      )}
    </WizardShell>
  );
}

function Row({ label, value, divider = false }: { label: string; value: string; divider?: boolean }) {
  return (
    <div className={`flex min-h-11 items-center justify-between gap-4 text-sm ${divider ? "border-b border-soft" : ""}`}>
      <span className="text-muted">{label}</span>
      <span className="truncate font-semibold">{value}</span>
    </div>
  );
}
