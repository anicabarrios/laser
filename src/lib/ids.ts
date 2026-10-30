// Shared id lists. Used by the UI, the cart and the server-side validation (zod).

export const MATERIAL_IDS = ["wood", "metal", "glass"] as const;
export type MaterialId = (typeof MATERIAL_IDS)[number];

export const PRODUCT_IDS = [
  "board",
  "coaster",
  "box",
  "keychain",
  "tag",
  "flask",
  "tumbler",
  "pint",
  "ornament",
] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export const FONT_IDS = ["clean", "modern", "classic"] as const;
export type FontId = (typeof FONT_IDS)[number];

export const ALIGN_IDS = ["left", "center", "right"] as const;
export type AlignId = (typeof ALIGN_IDS)[number];

export const MOTIF_IDS = ["ring", "star", "diamond", "waves", "peak", "grid"] as const;
export type MotifId = (typeof MOTIF_IDS)[number];
