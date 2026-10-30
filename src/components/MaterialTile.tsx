"use client";

import { useRouter } from "next/navigation";
import type { Material } from "@/lib/catalog";
import { useDraft } from "@/lib/store";
import { Swatch } from "./ui";

/** Home page shortcut: pick a material and jump straight to the product step. */
export function MaterialTile({ material }: { material: Material }) {
  const router = useRouter();
  const setMaterial = useDraft((s) => s.setMaterial);

  return (
    <button
      type="button"
      onClick={() => {
        setMaterial(material.id);
        router.push("/order/product");
      }}
      className="flex cursor-pointer flex-col gap-2 md:gap-3 md:rounded-2xl md:border md:border-line md:bg-surface md:p-3 md:text-left md:transition md:hover:border-copper"
    >
      <Swatch material={material.id} className="h-20 rounded-xl border border-black/10 md:h-36" />
      <span className="text-center text-[15px] leading-5 font-semibold md:px-1 md:text-left md:font-display md:text-xl md:font-bold">
        {material.name}
      </span>
      <span className="hidden px-1 pb-1 text-sm leading-snug text-muted md:block">{material.blurb}</span>
    </button>
  );
}
