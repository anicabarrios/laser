/* eslint-disable @next/next/no-img-element -- uploads are local blob: URLs, next/image can't optimise those */
import { FONTS } from "@/lib/catalog";
import type { DesignView } from "@/lib/types";
import { MotifIcon } from "./icons";

/**
 * Draws the customer's design to fill its box. The box sets `color` to the
 * engraving colour of the material, so text and motifs follow it.
 * Uploaded files are shown through <img> only (never inlined), which keeps
 * SVG uploads from running scripts.
 */
export function DesignGraphic({ design }: { design: DesignView }) {
  if (design.kind === "upload") {
    if (design.mime === "application/pdf") {
      return (
        <div className="flex size-full items-center justify-center rounded border border-current text-center text-[8cqw] font-semibold">
          PDF
        </div>
      );
    }
    return (
      <img
        src={design.previewUrl}
        alt=""
        draggable={false}
        className="size-full object-contain select-none"
        style={{ mixBlendMode: "multiply", filter: "grayscale(1) contrast(1.15)" }}
      />
    );
  }

  if (design.kind === "text") {
    const font = FONTS.find((f) => f.id === design.font) ?? FONTS[0];
    return (
      <div className="flex size-full items-center">
        <span
          className="block w-full break-words whitespace-pre-wrap select-none"
          style={{
            fontFamily: font.css,
            fontWeight: font.weight,
            fontSize: "16cqw",
            lineHeight: 1.1,
            textAlign: design.align,
          }}
        >
          {design.text}
        </span>
      </div>
    );
  }

  return <MotifIcon id={design.motif} className="size-full" />;
}
