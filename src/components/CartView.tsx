"use client";

import Link from "next/link";
import { useState } from "react";
import { FONTS, MOTIFS, formatUSD, getMaterial, getProduct, getSize, unitPriceCents } from "@/lib/catalog";
import { useCart } from "@/lib/store";
import type { CartItem } from "@/lib/types";
import { useHydrated } from "@/lib/use-hydrated";
import { WizardHeader } from "./Header";
import { LockIcon } from "./icons";
import { QuantityStepper } from "./QuantityStepper";
import { PrimaryButton, PrimaryLink, Swatch } from "./ui";
import { BottomBar } from "./Wizard";

function describe(item: CartItem): string[] {
  const d = item.design;
  if (d.kind === "upload") return [`Design: ${d.fileName}`];
  if (d.kind === "text") {
    const font = FONTS.find((f) => f.id === d.font)?.name ?? d.font;
    return [`Text: “${d.text}”`, `Font: ${font}`];
  }
  return [`Motif: ${MOTIFS.find((m) => m.id === d.motif)?.name ?? d.motif}`];
}

export function CartView() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = items.map((item) => {
    const unit = unitPriceCents(item.material, item.product, item.size) ?? 0;
    return { item, unit, total: unit * item.quantity };
  });
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            material: i.material,
            product: i.product,
            size: i.size,
            quantity: i.quantity,
            design: i.design,
            placement: i.placement,
            note: i.note,
            proof: i.proof,
          })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !data.url) throw new Error(data.message ?? "We couldn't start the payment. Please try again.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <WizardHeader backHref="/" title={hydrated && count > 0 ? `Cart (${count})` : "Cart"} showCart={false} />

      <main className="flex flex-1 flex-col gap-3 px-5 py-4">
        {hydrated && items.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <h1 className="font-display text-[22px] font-bold">Your cart is empty</h1>
            <p className="text-[15px] text-muted">Pick a material and add your design to get started.</p>
            <PrimaryLink href="/order/material" className="w-full flex-none">
              Start your order
            </PrimaryLink>
          </div>
        )}

        {hydrated &&
          lines.map(({ item, total }) => {
            const product = getProduct(item.product);
            const size = getSize(product, item.size);
            return (
              <div key={item.id} className="flex flex-col gap-2 rounded-[14px] border border-line bg-surface p-3">
                <div className="flex gap-3">
                  <Swatch material={item.material} className="flex size-[72px] flex-none items-center justify-center rounded-[10px]" />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] leading-5 font-semibold">
                      {product.name} · {getMaterial(item.material).name}
                    </span>
                    {size && <span className="text-[13px] text-muted">{size.label}</span>}
                    {describe(item).map((line) => (
                      <span key={line} className="truncate text-[13px] text-muted">
                        {line}
                      </span>
                    ))}
                    {item.design.kind === "upload" && !item.design.storagePath && (
                      <span className="text-[13px] text-copper">File not uploaded yet</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper value={item.quantity} onChange={(q) => setQuantity(item.id, q)} />
                  <span className="font-display text-lg font-bold">{formatUSD(total)}</span>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="flex min-h-11 cursor-pointer items-center px-1 text-sm font-semibold text-muted"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

        {hydrated && items.length > 0 && (
          <>
            <div className="rounded-[14px] border border-line bg-surface px-4 py-1">
              <div className="flex min-h-11 items-center justify-between border-b border-soft text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatUSD(subtotal)}</span>
              </div>
              <div className="flex min-h-11 items-center justify-between border-b border-soft text-sm">
                <span className="text-muted">Shipping</span>
                <span className="text-muted">Calculated at checkout</span>
              </div>
              <div className="flex min-h-12 items-center justify-between text-base font-bold">
                <span>Total</span>
                <span className="font-display text-xl">{formatUSD(subtotal)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1 text-[13px] leading-snug text-muted">
              <LockIcon size={18} className="flex-none" />
              Secure payment through Stripe. Cards, Apple Pay and Google Pay.
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-tint px-3.5 py-3 text-sm">
                {error}
              </p>
            )}

            <Link href="/order/material" className="flex min-h-11 items-center justify-center text-[15px] font-semibold text-copper">
              Add another product
            </Link>
          </>
        )}
      </main>

      {hydrated && items.length > 0 && (
        <BottomBar
          amount={formatUSD(subtotal)}
          action={
            <PrimaryButton disabled={busy} onClick={pay}>
              {busy ? "Opening checkout…" : "Pay"}
            </PrimaryButton>
          }
        />
      )}
    </>
  );
}
