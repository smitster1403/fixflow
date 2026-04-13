-- FixFlow: Migration to unit-centric model (removes tenants table)
-- Run this in Supabase SQL Editor

-- 1. Add tenant fields + token to units table
alter table units add column tenant_name text;
alter table units add column tenant_email text;
alter table units add column tenant_phone text;
alter table units add column token text unique default encode(gen_random_bytes(16), 'hex');

-- 2. Backfill tokens for existing units that don't have one
update units set token = encode(gen_random_bytes(16), 'hex') where token is null;

-- 3. Make token NOT NULL after backfill
alter table units alter column token set not null;

-- 4. Remove tenant_id from maintenance_requests (unit_id is sufficient)
alter table maintenance_requests drop column tenant_id;

-- 5. Drop the tenants table
drop table if exists tenants;

-- 6. Add index on units.token
create index if not exists idx_units_token on units(token);
