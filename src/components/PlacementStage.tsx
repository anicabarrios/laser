"use client";

import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { engravingAreaMm, getMaterial, type Product, type Size } from "@/lib/catalog";
import type { MaterialId } from "@/lib/ids";
import type { DesignView, Placement } from "@/lib/types";
import { DesignGraphic } from "./DesignGraphic";

interface Props {
  material: MaterialId;
  product: Product;
  size: Size;
  /** null = nothing chosen yet (shows a hint instead of a design). */
  design: DesignView | null;
  placement: Placement;
  /** Present = the customer can drag and pinch. Absent = read-only preview. */
  onChange?: (patch: Partial<Placement>) => void;
  /** Tailwind classes that give the stage its height, e.g. "h-[300px] lg:h-[460px]". */
  className: string;
  topLabel?: ReactNode;
  bottomLabel?: ReactNode;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * The product face with the design on top. The engraving zone is a dashed
 * rectangle inset 7%; the design is positioned and sized relative to it.
 * Drag to move, pinch (two fingers) to resize, arrow keys to nudge.
 */
export function PlacementStage({
  material,
  product,
  size,
  design,
  placement,
  onChange,
  className,
  topLabel,
  bottomLabel,
}: Props) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dx: number; dy: number; dist: number; scale: number } | null>(null);
  const interactive = Boolean(onChange);
  const mat = getMaterial(material);
  const round = product.id === "coaster" || product.id === "ornament";

  function beginSingle(clientX: number, clientY: number) {
    const rect = zoneRef.current?.getBoundingClientRect();
    if (!rect) return;
    gesture.current = {
      dx: (clientX - rect.left) / rect.width - placement.x,
      dy: (clientY - rect.top) / rect.height - placement.y,
      dist: 0,
      scale: placement.scale,
    };
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!interactive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      beginSingle(e.clientX, e.clientY);
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { dx: 0, dy: 0, dist: distance(a, b), scale: placement.scale };
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!onChange || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;

    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      if (g.dist > 0) onChange({ scale: clamp((g.scale * distance(a, b)) / g.dist, 0.1, 1) });
      return;
    }
    const rect = zoneRef.current?.getBoundingClientRect();
    if (!rect) return;
    onChange({
      x: clamp((e.clientX - rect.left) / rect.width - g.dx, 0, 1),
      y: clamp((e.clientY - rect.top) / rect.height - g.dy, 0, 1),
    });
  }

  function onPointerEnd(e: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    gesture.current = null;
    // Lifting one finger of a pinch: keep dragging with the one that is left.
    const [rest] = [...pointers.current.values()];
    if (rest) beginSingle(rest.x, rest.y);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!onChange) return;
    const step = 0.02;
    const moves: Record<string, Partial<Placement>> = {
      ArrowLeft: { x: clamp(placement.x - step, 0, 1) },
      ArrowRight: { x: clamp(placement.x + step, 0, 1) },
      ArrowUp: { y: clamp(placement.y - step, 0, 1) },
      ArrowDown: { y: clamp(placement.y + step, 0, 1) },
    };
    const patch = moves[e.key];
    if (patch) {
      e.preventDefault();
      onChange(patch);
    }
  }

  const [areaW, areaH] = engravingAreaMm(size.dimsMm);
  // The stage is a size container, so the face scales with whatever height the classes give it.
  const surfaceWidth = `min(calc(100cqw - 32px), calc(100cqh * 0.68 * ${product.aspect}))`;

  return (
    <div
      className={`relative flex flex-none items-center justify-center rounded-2xl bg-footer ${className}`}
      style={{ containerType: "size" }}
    >
      {topLabel === undefined ? (
        <span className="absolute top-3 left-3 text-xs font-medium text-[#e9e4dd]">
          Engraving area: {areaW} × {areaH} mm
        </span>
      ) : (
        topLabel
      )}

      <div
        className={`swatch-${material} relative ${round ? "rounded-full" : "rounded-[10px]"}`}
        style={{ width: surfaceWidth, aspectRatio: product.aspect, marginTop: topLabel === null ? 0 : 16 }}
      >
        <div
          ref={zoneRef}
          className={`absolute inset-[7%] border-[1.5px] border-dashed border-[rgba(16,32,42,0.75)] ${round ? "rounded-full" : "rounded-sm"}`}
          style={{ containerType: "size" }}
        >
          <div
            role={interactive ? "group" : undefined}
            aria-label={interactive ? "Design position. Drag it, or use the arrow keys." : undefined}
            tabIndex={interactive ? 0 : undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onKeyDown={onKeyDown}
            className={`absolute ${interactive ? "cursor-grab touch-none outline-2 outline-copper active:cursor-grabbing" : ""}`}
            style={{
              left: `${placement.x * 100}%`,
              top: `${placement.y * 100}%`,
              width: `calc(${placement.scale} * 100cqmin)`,
              aspectRatio: "1",
              transform: `translate(-50%, -50%) rotate(${placement.rotation}deg)`,
              containerType: "inline-size",
              color: mat.engraveColor,
            }}
          >
            {design ? <DesignGraphic design={design} /> : null}
          </div>
          {!design && (
            <span
              className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-medium opacity-70"
              style={{ color: mat.engraveColor }}
            >
              Your design will appear here
            </span>
          )}
        </div>
      </div>

      {bottomLabel === undefined ? (
        <span className="absolute bottom-3 left-3 text-xs font-medium text-[#e9e4dd]">
          {product.name} · {mat.name} · {size.label}
        </span>
      ) : (
        bottomLabel
      )}
    </div>
  );
}
