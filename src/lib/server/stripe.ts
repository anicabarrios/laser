import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns null when STRIPE_SECRET_KEY isn't set, so routes can answer with a clear message. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}
