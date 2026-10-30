// The product catalog is the single source of truth for what can be ordered AND
// what it costs. The server recomputes every price from this file at checkout,
// so a tampered cart can never change what the customer pays.
//
// PLACEHOLDER VALUES: prices (in cents) and dimensions (mm) are examples.
// Replace them with your real numbers.

import type { MaterialId, ProductId } from "./ids";

export interface Material {
  id: MaterialId;
  name: string;
  blurb: string;
  /** Added to the product's size price. */
  surchargeCents: number;
  /** Colour used for the engraving in previews. */
  engraveColor: string;
}

export interface Size {
  id: string;
  label: string;
  dimsMm: readonly [number, number];
  priceCents: number;
}

export interface Product {
  id: ProductId;
  name: string;
  materials: readonly MaterialId[];
  /** Width / height of the engravable face, used by the placement preview. */
  aspect: number;
  sizes: readonly Size[];
  defaultSize: string;
}

export const MATERIALS: readonly Material[] = [
  {
    id: "wood",
    name: "Wood",
    blurb: "Warm, dark engraving. The wood grain stays visible.",
    surchargeCents: 0,
    engraveColor: "#3b2412",
  },
  {
    id: "metal",
    name: "Metal",
    blurb: "Fine, precise engraving. [List the metals you work with]",
    surchargeCents: 400,
    engraveColor: "#3a4047",
  },
  {
    id: "glass",
    name: "Glass",
    blurb: "Frosted white engraving on glasses and glass surfaces.",
    surchargeCents: 300,
    engraveColor: "#3f5559",
  },
];

const single = (w: number, h: number, priceCents: number): Pick<Product, "sizes" | "defaultSize"> => ({
  sizes: [{ id: "standard", label: "Standard", dimsMm: [w, h], priceCents }],
  defaultSize: "standard",
});

export const PRODUCTS: readonly Product[] = [
  {
    id: "board",
    name: "Board",
    materials: ["wood"],
    aspect: 1.5,
    sizes: [
      { id: "small", label: "Small", dimsMm: [150, 100], priceCents: 2400 },
      { id: "medium", label: "Medium", dimsMm: [200, 150], priceCents: 3600 },
      { id: "large", label: "Large", dimsMm: [300, 200], priceCents: 5200 },
    ],
    defaultSize: "medium",
  },
  { id: "coaster", name: "Coaster", materials: ["wood"], aspect: 1, ...single(100, 100, 1500) },
  {
    id: "box",
    name: "Box",
    materials: ["wood"],
    aspect: 1.4,
    sizes: [
      { id: "small", label: "Small", dimsMm: [100, 70], priceCents: 4200 },
      { id: "medium", label: "Medium", dimsMm: [150, 100], priceCents: 5800 },
      { id: "large", label: "Large", dimsMm: [200, 140], priceCents: 7600 },
    ],
    defaultSize: "medium",
  },
  { id: "keychain", name: "Keychain", materials: ["wood", "metal"], aspect: 2, ...single(50, 25, 1200) },
  { id: "tag", name: "Tag", materials: ["metal"], aspect: 1.6, ...single(50, 30, 1400) },
  { id: "flask", name: "Flask", materials: ["metal"], aspect: 0.6, ...single(90, 150, 3800) },
  { id: "tumbler", name: "Tumbler", materials: ["glass"], aspect: 1.2, ...single(100, 85, 2800) },
  { id: "pint", name: "Pint glass", materials: ["glass"], aspect: 1.2, ...single(90, 75, 2200) },
  { id: "ornament", name: "Ornament", materials: ["glass"], aspect: 1, ...single(80, 80, 1800) },
];

export function getMaterial(id: MaterialId): Material {
  const m = MATERIALS.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown material: ${id}`);
  return m;
}

export function getProduct(id: ProductId): Product {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown product: ${id}`);
  return p;
}

export function getSize(product: Product, sizeId: string): Size | undefined {
  return product.sizes.find((s) => s.id === sizeId);
}

export function productsFor(material: MaterialId): Product[] {
  return PRODUCTS.filter((p) => p.materials.includes(material));
}

/** Price of one item in cents, or null when the combination is not sold. */
export function unitPriceCents(material: MaterialId, productId: ProductId, sizeId: string): number | null {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || !product.materials.includes(material)) return null;
  const size = getSize(product, sizeId);
  if (!size) return null;
  return size.priceCents + getMaterial(material).surchargeCents;
}

/** Lowest price for a product in a given material ("from $XX"). */
export function productFromCents(product: Product, material: MaterialId): number {
  return Math.min(...product.sizes.map((s) => s.priceCents)) + getMaterial(material).surchargeCents;
}

/** Lowest price in a whole material ("From $XX" on the material step). */
export function materialFromCents(material: MaterialId): number {
  return Math.min(...productsFor(material).map((p) => productFromCents(p, material)));
}

export function formatDims([w, h]: readonly [number, number]): string {
  return `${w} × ${h} mm`;
}

/** The engraving zone is the face minus a 7% margin on every side (matches the preview). */
export function engravingAreaMm([w, h]: readonly [number, number]): readonly [number, number] {
  return [Math.round(w * 0.86), Math.round(h * 0.86)];
}

export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export const FONTS = [
  { id: "clean", name: "Clean", css: "var(--font-sans)", weight: 600 },
  { id: "modern", name: "Modern", css: "var(--font-display)", weight: 700 },
  { id: "classic", name: "Classic", css: "Georgia, 'Times New Roman', serif", weight: 400 },
] as const;

export const MOTIFS = [
  { id: "ring", name: "Ring" },
  { id: "star", name: "Star" },
  { id: "diamond", name: "Diamond" },
  { id: "waves", name: "Waves" },
  { id: "peak", name: "Peak" },
  { id: "grid", name: "Grid" },
] as const;
