create extension if not exists "pgcrypto";

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  interest text,
  office text,
  email_opt_in boolean not null default false,
  sms_opt_in boolean not null default false,
  last_checkin_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists contacts_phone_idx on public.contacts (phone);
create index if not exists contacts_email_idx on public.contacts (email);

create or replace function public.set_contacts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_contacts_updated_at on public.contacts;
create trigger set_contacts_updated_at
before update on public.contacts
for each row
execute function public.set_contacts_updated_at();

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  contact_name text not null,
  checked_in_at timestamptz not null default timezone('utc', now()),
  kiosk_id text not null,
  source text not null default 'kiosk' check (source in ('kiosk', 'web', 'manual')),
  status text not null default 'completed' check (status in ('completed', 'pending', 'cancelled')),
  interest text,
  office text,
  email_opt_in boolean not null,
  sms_opt_in boolean not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists checkins_checked_in_at_idx on public.checkins (checked_in_at desc);
create index if not exists checkins_contact_id_idx on public.checkins (contact_id);
