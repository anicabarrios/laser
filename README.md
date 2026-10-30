# Laser engraving shop

A mobile-first, fully responsive (phone, tablet and desktop) web shop for laser-engraved products (wood, metal, glass). Customers pick a material and a product, upload their own design (or type text, or choose a ready-made motif), place it on a live preview, add it to the cart and pay online. The home page opens with a swipeable showcase of previous work.

## The order flow

```
Home (work carousel) → 1 Material → 2 Product & size → 3 Design → 4 Placement → 5 Review → Cart → Stripe Checkout → Thank you
```

- **Design** can be an uploaded file (SVG, PNG, JPG, PDF up to 10 MB), typed text (3 fonts, alignment) or a gallery motif.
- **Placement** is a drag / pinch / arrow-key preview on the real product face, with size and rotation sliders.
- **Review** collects quantity, a note, the "I have the rights to this design" confirmation (required) and an optional proof request.

## Stack

| Part | Choice |
| --- | --- |
| App | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4, dark + copper theme, Space Grotesk + Inter (self-hosted via Fontsource) |
| State | Zustand (draft in sessionStorage, cart in localStorage) |
| Payments | Stripe Checkout (hosted page) + webhook |
| Database & files | Supabase (Postgres + private Storage bucket) |
| Validation | Zod |

> This Next.js version has breaking changes compared to older ones. See `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework-level code.

## Run it locally

```bash
npm install
cp .env.example .env.local   # optional at first, see below
npm run dev                  # http://localhost:3000
```

Without any keys the whole flow works up to the **Pay** button (the cart lives in the browser). Uploading a design file and paying need Supabase and Stripe, and until they are set up the site shows a friendly "not set up yet" message instead of failing.

## Set up Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor** and run `supabase/migrations/0001_init.sql`. It creates the `orders` and `order_items` tables and a private `designs` storage bucket. Row level security is on with no policies, so nothing is reachable from the browser; only the server (service-role key) reads and writes.
3. Put these in `.env.local`: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project settings → API). The service-role key is a secret: never prefix it with `NEXT_PUBLIC_`.

## Set up Stripe (start in test mode)

1. Put your **test** secret key in `STRIPE_SECRET_KEY`.
2. Locally, forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`. It prints a signing secret, which goes in `STRIPE_WEBHOOK_SECRET`.
3. Pay with the test card `4242 4242 4242 4242` (any future date, any CVC).
4. In production, add a webhook endpoint `https://YOUR-SITE/api/stripe/webhook` with the events `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `checkout.session.expired`.

## Make it yours (placeholders to replace)

Everything in `[brackets]` on the site is a placeholder.

| File | What to change |
| --- | --- |
| `src/lib/site.ts` | Brand name, shipping days, contact email, flat shipping price, shipping countries |
| `src/lib/catalog.ts` | Products, sizes (mm) and **prices**. Current numbers are examples. |
| `src/lib/work.ts` | The carousel. Put photos in `public/work/` and set `image: "/work/board.webp"` |
| `src/components/steps/MaterialStep.tsx`, `catalog.ts` | Material descriptions (for example which metals you work with) |
| `src/app/terms/page.tsx` | Terms and returns text |

## How it stays safe

- **Prices are never trusted from the browser.** `/api/checkout` recomputes every price from `catalog.ts` and rejects unknown material / product / size combinations.
- **Only the Stripe webhook marks an order as paid** (after verifying Stripe's signature). The thank-you page cannot.
- **Uploads** are checked on the server for size, extension, real file signature and (for SVG) scripts, then stored in a private bucket. SVGs are only ever shown through `<img>`.
- **Consent:** the rights checkbox is required before anything can be added to the cart.

## Project structure

```
src/
  app/                  routes: home, order/* (5 steps), cart, thanks, terms
    api/checkout        cart → pending order + Stripe Checkout session
    api/stripe/webhook  Stripe → order marked paid
    api/upload          design file → private storage
  components/           UI (steps/ holds the five wizard steps)
  lib/
    catalog.ts          products, sizes, prices (single source of truth)
    store.ts            draft + cart (Zustand)
    schemas.ts          Zod validation shared by the API routes
    server/             Stripe and Supabase clients (server only)
supabase/migrations/    database schema
```

## Next steps

- Admin page (`/admin`) to see orders, download design files and mark orders as in production / shipped.
- Confirmation emails after payment (for example Resend), sent from the webhook.
- Show the order number on the thank-you page.
- Scheduled cleanup of uploads that belong to orders still `pending` after 7 days.
- Rate limiting on `/api/upload` and `/api/checkout`.
- Generate and store a preview image of the placement with each order.
- Real photos for the carousel and material cards.
