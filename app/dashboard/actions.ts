"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

import { resend } from "@/lib/resend";
import { tenantWelcomeEmail } from "@/lib/emails/tenant-welcome";

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

async function ensureLandlord() {
  const landlordId = await getLandlordId();
  if (!landlordId) throw new Error("Landlord not found. Please complete onboarding.");
  return landlordId;
}

// ============================================================
// OVERVIEW / STATS
// ============================================================

export async function getDashboardStats() {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("id")
    .eq("landlord_id", landlordId);

  const propertyIds = properties?.map((p) => p.id) ?? [];

  if (propertyIds.length === 0) {
    return { open: 0, inProgress: 0, resolved: 0, totalUnits: 0, totalProperties: 0, recentRequests: [] };
  }

  const { data: units } = await supabase
    .from("units")
    .select("id")
    .in("property_id", propertyIds);

  const unitIds = units?.map((u) => u.id) ?? [];

  const { data: requests } = await supabase
    .from("maintenance_requests")
    .select("*")
    .in("unit_id", unitIds)
    .order("created_at", { ascending: false });

  const allRequests = requests ?? [];
  const open = allRequests.filter((r) => r.status === "open").length;
  const inProgress = allRequests.filter((r) => r.status === "in_progress").length;
  const resolved = allRequests.filter((r) => r.status === "resolved").length;

  const recentIds = allRequests.slice(0, 8).map((r) => r.id);
  let recentRequests: Array<Record<string, unknown>> = [];
  if (recentIds.length > 0) {
    const { data: recent } = await supabase
      .from("maintenance_requests")
      .select("*, units(label, tenant_name, properties(name))")
      .in("id", recentIds)
      .order("created_at", { ascending: false });
    recentRequests = recent ?? [];
  }

  return {
    open,
    inProgress,
    resolved,
    totalUnits: unitIds.length,
    totalProperties: propertyIds.length,
    recentRequests,
  };
}

// ============================================================
// REQUESTS
// ============================================================

export async function getAllRequests() {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("id")
    .eq("landlord_id", landlordId);

  const propertyIds = properties?.map((p) => p.id) ?? [];
  if (propertyIds.length === 0) return [];

  const { data: units } = await supabase
    .from("units")
    .select("id")
    .in("property_id", propertyIds);

  const unitIds = units?.map((u) => u.id) ?? [];
  if (unitIds.length === 0) return [];

  const { data } = await supabase
    .from("maintenance_requests")
    .select("*, units(label, tenant_name, tenant_email, properties(name))")
    .in("unit_id", unitIds)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function updateRequestStatus(
  requestId: string,
  newStatus: string,
  note?: string
) {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  // Verify this request belongs to the landlord
  const { data: request } = await supabase
    .from("maintenance_requests")
    .select("unit_id, units(property_id, properties(landlord_id))")
    .eq("id", requestId)
    .single();

  if (!request) return { error: "Request not found" };

  const prop = (request as Record<string, unknown>).units as Record<string, unknown> | null;
  const propData = prop?.properties as Record<string, unknown> | null;
  if (propData?.landlord_id !== landlordId) {
    return { error: "Unauthorized" };
  }

  const validStatuses = ["open", "in_progress", "resolved"];
  if (!validStatuses.includes(newStatus)) {
    return { error: "Invalid status" };
  }

  const { error } = await supabase
    .from("maintenance_requests")
    .update({ status: newStatus })
    .eq("id", requestId);

  if (error) return { error: "Failed to update status" };

  // If there's a note, add it to status history manually (trigger handles the status change)
  if (note?.trim()) {
    await supabase.from("status_history").insert({
      request_id: requestId,
      previous_status: null,
      new_status: newStatus,
      note: note.trim(),
    });
  }

  return { success: true };
}

export async function getRequestStatusHistory(requestId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("status_history")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

// ============================================================
// PROPERTIES
// ============================================================

export async function getProperties() {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("landlord_id", landlordId)
    .order("created_at", { ascending: false });

  if (!properties || properties.length === 0) return [];

  // For each property, fetch unit count + open request count
  const result = await Promise.all(
    properties.map(async (property) => {
      const { data: units } = await supabase
        .from("units")
        .select("id")
        .eq("property_id", property.id);

      const unitIds = units?.map((u) => u.id) ?? [];
      let openRequests = 0;

      if (unitIds.length > 0) {
        const { count } = await supabase
          .from("maintenance_requests")
          .select("*", { count: "exact", head: true })
          .in("unit_id", unitIds)
          .in("status", ["open", "in_progress"]);
        openRequests = count ?? 0;
      }

      return {
        ...property,
        unitCount: unitIds.length,
        openRequests,
      };
    })
  );

  return result;
}

export async function getPropertyWithUnits(propertyId: string) {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("landlord_id", landlordId)
    .single();

  if (!property) return null;

  const { data: units } = await supabase
    .from("units")
    .select("*")
    .eq("property_id", propertyId)
    .order("label", { ascending: true });

  return { property, units: units ?? [] };
}

export async function createProperty(formData: FormData) {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();

  if (!name || !address) return { error: "Name and address are required" };

  const { error } = await supabase.from("properties").insert({
    landlord_id: landlordId,
    name,
    address,
  });

  if (error) return { error: "Failed to create property" };
  return { success: true };
}

export async function createUnit(propertyId: string, formData: FormData) {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  // Verify property belongs to landlord
  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("landlord_id", landlordId)
    .single();

  if (!property) return { error: "Property not found" };

  const label = (formData.get("label") as string)?.trim();
  if (!label) return { error: "Unit label is required" };

  const { error } = await supabase.from("units").insert({
    property_id: propertyId,
    label,
  });

  if (error) return { error: "Failed to create unit" };
  return { success: true };
}

// ============================================================
// UNIT TENANT DETAILS
// ============================================================

export async function updateUnitTenant(unitId: string, formData: FormData) {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  // Verify unit belongs to landlord
  const { data: unit } = await supabase
    .from("units")
    .select("id, label, token, tenant_email, properties(landlord_id, name)")
    .eq("id", unitId)
    .single();

  const unitProps = (unit as Record<string, unknown>)?.properties as Record<string, unknown> | null;
  if (unitProps?.landlord_id !== landlordId) {
    return { error: "Unit not found" };
  }

  const tenantName = (formData.get("tenant_name") as string)?.trim() || null;
  const tenantEmail = (formData.get("tenant_email") as string)?.trim() || null;
  const tenantPhone = (formData.get("tenant_phone") as string)?.trim() || null;

  const { error } = await supabase
    .from("units")
    .update({
      tenant_name: tenantName,
      tenant_email: tenantEmail,
      tenant_phone: tenantPhone,
    })
    .eq("id", unitId);

  if (error) return { error: "Failed to update tenant details" };

  // Send welcome email if email was added/changed and name is present
  const previousEmail = (unit as Record<string, unknown>)?.tenant_email as string | null;
  let emailSent = false;
  if (tenantEmail && tenantName && tenantEmail !== previousEmail) {
    const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/request/${(unit as Record<string, unknown>)?.token}`;
    const unitLabel = (unit as Record<string, unknown>)?.label as string ?? "";
    const propertyName = unitProps?.name as string ?? "";

    try {
      const emailContent = tenantWelcomeEmail({
        tenantName,
        unitLabel,
        propertyName,
        portalUrl,
      });

      const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "FixFlow <onboarding@resend.dev>",
        to: tenantEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      emailSent = !emailError;
    } catch {
      emailSent = false;
    }
  }

  return { success: true, emailSent };
}

export async function sendPortalLink(unitId: string) {
  const landlordId = await ensureLandlord();
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("units")
    .select("id, label, token, tenant_name, tenant_email, properties(landlord_id, name)")
    .eq("id", unitId)
    .single();

  const unitProps = (unit as Record<string, unknown>)?.properties as Record<string, unknown> | null;
  if (unitProps?.landlord_id !== landlordId) {
    return { error: "Unit not found" };
  }

  const tenantName = (unit as Record<string, unknown>)?.tenant_name as string | null;
  const tenantEmail = (unit as Record<string, unknown>)?.tenant_email as string | null;
  const token = (unit as Record<string, unknown>)?.token as string;

  if (!tenantEmail) return { error: "No tenant email set for this unit" };
  if (!tenantName) return { error: "No tenant name set for this unit" };

  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/request/${token}`;
  const unitLabel = (unit as Record<string, unknown>)?.label as string ?? "";
  const propertyName = unitProps?.name as string ?? "";

  try {
    const emailContent = tenantWelcomeEmail({
      tenantName,
      unitLabel,
      propertyName,
      portalUrl,
    });

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "FixFlow <onboarding@resend.dev>",
      to: tenantEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (emailError) {
      return { error: `Email failed: ${emailError.message}` };
    }

    return { success: true };
  } catch (err) {
    return { error: `Email failed: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}

// ============================================================
// ONBOARDING (auto-create landlord record)
// ============================================================

export async function ensureLandlordExists(name: string, email: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("landlords")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (existing) return { landlordId: existing.id };

  const { data: created, error } = await supabase
    .from("landlords")
    .insert({ clerk_user_id: userId, name, email })
    .select("id")
    .single();

  if (error) return { error: "Failed to create account" };
  return { landlordId: created.id };
}
