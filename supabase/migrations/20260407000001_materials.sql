-- Materials table for 3D printing pricing
create table if not exists public.materials (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  price_per_gram numeric     not null,
  density        numeric     not null,
  description    text,
  active         boolean     not null default true,
  display_order  integer     not null default 0,
  created_at     timestamptz not null default now()
);

-- Seed data
insert into public.materials (name, price_per_gram, density, display_order) values
  ('PLA',        2.80, 1.24, 1),
  ('PLA+',       3.20, 1.24, 2),
  ('PETG',       3.80, 1.27, 3),
  ('ABS',        3.80, 1.04, 4),
  ('ASA',        5.00, 1.07, 5),
  ('TPU',        6.50, 1.21, 6),
  ('Nylon PA12', 10.00, 1.01, 7);

-- Enable RLS
alter table public.materials enable row level security;

-- Public read: anyone can view materials
create policy "materials_public_read"
  on public.materials for select
  using (true);

-- Authenticated write: only logged-in admins can modify
create policy "materials_auth_write"
  on public.materials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
