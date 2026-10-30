// Business details shown around the site.
// Anything in [brackets] is a placeholder: replace it with your real info.

export const site = {
  name: "[Brand name]",
  shipDays: "[X]",
  contactEmail: "hello@example.com",
  year: 2026,
  // Flat shipping charged in Stripe Checkout (US only for now). Placeholder amount.
  shippingCents: 599,
  shippingCountries: ["US"] as const,
} as const;
