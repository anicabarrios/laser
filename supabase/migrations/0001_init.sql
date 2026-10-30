-- Orders for the engraving shop.
-- Run this once in the Supabase dashboard (SQL Editor), or with the Supabase CLI.
--
-- Security model: row level security is ON and there are NO policies, so the
-- public (anon) key can read or write nothing. Only the server, using the
-- service-role key inside the Next.js route handlers, touches these tables.

create extension if not exists pgcrypto;

create type public.order_status as enum (
  'pending',        -- created at checkout, not paid yet
  'paid',           -- Stripe confirmed the payment (set by the webhook only)
  'in_production',
  'shipped',
  'cancelled',
  'refunded'
);

create table public.orders (
  id                        uuid primary key default gen_random_uuid(),
  order_number              bigint generated always as identity (start with 1001) unique,
  status                    public.order_status not null default 'pending',
  total_cents               integer not null check (total_cents >= 0),
  currency                  text not null default 'usd',
  stripe_session_id         text unique,
  stripe_payment_intent_id  text,
  customer_email            text,
  customer_name             text,
  shipping                  jsonb,
  created_at                timestamptz not null default now(),
  paid_at                   timestamptz
);

create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders (id) on delete cascade,
  material         text not null,
  product          text not null,
  size             text not null,
  quantity         integer not null check (quantity between 1 and 99),
  unit_cents       integer not null check (unit_cents >= 0),
  -- {"kind":"upload","fileName":"logo.svg","mime":"image/svg+xml","storagePath":"<uuid>/logo.svg"}
  -- {"kind":"text","text":"Hello","font":"clean","align":"center"}
  -- {"kind":"gallery","motif":"star"}
  design           jsonb not null,
  -- {"x":0.5,"y":0.5,"scale":0.7,"rotation":0}  (x/y inside the engraving zone)
  placement        jsonb not null,
  note             text,
  proof_requested  boolean not null default false,
  created_at       timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items (order_id);
create index orders_status_created_idx on public.orders (status, created_at desc);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Private bucket for customers' design files (no public access).
insert into storage.buckets (id, name, public, file_size_limit)
values ('designs', 'designs', false, 10485760)
on conflict (id) do nothing;

-- Housekeeping idea (add later): delete 'designs' files that belong to orders
-- still 'pending' after 7 days, so abandoned uploads don't pile up.
