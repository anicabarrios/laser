import { randomUUID } from "node:crypto";
import { DESIGNS_BUCKET, getSupabaseAdmin } from "@/lib/server/supabase";
import {
  EXT_TO_MIME,
  MAX_UPLOAD_BYTES,
  isUnsafeSvg,
  matchesSignature,
  mimeFromFileName,
  sanitizeFileName,
} from "@/lib/uploads";

const fail = (status: number, message: string, code: string) => Response.json({ message, code }, { status });

/**
 * Receives a customer's design file and stores it in the private "designs"
 * bucket. Returns the storage path, which goes into the cart and later the order.
 * Nothing here is public: files are only reachable with the service-role key.
 */
export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return fail(503, "File storage isn't set up yet.", "storage_not_configured");
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return fail(400, "No file was sent.", "no_file");

  if (file.size === 0) return fail(400, "That file is empty.", "empty");
  if (file.size > MAX_UPLOAD_BYTES) return fail(413, "That file is larger than 10 MB.", "too_large");

  const mime = mimeFromFileName(file.name);
  if (!mime || !Object.values(EXT_TO_MIME).includes(mime)) {
    return fail(415, "Please use an SVG, PNG, JPG or PDF file.", "bad_type");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesSignature(mime, bytes)) {
    return fail(415, "That file doesn't look like a real " + mime.split("/")[1].toUpperCase() + ".", "bad_content");
  }
  if (mime === "image/svg+xml" && isUnsafeSvg(bytes)) {
    return fail(415, "That SVG contains scripts or external content. Please export a plain SVG.", "unsafe_svg");
  }

  const path = `${randomUUID()}/${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from(DESIGNS_BUCKET).upload(path, bytes, {
    contentType: mime,
    upsert: false,
  });
  if (error) return fail(502, "We couldn't save your file. Please try again.", "storage_error");

  return Response.json({ path });
}
