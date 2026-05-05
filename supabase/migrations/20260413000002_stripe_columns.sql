-- ──────────────────────────────────────────────────────────────────
-- Migration: add Stripe payment columns to orders
-- ──────────────────────────────────────────────────────────────────

alter table public.orders
  add column if not exists stripe_session_id     text,
  add column if not exists stripe_payment_intent text,
  add column if not exists paid_at               timestamptz;

-- Widen status check to include payment_failed
alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending','paid','printing','shipped','delivered','cancelled','payment_failed'));

-- Index for fast webhook lookups by Stripe session ID
create index if not exists orders_stripe_session_id_idx
  on public.orders (stripe_session_id)
  where stripe_session_id is not null;
