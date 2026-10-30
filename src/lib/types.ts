import type { AlignId, FontId, MaterialId, MotifId, ProductId } from "./ids";
import type { UploadMime } from "./uploads";

/** Where the design sits on the product. x/y are 0..1 inside the engraving zone. */
export interface Placement {
  x: number;
  y: number;
  /** Fraction (0.1..1) of the zone's shorter side. */
  scale: number;
  /** Degrees, -180..180. */
  rotation: number;
}

/** What gets stored in the cart and sent to checkout (no File objects). */
export type DesignRef =
  | { kind: "upload"; fileName: string; mime: UploadMime; storagePath?: string }
  | { kind: "text"; text: string; font: FontId; align: AlignId }
  | { kind: "gallery"; motif: MotifId };

/** What the preview draws (an upload carries a local blob URL). */
export type DesignView =
  | { kind: "upload"; previewUrl: string; name: string; mime: UploadMime }
  | { kind: "text"; text: string; font: FontId; align: AlignId }
  | { kind: "gallery"; motif: MotifId };

export interface CartItem {
  id: string;
  material: MaterialId;
  product: ProductId;
  size: string;
  quantity: number;
  design: DesignRef;
  placement: Placement;
  note: string;
  proof: boolean;
}
