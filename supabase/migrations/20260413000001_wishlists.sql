-- ──────────────────────────────────────────────────────────────────
-- Migration: wishlists
-- ──────────────────────────────────────────────────────────────────

create table public.wishlists (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id uuid        not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint wishlists_user_product_unique unique (user_id, product_id)
);

alter table public.wishlists enable row level security;

create policy "wishlists_select_own"
  on public.wishlists for select
  using (auth.uid() = user_id);

create policy "wishlists_insert_own"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "wishlists_delete_own"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- Index for fast user lookups
create index wishlists_user_id_idx on public.wishlists (user_id);
