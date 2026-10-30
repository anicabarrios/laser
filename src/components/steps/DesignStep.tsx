"use client";

import { useRef, useState, type DragEvent } from "react";
import { FONTS, MOTIFS, formatUSD, unitPriceCents } from "@/lib/catalog";
import { ALIGN_IDS } from "@/lib/ids";
import { useDesignView, useDraft, type DesignSource } from "@/lib/store";
import { useGuard } from "@/lib/use-guard";
import { ACCEPT_ATTR, MAX_UPLOAD_BYTES, mimeFromFileName } from "@/lib/uploads";
import { CheckIcon, CloseIcon, MotifIcon, UploadIcon } from "../icons";
import { PrimaryLink } from "../ui";
import { BottomBar, WizardShell } from "../Wizard";

const TABS: { id: DesignSource; label: string }[] = [
  { id: "upload", label: "Upload file" },
  { id: "text", label: "Enter text" },
  { id: "gallery", label: "Gallery" },
];

const chip = (selected: boolean) =>
  `cursor-pointer rounded-xl ${selected ? "border-2 border-copper bg-tint" : "border-[1.5px] border-line bg-surface"}`;

export function DesignStep() {
  const material = useDraft((s) => s.material);
  const productId = useDraft((s) => s.product);
  const sizeId = useDraft((s) => s.size);
  const source = useDraft((s) => s.source);
  const upload = useDraft((s) => s.upload);
  const text = useDraft((s) => s.text);
  const font = useDraft((s) => s.font);
  const align = useDraft((s) => s.align);
  const motif = useDraft((s) => s.motif);
  const { setSource, setUpload, setText, setFont, setAlign, setMotif } = useDraft.getState();
  const design = useDesignView();

  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const ready = Boolean(material && productId && sizeId);
  useGuard(ready, material ? "/order/product" : "/order/material");

  const price = material && productId && sizeId ? unitPriceCents(material, productId, sizeId) : null;

  function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    const mime = mimeFromFileName(file.name);
    if (!mime) {
      setError("Please use an SVG, PNG, JPG or PDF file.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("That file is larger than 10 MB.");
      return;
    }
    setUpload({ file, previewUrl: URL.createObjectURL(file), name: file.name, mime });
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  const isVector = upload?.mime === "image/svg+xml" || upload?.mime === "application/pdf";

  return (
    <WizardShell
      step={3}
      label="Design"
      backHref="/order/product"
      bottom={
        <BottomBar
          amount={price !== null ? formatUSD(price) : "–"}
          action={
            <PrimaryLink href="/order/placement" disabled={design === null}>
              Next
            </PrimaryLink>
          }
        />
      }
    >
      <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-tight">What should we engrave?</h1>

      <div role="tablist" aria-label="Design source" className="flex gap-1 rounded-xl bg-soft p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={source === t.id}
            onClick={() => setSource(t.id)}
            className={`h-11 flex-1 cursor-pointer rounded-[9px] text-sm ${
              source === t.id ? "bg-[#3a3f44] font-semibold text-ink shadow-sm" : "font-medium text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {source === "upload" && (
        <div role="tabpanel" className="flex flex-col gap-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center gap-2.5 rounded-2xl border-2 border-dashed bg-surface p-5 text-center ${
              dragging ? "border-copper" : "border-edge"
            }`}
          >
            <UploadIcon size={32} className="text-copper" />
            <span className="text-[17px] font-semibold">Upload your design</span>
            <span className="text-[13px] text-muted">SVG, PNG, JPG or PDF · up to 10 MB</span>
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPT_ATTR}
              className="sr-only"
              aria-label="Choose a design file"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="h-12 cursor-pointer rounded-xl bg-copper px-6 text-[15px] font-semibold text-ground"
            >
              {upload ? "Choose another file" : "Choose file"}
            </button>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-tint px-3.5 py-3 text-sm text-ink">
              {error}
            </p>
          )}

          {upload && (
            <div className="flex items-center gap-3 rounded-[14px] border border-line bg-surface p-3">
              <div className="flex size-12 flex-none items-center justify-center rounded-[10px] bg-soft text-xs font-semibold text-muted uppercase">
                {upload.name.split(".").pop()}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[15px] font-semibold">{upload.name}</span>
                <span className="flex items-center gap-1 text-[13px] text-copper">
                  <CheckIcon size={14} />
                  {isVector ? "Vector · great for engraving" : "Image · works best at 1000 px or larger"}
                </span>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => setUpload(null)}
                className="flex size-11 flex-none cursor-pointer items-center justify-center text-muted"
              >
                <CloseIcon size={20} />
              </button>
            </div>
          )}

          <div className="rounded-xl bg-tint px-3.5 py-3 text-sm leading-snug">
            SVG gives the sharpest engraving. Images under 1000 px may look blurry.
          </div>
        </div>
      )}

      {source === "text" && (
        <div role="tabpanel" className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Your text
            <input
              type="text"
              value={text}
              maxLength={60}
              placeholder="Your text"
              onChange={(e) => setText(e.target.value)}
              className="h-[52px] rounded-xl border-[1.5px] border-edge bg-surface px-3.5 text-base font-normal text-ink placeholder:text-muted"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Font</span>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={font === f.id}
                  onClick={() => setFont(f.id)}
                  className={`flex min-h-[72px] flex-col items-center justify-center gap-0.5 ${chip(font === f.id)}`}
                >
                  <span className="text-[26px]" style={{ fontFamily: f.css, fontWeight: f.weight }}>
                    Aa
                  </span>
                  <span className="text-xs text-muted">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Alignment</span>
            <div className="flex gap-2">
              {ALIGN_IDS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={align === a}
                  onClick={() => setAlign(a)}
                  className={`h-11 flex-1 text-sm capitalize ${chip(align === a)} ${align === a ? "font-semibold" : "font-medium"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {source === "gallery" && (
        <div role="tabpanel" className="flex flex-col gap-2.5">
          <span className="text-sm text-muted">Ready-made motifs you can place on the product.</span>
          <div className="grid grid-cols-3 gap-2.5">
            {MOTIFS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={motif === m.id}
                onClick={() => setMotif(m.id)}
                className={`flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-[14px] text-xs ${
                  motif === m.id ? "border-2 border-copper bg-tint text-ink" : "border-[1.5px] border-line bg-surface text-muted"
                } cursor-pointer`}
              >
                <MotifIcon id={m.id} className="size-9" />
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </WizardShell>
  );
}
