-- ──────────────────────────────────────────────────────────────────
-- Migration: checkout system
-- Tables: shipping_addresses, orders, order_items
-- ──────────────────────────────────────────────────────────────────

-- Global sequence for human-readable order numbers (OL-YYYY-NNNN)
create sequence if not exists public.order_seq;

create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  year_str text := to_char(now(), 'YYYY');
  seq_num  int  := nextval('public.order_seq');
begin
  return 'OL-' || year_str || '-' || lpad(seq_num::text, 4, '0');
end;
$$;

-- ──────────────────────────────────────────────────────────────────
-- shipping_addresses
-- ──────────────────────────────────────────────────────────────────
create table public.shipping_addresses (
  id                    uuid        primary key default gen_random_uuid(),
  user_id               uuid        not null references auth.users(id) on delete cascade,
  recipient_name        text        not null,
  phone                 text        not null,
  street                text        not null,
  exterior_number       text        not null,
  interior_number       text,
  neighborhood          text        not null,
  postal_code           text        not null check (char_length(postal_code) = 5),
  city                  text        not null,
  state                 text        not null,
  "references"          text,
  delivery_instructions text,
  is_default            boolean     not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.shipping_addresses enable row level security;

create policy "addresses_select_own"
  on public.shipping_addresses for select
  using (auth.uid() = user_id);

create policy "addresses_insert_own"
  on public.shipping_addresses for insert
  with check (auth.uid() = user_id);

create policy "addresses_update_own"
  on public.shipping_addresses for update
  using (auth.uid() = user_id);

create policy "addresses_delete_own"
  on public.shipping_addresses for delete
  using (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────────
-- orders
-- ──────────────────────────────────────────────────────────────────
create table public.orders (
  id                        uuid        primary key default gen_random_uuid(),
  user_id                   uuid        not null references auth.users(id) on delete restrict,
  order_number              text        unique not null default public.generate_order_number(),
  shipping_address_id       uuid        references public.shipping_addresses(id) on delete set null,
  shipping_address_snapshot jsonb,
  subtotal                  numeric     not null,
  shipping_cost             numeric     not null default 0,
  total                     numeric     not null,
  status                    text        not null default 'pending'
                            check (status in ('pending','paid','printing','shipped','delivered','cancelled')),
  customer_email            text        not null,
  customer_phone            text,
  notes                     text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Admins update via service role (bypasses RLS)
create policy "orders_update_admin"
  on public.orders for update
  using (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────────────
-- order_items
-- ──────────────────────────────────────────────────────────────────
create table public.order_items (
  id          uuid        primary key default gen_random_uuid(),
  order_id    uuid        not null references public.orders(id) on delete cascade,
  product_id  uuid        references public.products(id) on delete set null,
  quote_id    uuid        references public.quotes(id) on delete set null,
  name        text        not null,
  description text,
  unit_price  numeric     not null,
  quantity    integer     not null default 1,
  subtotal    numeric     not null,
  created_at  timestamptz not null default now()
);

alter table public.order_items enable row level security;

create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────────────────────────
-- updated_at triggers
-- ──────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger set_shipping_addresses_updated_at
  before update on public.shipping_addresses
  for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
