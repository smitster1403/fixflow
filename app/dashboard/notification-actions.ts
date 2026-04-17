"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

async function getLandlordId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data } = await supabase
    .from("landlords")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  return data?.id ?? null;
}

export async function getNotifications() {
  const landlordId = await getLandlordId();
  if (!landlordId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("landlord_id", landlordId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return [];
  return data;
}

export async function getUnreadCount() {
  const landlordId = await getLandlordId();
  if (!landlordId) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("landlord_id", landlordId)
    .eq("is_read", false);

  if (error) return 0;
  return count ?? 0;
}

export async function markNotificationRead(notificationId: string) {
  const landlordId = await getLandlordId();
  if (!landlordId) return;

  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("landlord_id", landlordId);
}

export async function markAllNotificationsRead() {
  const landlordId = await getLandlordId();
  if (!landlordId) return;

  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("landlord_id", landlordId)
    .eq("is_read", false);
}
