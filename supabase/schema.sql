-- FixFlow Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table landlords (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  name text not null,
  created_at timestamptz default now() not null
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid references landlords(id) on delete cascade not null,
  name text not null,
  address text not null,
  created_at timestamptz default now() not null
);

create table units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  label text not null, -- e.g. "Apt 2B"
  tenant_name text,
  tenant_email text,
  tenant_phone text,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz default now() not null
);

create table maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id) on delete cascade not null,
  category text not null check (category in ('plumbing', 'electrical', 'hvac', 'appliance', 'other')),
  description text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  note text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references maintenance_requests(id) on delete cascade not null,
  previous_status text check (previous_status in ('open', 'in_progress', 'resolved')),
  new_status text not null check (new_status in ('open', 'in_progress', 'resolved')),
  note text,
  created_at timestamptz default now() not null
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_units_token on units(token);
create index idx_maintenance_requests_unit on maintenance_requests(unit_id);
create index idx_status_history_request on status_history(request_id);
create index idx_properties_landlord on properties(landlord_id);
create index idx_units_property on units(property_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table landlords enable row level security;
alter table properties enable row level security;
alter table units enable row level security;
alter table maintenance_requests enable row level security;
alter table status_history enable row level security;

-- Anon users can read units (needed for portal lookup by token)
create policy "anon_read_units" on units
  for select using (true);

-- Anon users can read properties (needed to display property info on portal)
create policy "anon_read_properties" on properties
  for select using (true);

-- Anon users can insert maintenance requests (public submit form)
create policy "anon_insert_requests" on maintenance_requests
  for insert with check (true);

-- Anon users can read their own requests (scoped by tenant_id in app logic)
create policy "anon_read_requests" on maintenance_requests
  for select using (true);

-- Anon users can read status history for visible requests
create policy "anon_read_status_history" on status_history
  for select using (true);

-- Landlords table: only readable for now (Clerk JWT auth can be added later)
create policy "anon_read_landlords" on landlords
  for select using (true);

-- ============================================================
-- TRIGGER: auto-update updated_at on maintenance_requests
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger maintenance_requests_updated_at
  before update on maintenance_requests
  for each row execute function update_updated_at();

-- ============================================================
-- TRIGGER: auto-insert status_history on status change
-- ============================================================

create or replace function log_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into status_history (request_id, previous_status, new_status)
    values (new.id, old.status, new.status);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger maintenance_requests_status_change
  after update on maintenance_requests
  for each row execute function log_status_change();
