"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct } from "./catalog";
import type { AlignId, FontId, MaterialId, MotifId, ProductId } from "./ids";
import type { CartItem, DesignView, Placement } from "./types";
import type { UploadMime } from "./uploads";

export const DEFAULT_PLACEMENT: Placement = { x: 0.5, y: 0.5, scale: 0.7, rotation: 0 };

export type DesignSource = "upload" | "text" | "gallery";

export interface UploadedFile {
  file: File;
  previewUrl: string;
  name: string;
  mime: UploadMime;
}

/* ------------------------------------------------------------------ */
/* Draft: the product the customer is configuring right now.          */
/* Kept in sessionStorage (minus the file itself) so a refresh in the  */
/* middle of the wizard doesn't lose the first steps.                  */
/* ------------------------------------------------------------------ */

interface DraftData {
  material: MaterialId | null;
  product: ProductId | null;
  size: string | null;
  source: DesignSource;
  upload: UploadedFile | null;
  text: string;
  font: FontId;
  align: AlignId;
  motif: MotifId | null;
  placement: Placement;
  quantity: number;
  note: string;
  proof: boolean;
  rights: boolean;
}

interface DraftActions {
  setMaterial: (id: MaterialId) => void;
  setProduct: (id: ProductId) => void;
  setSize: (id: string) => void;
  setSource: (source: DesignSource) => void;
  setUpload: (upload: UploadedFile | null) => void;
  setText: (text: string) => void;
  setFont: (font: FontId) => void;
  setAlign: (align: AlignId) => void;
  setMotif: (motif: MotifId) => void;
  setPlacement: (patch: Partial<Placement>) => void;
  setQuantity: (quantity: number) => void;
  setNote: (note: string) => void;
  setProof: (proof: boolean) => void;
  setRights: (rights: boolean) => void;
  reset: () => void;
}

const initialDraft = (): DraftData => ({
  material: null,
  product: null,
  size: null,
  source: "upload",
  upload: null,
  text: "",
  font: "clean",
  align: "center",
  motif: null,
  placement: { ...DEFAULT_PLACEMENT },
  quantity: 1,
  note: "",
  proof: false,
  rights: false,
});

export const useDraft = create<DraftData & DraftActions>()(
  persist(
    (set, get) => {
      const dropUpload = () => {
        const prev = get().upload;
        if (prev) URL.revokeObjectURL(prev.previewUrl);
      };
      return {
        ...initialDraft(),
        setMaterial: (id) =>
          set((s) => {
            const keep = s.product !== null && getProduct(s.product).materials.includes(id);
            return { material: id, product: keep ? s.product : null, size: keep ? s.size : null };
          }),
        setProduct: (id) => set({ product: id, size: getProduct(id).defaultSize }),
        setSize: (size) => set({ size }),
        setSource: (source) => set({ source }),
        setUpload: (upload) => {
          dropUpload();
          set(upload ? { upload, placement: { ...DEFAULT_PLACEMENT } } : { upload: null });
        },
        setText: (text) => set({ text }),
        setFont: (font) => set({ font }),
        setAlign: (align) => set({ align }),
        setMotif: (motif) => set({ motif, placement: { ...DEFAULT_PLACEMENT } }),
        setPlacement: (patch) => set((s) => ({ placement: { ...s.placement, ...patch } })),
        setQuantity: (quantity) => set({ quantity: Math.min(99, Math.max(1, quantity)) }),
        setNote: (note) => set({ note }),
        setProof: (proof) => set({ proof }),
        setRights: (rights) => set({ rights }),
        reset: () => {
          dropUpload();
          set(initialDraft());
        },
      };
    },
    {
      name: "engrave-draft",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        material: s.material,
        product: s.product,
        size: s.size,
        source: s.source,
        text: s.text,
        font: s.font,
        align: s.align,
        motif: s.motif,
        placement: s.placement,
        quantity: s.quantity,
        note: s.note,
        proof: s.proof,
      }),
    },
  ),
);

/** The design the customer has chosen so far, or null if there isn't a usable one yet. */
export function useDesignView(): DesignView | null {
  const source = useDraft((s) => s.source);
  const upload = useDraft((s) => s.upload);
  const text = useDraft((s) => s.text);
  const font = useDraft((s) => s.font);
  const align = useDraft((s) => s.align);
  const motif = useDraft((s) => s.motif);

  return useMemo<DesignView | null>(() => {
    if (source === "upload") {
      return upload ? { kind: "upload", previewUrl: upload.previewUrl, name: upload.name, mime: upload.mime } : null;
    }
    if (source === "text") {
      const value = text.trim();
      return value ? { kind: "text", text: value, font, align } : null;
    }
    return motif ? { kind: "gallery", motif } : null;
  }, [source, upload, text, font, align, motif]);
}

/* ------------------------------------------------------------------ */
/* Cart: persisted in localStorage.                                   */
/* ------------------------------------------------------------------ */

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) => set((s) => ({ items: [...s.items, { ...item, id: crypto.randomUUID() }] })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: Math.min(99, Math.max(1, quantity)) } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "engrave-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
