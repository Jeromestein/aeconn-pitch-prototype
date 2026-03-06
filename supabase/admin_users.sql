create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text default 'admin',
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_admin_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row
execute function public.set_admin_users_updated_at();

insert into public.admin_users (email, name, role, status)
values
  ('admin@aeconn.com', 'Aeconn Admin', 'admin', 'active')
on conflict (email) do nothing;
