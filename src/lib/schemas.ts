import { z } from "zod";
import { ALIGN_IDS, FONT_IDS, MATERIAL_IDS, MOTIF_IDS, PRODUCT_IDS } from "./ids";
import { STORAGE_PATH_RE, UPLOAD_MIMES } from "./uploads";

export const placementSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  scale: z.number().min(0.05).max(1),
  rotation: z.number().min(-180).max(180),
});

export const designSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("upload"),
    fileName: z.string().min(1).max(120),
    mime: z.enum(UPLOAD_MIMES),
    storagePath: z.string().regex(STORAGE_PATH_RE).optional(),
  }),
  z.object({
    kind: z.literal("text"),
    text: z.string().trim().min(1).max(60),
    font: z.enum(FONT_IDS),
    align: z.enum(ALIGN_IDS),
  }),
  z.object({
    kind: z.literal("gallery"),
    motif: z.enum(MOTIF_IDS),
  }),
]);

export const checkoutItemSchema = z.object({
  material: z.enum(MATERIAL_IDS),
  product: z.enum(PRODUCT_IDS),
  size: z.string().min(1).max(20),
  quantity: z.number().int().min(1).max(99),
  design: designSchema,
  placement: placementSchema,
  note: z.string().max(500),
  proof: z.boolean(),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(20),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
