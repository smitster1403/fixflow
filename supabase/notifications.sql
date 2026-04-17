-- Notifications table
-- Run this in your Supabase SQL Editor

create table notifications (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid references landlords(id) on delete cascade not null,
  type text not null default 'new_request',
  title text not null,
  message text not null,
  request_id uuid references maintenance_requests(id) on delete cascade,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

-- Index for fast lookups by landlord
create index idx_notifications_landlord on notifications(landlord_id, created_at desc);
create index idx_notifications_unread on notifications(landlord_id, is_read) where is_read = false;

-- RLS
alter table notifications enable row level security;

-- Landlords can read their own notifications
create policy "Landlords can view own notifications"
  on notifications for select
  using (
    landlord_id in (
      select id from landlords where clerk_user_id = auth.uid()::text
    )
  );

-- Landlords can update their own notifications (mark as read)
create policy "Landlords can update own notifications"
  on notifications for update
  using (
    landlord_id in (
      select id from landlords where clerk_user_id = auth.uid()::text
    )
  );

-- Allow inserts from any authenticated or anon user (tenant portal is unauthenticated)
create policy "Anyone can insert notifications"
  on notifications for insert
  with check (true);
