"use client";

import Link from "next/link";
import {
  formatDims,
  formatUSD,
  getMaterial,
  getProduct,
  productFromCents,
  productsFor,
  unitPriceCents,
} from "@/lib/catalog";
import { useDraft } from "@/lib/store";
import { useGuard } from "@/lib/use-guard";
import { PrimaryLink, Swatch } from "../ui";
import { BottomBar, WizardShell } from "../Wizard";

export function ProductStep() {
  const material = useDraft((s) => s.material);
  const productId = useDraft((s) => s.product);
  const sizeId = useDraft((s) => s.size);
  const setProduct = useDraft((s) => s.setProduct);
  const setSize = useDraft((s) => s.setSize);

  useGuard(material !== null, "/order/material");

  const products = material ? productsFor(material) : [];
  const product = productId ? getProduct(productId) : null;
  const price = material && product && sizeId ? unitPriceCents(material, product.id, sizeId) : null;

  return (
    <WizardShell
      step={2}
      label="Product and size"
      backHref="/order/material"
      bottom={
        <BottomBar
          amount={price !== null ? formatUSD(price) : "–"}
          action={
            <PrimaryLink href="/order/design" disabled={price === null}>
              Next
            </PrimaryLink>
          }
        />
      }
    >
      {material && (
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface py-1.5 pr-1 pl-3">
          <Swatch material={material} className="size-8 flex-none rounded-lg" />
          <span className="flex-1 text-[15px] font-semibold">{getMaterial(material).name}</span>
          <Link href="/order/material" className="flex min-h-11 items-center px-3 text-sm font-semibold text-copper">
            Change
          </Link>
        </div>
      )}

      <h1 className="mt-1 font-display text-[22px] font-bold tracking-tight">Product</h1>
      <div className="grid grid-cols-2 gap-3">
        {material &&
          products.map((p) => {
            const selected = p.id === productId;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setProduct(p.id)}
                className={`flex cursor-pointer flex-col gap-1.5 rounded-[14px] border-2 p-2 text-left ${
                  selected ? "border-copper bg-tint" : "border-line bg-surface"
                }`}
              >
                <Swatch material={material} className="h-[110px] rounded-lg" />
                <span className="text-[15px] leading-5 font-semibold">{p.name}</span>
                <span className="text-[13px] leading-4 text-muted">from {formatUSD(productFromCents(p, material))}</span>
              </button>
            );
          })}
      </div>

      {product && material && (
        <>
          <h2 className="mt-2 font-display text-[22px] font-bold tracking-tight">Size</h2>
          {product.sizes.length > 1 ? (
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((s) => {
                const selected = s.id === sizeId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSize(s.id)}
                    className={`flex min-h-[76px] cursor-pointer flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 ${
                      selected ? "border-2 border-copper bg-tint" : "border-[1.5px] border-line bg-surface"
                    }`}
                  >
                    <span className="text-[15px] font-semibold">{s.label}</span>
                    <span className="text-xs text-muted">{formatDims(s.dimsMm)}</span>
                    <span className="text-sm font-semibold">{formatUSD(s.priceCents + getMaterial(material).surchargeCents)}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted">One size · {formatDims(product.sizes[0].dimsMm)}</p>
          )}
        </>
      )}
    </WizardShell>
  );
}
