"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUnitByToken(token: string) {
  const supabase = await createClient();

  const { data: unit, error } = await supabase
    .from("units")
    .select("id, label, tenant_name, tenant_email, tenant_phone, property_id")
    .eq("token", token)
    .single();

  if (error || !unit) return null;

  const { data: property } = await supabase
    .from("properties")
    .select("id, name, address")
    .eq("id", unit.property_id)
    .single();

  return { unit, property };
}

export async function getRequestsForUnit(unitId: string) {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("maintenance_requests")
    .select("*")
    .eq("unit_id", unitId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return requests;
}

export async function getStatusHistory(requestId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("status_history")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return data;
}

export async function submitRequest(
  token: string,
  formData: FormData
) {
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  const validCategories = ["plumbing", "electrical", "hvac", "appliance", "other"];
  if (!category || !validCategories.includes(category)) {
    return { error: "Invalid category" };
  }
  if (!description || description.trim().length < 10) {
    return { error: "Description must be at least 10 characters" };
  }

  const supabase = await createClient();

  // Look up unit by token
  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("id")
    .eq("token", token)
    .single();

  if (unitError || !unit) {
    return { error: "Invalid request link" };
  }

  const { error: insertError } = await supabase
    .from("maintenance_requests")
    .insert({
      unit_id: unit.id,
      category,
      description: description.trim(),
      status: "open",
    });

  if (insertError) {
    return { error: "Failed to submit request. Please try again." };
  }

  return { success: true };
}
