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
      className="flex cursor-pointer flex-col gap-2"
    >
      <Swatch material={material.id} className="h-20 rounded-xl border border-black/10" />
      <span className="text-center text-[15px] leading-5 font-semibold">{material.name}</span>
    </button>
  );
}
