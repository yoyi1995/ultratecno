-- Additive adaptation of the existing UltraTecno beta schema.
-- Inspect pg_policies and take a database backup before applying. No table,
-- column or row is removed, and Cloudinary remains the image provider.
begin;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric not null default 0,
  category text not null default '',
  image_url text not null default '',
  in_stock boolean not null default true
);
alter table public.products add column if not exists active boolean not null default true;
alter table public.products add column if not exists featured boolean not null default false;
alter table public.products add column if not exists brand text not null default '';
alter table public.products add column if not exists images jsonb not null default '[]';
alter table public.products add column if not exists specifications jsonb not null default '{}';

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null default '',
  duration text not null default 'Por confirmar'
);
alter table public.courses add column if not exists active boolean not null default true;
alter table public.courses add column if not exists featured boolean not null default false;
alter table public.courses add column if not exists syllabus jsonb not null default '[]';
alter table public.courses add column if not exists level text not null default 'Inicial';
alter table public.courses add column if not exists modality text not null default 'Por confirmar';
alter table public.courses add column if not exists start_date date;
alter table public.courses add column if not exists schedule text not null default 'Por confirmar';
alter table public.courses add column if not exists seats integer;
alter table public.courses add column if not exists status text not null default 'upcoming';

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order integer not null default 0,
  image_url text not null default '',
  active boolean not null default true
);
alter table public.categories add column if not exists image_url text not null default '';

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image_url text not null default '',
  description text not null default '',
  includes jsonb not null default '[]',
  problems jsonb not null default '[]',
  recommendations jsonb not null default '[]',
  featured boolean not null default false,
  active boolean not null default true
);
alter table public.services add column if not exists featured boolean not null default false;

create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  content text not null default '',
  kind text not null default 'article' check (kind in ('article','youtube','video')),
  url text not null default '',
  image_url text not null default '',
  category text not null,
  active boolean not null default true
);

-- Legacy UI submitted slug and course price/available. Preserve those columns
-- and values while allowing the modern API to omit them on future inserts.
do $$ begin
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='products' and column_name='slug') then
    alter table public.products alter column slug set default gen_random_uuid()::text;
  end if;
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='courses' and column_name='slug') then
    alter table public.courses alter column slug set default gen_random_uuid()::text;
  end if;
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='courses' and column_name='price') then
    alter table public.courses alter column price set default 0;
  end if;
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='courses' and column_name='available') then
    alter table public.courses alter column available set default true;
  end if;
end $$;

-- Seven requested public cards. Existing rows win on slug; no content is
-- overwritten. Images are legitimate Unsplash assets and can later be replaced
-- from /admin through the existing Cloudinary account.
insert into public.categories(name,slug,sort_order,image_url,active) values
  ('Laptops','laptops',0,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',true),
  ('Impresoras','impresoras',1,'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=85',true),
  ('Electrónica','electronica',2,'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',true),
  ('Software y Antivirus','software-antivirus',3,'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=900&q=85',true),
  ('Cables y Adaptadores','cables-adaptadores',4,'https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=900&q=85',true),
  ('Multimedia y Accesorios','multimedia-accesorios',5,'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',true),
  ('Protección Eléctrica','proteccion-electrica',6,'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Uninterruptible_power_supply.jpg/960px-Uninterruptible_power_supply.jpg',true)
on conflict(slug) do nothing;

-- Keep every beta category reference valid without adding extra public cards.
insert into public.categories(name,slug,sort_order,image_url,active)
select initcap(replace(p.category,'-',' ')),p.category,100+dense_rank() over(order by p.category),'',false
from (select distinct category from public.products where category <> '') p
where not exists(select 1 from public.categories c where c.slug=p.category)
on conflict(slug) do nothing;

-- Restrictive guards constrain any permissive beta policy. Policies use new
-- names and are created only when absent, so applying this file never drops a
-- customer policy. Anonymous mutation privileges are explicitly revoked.
do $$ declare tab text; begin
  foreach tab in array array['products','categories','services','courses','tips'] loop
    execute format('alter table public.%I enable row level security',tab);
    execute format('grant select on public.%I to anon, authenticated',tab);
    execute format('grant insert, update, delete on public.%I to authenticated',tab);
    execute format('revoke insert, update, delete on public.%I from anon',tab);

    if not exists(select 1 from pg_policies where schemaname='public' and tablename=tab and policyname='ultra_v2_read') then
      execute format('create policy ultra_v2_read on public.%I for select to anon, authenticated using (active or coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'')',tab);
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename=tab and policyname='ultra_v2_read_guard') then
      execute format('create policy ultra_v2_read_guard on public.%I as restrictive for select to anon, authenticated using (active or coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'')',tab);
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename=tab and policyname='ultra_v2_admin_write') then
      execute format('create policy ultra_v2_admin_write on public.%I for all to authenticated using (coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'') with check (coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'')',tab);
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename=tab and policyname='ultra_v2_insert_guard') then
      execute format('create policy ultra_v2_insert_guard on public.%I as restrictive for insert to anon, authenticated with check (coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'')',tab);
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename=tab and policyname='ultra_v2_update_guard') then
      execute format('create policy ultra_v2_update_guard on public.%I as restrictive for update to anon, authenticated using (coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'') with check (coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'')',tab);
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename=tab and policyname='ultra_v2_delete_guard') then
      execute format('create policy ultra_v2_delete_guard on public.%I as restrictive for delete to anon, authenticated using (coalesce(auth.jwt()->''app_metadata''->>''role'','''') = ''admin'')',tab);
    end if;
  end loop;
end $$;

commit;
