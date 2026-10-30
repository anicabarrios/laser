import { FONTS, MOTIFS, formatDims, getMaterial, getProduct, getSize, unitPriceCents } from "@/lib/catalog";
import type { CheckoutItem } from "@/lib/schemas";
import { checkoutSchema } from "@/lib/schemas";
import { getStripe } from "@/lib/server/stripe";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import { site } from "@/lib/site";

const fail = (status: number, message: string, code?: string) => Response.json({ message, code }, { status });

function designSummary(item: CheckoutItem): string {
  const d = item.design;
  if (d.kind === "upload") return `Design file: ${d.fileName}`;
  if (d.kind === "text") {
    const font = FONTS.find((f) => f.id === d.font)?.name ?? d.font;
    return `Text: "${d.text}" · ${font} font`;
  }
  return `Gallery motif: ${MOTIFS.find((m) => m.id === d.motif)?.name ?? d.motif}`;
}

/**
 * Turns the cart into a pending order in the database and a Stripe Checkout
 * session. Every price is recomputed here from the catalog; the browser's
 * numbers are never trusted.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  if (!stripe || !supabase) {
    return fail(503, "Online payment isn't set up yet. Please contact us to place your order.", "not_configured");
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(400, "Your cart looks invalid. Please review it and try again.", "invalid_cart");

  const priced: { item: CheckoutItem; unit: number }[] = [];
  for (const item of parsed.data.items) {
    const unit = unitPriceCents(item.material, item.product, item.size);
    if (unit === null) return fail(400, "One of the items in your cart isn't available.", "unavailable");
    if (item.design.kind === "upload" && !item.design.storagePath) {
      return fail(400, "A design file in your cart wasn't uploaded. Please remove that item and add it again.", "missing_upload");
    }
    priced.push({ item, unit });
  }
  const totalCents = priced.reduce((sum, { item, unit }) => sum + unit * item.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ total_cents: totalCents, currency: "usd" })
    .select("id")
    .single();
  if (orderError || !order) return fail(500, "We couldn't create your order. Please try again.", "order_failed");

  const { error: itemsError } = await supabase.from("order_items").insert(
    priced.map(({ item, unit }) => ({
      order_id: order.id,
      material: item.material,
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      unit_cents: unit,
      design: item.design,
      placement: item.placement,
      note: item.note.trim() || null,
      proof_requested: item.proof,
    })),
  );
  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return fail(500, "We couldn't save your order. Please try again.", "items_failed");
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: order.id,
      metadata: { order_id: order.id },
      line_items: priced.map(({ item, unit }) => {
        const product = getProduct(item.product);
        const size = getSize(product, item.size);
        return {
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: unit,
            product_data: {
              name: `${product.name} · ${getMaterial(item.material).name}${size ? ` · ${size.label}` : ""}`,
              description: `${size ? `${formatDims(size.dimsMm)} · ` : ""}${designSummary(item)}`,
            },
          },
        };
      }),
      shipping_address_collection: { allowed_countries: [...site.shippingCountries] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: site.shippingCents, currency: "usd" },
            display_name: "Standard shipping",
          },
        },
      ],
      success_url: `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
    return Response.json({ url: session.url });
  } catch {
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return fail(502, "We couldn't open the payment page. Please try again.", "stripe_failed");
  }
}
