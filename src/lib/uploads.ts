// Rules for customer design uploads. Shared by the browser (early feedback)
// and by /api/upload (the real enforcement).

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const UPLOAD_MIMES = ["image/svg+xml", "image/png", "image/jpeg", "application/pdf"] as const;
export type UploadMime = (typeof UPLOAD_MIMES)[number];

export const EXT_TO_MIME: Record<string, UploadMime> = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  pdf: "application/pdf",
};

export const ACCEPT_ATTR = ".svg,.png,.jpg,.jpeg,.pdf";

/** Path returned by /api/upload: "<uuid>/<safe-file-name>". */
export const STORAGE_PATH_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[A-Za-z0-9._-]{1,100}$/;

export function mimeFromFileName(name: string): UploadMime | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? null;
}

export function sanitizeFileName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/^[._]+/, "")
    .slice(-100);
  return cleaned || "design";
}

/** Check the first bytes of the file so a renamed file can't slip through. */
export function matchesSignature(mime: UploadMime, bytes: Uint8Array): boolean {
  const startsWith = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  switch (mime) {
    case "image/png":
      return startsWith([0x89, 0x50, 0x4e, 0x47]);
    case "image/jpeg":
      return startsWith([0xff, 0xd8, 0xff]);
    case "application/pdf":
      return startsWith([0x25, 0x50, 0x44, 0x46]); // %PDF
    case "image/svg+xml": {
      const head = new TextDecoder().decode(bytes.slice(0, 2048)).toLowerCase();
      return head.includes("<svg");
    }
  }
}

/**
 * SVGs are only ever shown through <img> (which never runs scripts), but we
 * also refuse the obviously dangerous ones so they never sit in storage.
 */
export function isUnsafeSvg(bytes: Uint8Array): boolean {
  const text = new TextDecoder().decode(bytes).toLowerCase();
  return /<script|<foreignobject|javascript:|\son[a-z]+\s*=|<!entity/.test(text);
}
