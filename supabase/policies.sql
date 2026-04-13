-- FixFlow: Additional RLS policies for dashboard write operations
-- Run this in Supabase SQL Editor AFTER schema.sql

-- Landlords: allow insert (for onboarding) and update
create policy "anon_insert_landlords" on landlords
  for insert with check (true);

create policy "anon_update_landlords" on landlords
  for update using (true);

-- Properties: allow insert and update
create policy "anon_insert_properties" on properties
  for insert with check (true);

create policy "anon_update_properties" on properties
  for update using (true);

-- Units: allow insert, update (includes tenant detail editing)
create policy "anon_insert_units" on units
  for insert with check (true);

create policy "anon_update_units" on units
  for update using (true);

-- Maintenance requests: allow update (status changes from dashboard)
create policy "anon_update_requests" on maintenance_requests
  for update using (true);

-- Status history: allow insert (notes added from dashboard)
create policy "anon_insert_status_history" on status_history
  for insert with check (true);
