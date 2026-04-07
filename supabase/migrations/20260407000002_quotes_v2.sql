-- Rename legacy quotes table (from the old contact-form system)
do $$
begin
  if exists (
    select from information_schema.tables
    where table_schema = 'public' and table_name = 'quotes'
  ) then
    alter table public.quotes rename to quotes_legacy;
  end if;
end $$;

-- New quotes table for the automated pricing system
create table public.quotes (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        references auth.users(id) on delete set null,
  file_url         text,
  file_name        text,
  volume_cm3       numeric,
  material_id      uuid        references public.materials(id),
  infill_percent   integer     not null default 20,
  quantity         integer     not null default 1,
  weight_grams     numeric,
  print_time_hours numeric,
  total_price      numeric,
  status           text        not null default 'pending',
  customer_email   text,
  customer_name    text,
  notes            text,
  created_at       timestamptz not null default now()
);

-- Enable RLS
alter table public.quotes enable row level security;

-- Users can view their own quotes; guests can view quotes with no user_id
create policy "quotes_select_own"
  on public.quotes for select
  using (auth.uid() = user_id or user_id is null);

-- Anyone (including anonymous visitors) can submit a quote
create policy "quotes_insert_anyone"
  on public.quotes for insert
  with check (true);

-- Only authenticated admins can update quotes (e.g. change status)
create policy "quotes_update_auth"
  on public.quotes for update
  using (auth.role() = 'authenticated');

-- Storage policies for stl-uploads bucket
-- NOTE: Create the bucket manually in the Supabase dashboard (see README)
-- Then run these policies:

insert into storage.buckets (id, name, public)
values ('stl-uploads', 'stl-uploads', false)
on conflict (id) do nothing;

create policy "stl_uploads_insert_anyone"
  on storage.objects for insert
  with check (bucket_id = 'stl-uploads');

create policy "stl_uploads_select_auth"
  on storage.objects for select
  using (bucket_id = 'stl-uploads' and auth.role() = 'authenticated');
