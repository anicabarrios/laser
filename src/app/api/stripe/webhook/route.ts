import type Stripe from "stripe";
import { getStripe } from "@/lib/server/stripe";
import { getSupabaseAdmin } from "@/lib/server/supabase";

/**
 * Stripe calls this after a payment. It is the ONLY place an order becomes "paid",
 * so the thank-you page alone can never mark an order as paid.
 * Register it in the Stripe dashboard: https://YOUR-SITE/api/stripe/webhook
 * with the events checkout.session.completed, checkout.session.async_payment_succeeded
 * and checkout.session.expired.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = getSupabaseAdmin();
  if (!stripe || !secret || !supabase) return new Response("Not configured", { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  // The signature is computed over the exact raw body, so read it as text.
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (orderId && session.payment_status === "paid") {
        const { error } = await supabase
          .from("orders")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
            customer_email: session.customer_details?.email ?? null,
            customer_name: session.customer_details?.name ?? null,
            shipping: session.collected_information?.shipping_details ?? null,
          })
          .eq("id", orderId)
          .eq("status", "pending"); // makes repeated deliveries harmless
        // A failed update must return an error so Stripe retries the delivery.
        if (error) return new Response("Database error", { status: 500 });
        // TODO: send the confirmation email here (for example with Resend).
      }
      break;
    }
    case "checkout.session.expired": {
      const orderId = event.data.object.metadata?.order_id;
      if (orderId) {
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId).eq("status", "pending");
      }
      break;
    }
  }

  return Response.json({ received: true });
}
