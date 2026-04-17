"use client";

import { useState, useTransition } from "react";
import { createProperty, createUnit, updateUnitTenant, sendPortalLink } from "../actions";

interface UnitData {
  id: string;
  label: string;
  tenant_name: string | null;
  tenant_email: string | null;
  tenant_phone: string | null;
  token: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  created_at: string;
  unitCount: number;
  openRequests: number;
  units: UnitData[];
}

export function PropertiesContent({ properties: initialProperties }: { properties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState<string | null>(null);
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleAddProperty(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createProperty(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.property) {
        setShowAddProperty(false);
        setError(null);
        setProperties((prev) => [
          {
            id: result.property.id,
            name: result.property.name,
            address: result.property.address,
            created_at: result.property.created_at,
            unitCount: 0,
            openRequests: 0,
            units: [],
          },
          ...prev,
        ]);
      }
    });
  }

  function handleAddUnit(propertyId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createUnit(propertyId, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.unit) {
        setShowAddUnit(null);
        setError(null);
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? {
                  ...p,
                  unitCount: p.unitCount + 1,
                  units: [
                    ...p.units,
                    {
                      id: result.unit.id,
                      label: result.unit.label,
                      tenant_name: null,
                      tenant_email: null,
                      tenant_phone: null,
                      token: result.unit.token,
                    },
                  ],
                }
              : p
          )
        );
      }
    });
  }

  function handleUpdateTenant(unitId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateUnitTenant(unitId, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setEditingUnit(null);
        setError(null);
        const newEmail = (formData.get("tenant_email") as string)?.trim();
        if (newEmail && result.emailSent) {
          showToast("success", `Portal link emailed to ${newEmail}`);
        } else if (newEmail && !result.emailSent) {
          showToast("error", "Saved, but email failed to send. Use Copy Link to share manually.");
        } else {
          showToast("success", "Tenant details updated");
        }
        setProperties((prev) =>
          prev.map((p) => ({
            ...p,
            units: p.units.map((u) =>
              u.id === unitId
                ? {
                    ...u,
                    tenant_name: (formData.get("tenant_name") as string)?.trim() || null,
                    tenant_email: (formData.get("tenant_email") as string)?.trim() || null,
                    tenant_phone: (formData.get("tenant_phone") as string)?.trim() || null,
                  }
                : u
            ),
          }))
        );
      }
    });
  }

  function handleSendLink(unitId: string) {
    startTransition(async () => {
      const result = await sendPortalLink(unitId);
      if (result.error) {
        showToast("error", result.error);
      } else {
        showToast("success", "Portal link sent!");
      }
    });
  }

  function copyPortalLink(token: string) {
    const url = `${window.location.origin}/request/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-sm text-muted mt-1">Manage properties, units, and tenant details</p>
        </div>
        <button
          onClick={() => {
            setShowAddProperty(true);
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Property
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm flex items-center justify-between ${
            toast.type === "success"
              ? "border-cyan-400/20 bg-cyan-400/5 text-cyan-400"
              : "border-red-400/20 bg-red-400/5 text-red-400"
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-3 opacity-60 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Add property form */}
      {showAddProperty && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-surface p-5">
          <h3 className="text-sm font-semibold mb-4">New Property</h3>
          <form onSubmit={handleAddProperty} className="space-y-3">
            <input
              name="name"
              required
              placeholder="Property name (e.g. Maple Street Apartments)"
              className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              name="address"
              required
              placeholder="Address (e.g. 123 Maple St, Springfield, IL)"
              className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddProperty(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-40"
              >
                {isPending ? "Adding..." : "Add Property"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Properties list */}
      {properties.length === 0 && !showAddProperty ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <svg className="h-7 w-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <h3 className="font-medium">No properties yet</h3>
          <p className="mt-1 text-sm text-muted">Add your first property to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const isExpanded = expandedProperty === property.id;
            return (
              <div
                key={property.id}
                className="rounded-xl border border-border bg-surface overflow-hidden transition-colors"
              >
                {/* Property header */}
                <button
                  onClick={() => setExpandedProperty(isExpanded ? null : property.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-surface-secondary/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{property.name}</h3>
                    <p className="text-xs text-muted mt-0.5">{property.address}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {property.openRequests > 0 && (
                      <span className="inline-flex items-center rounded-full bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                        {property.openRequests} open
                      </span>
                    )}
                    <span className="text-xs text-muted">
                      {property.units.length} unit{property.units.length !== 1 ? "s" : ""}
                    </span>
                    <svg
                      className={`h-4 w-4 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded: units list */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {property.units.length === 0 ? (
                      <div className="px-5 py-6 text-center text-sm text-muted">
                        No units yet. Add your first unit below.
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {property.units.map((unit) => (
                          <div key={unit.id} className="px-5 py-3">
                            {editingUnit === unit.id ? (
                              /* Edit tenant form */
                              <form
                                onSubmit={(e) => handleUpdateTenant(unit.id, e)}
                                className="space-y-2"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium">{unit.label}</span>
                                  <span className="text-xs text-muted">— Edit tenant details</span>
                                </div>
                                <input
                                  name="tenant_name"
                                  placeholder="Tenant name"
                                  defaultValue={unit.tenant_name ?? ""}
                                  className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-1.5 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <input
                                  name="tenant_email"
                                  type="email"
                                  placeholder="Tenant email"
                                  defaultValue={unit.tenant_email ?? ""}
                                  className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-1.5 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <input
                                  name="tenant_phone"
                                  placeholder="Tenant phone (optional)"
                                  defaultValue={unit.tenant_phone ?? ""}
                                  className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-1.5 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <div className="flex gap-2 justify-end pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingUnit(null)}
                                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={isPending}
                                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-40"
                                  >
                                    {isPending ? "Saving..." : "Save"}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              /* Unit row */
                              <div className="flex items-center gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{unit.label}</span>
                                    {unit.tenant_name ? (
                                      <span className="text-xs text-muted">
                                        — {unit.tenant_name}
                                        {unit.tenant_email ? ` (${unit.tenant_email})` : ""}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-muted/60 italic">No tenant assigned</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingUnit(unit.id);
                                      setError(null);
                                    }}
                                    className="rounded-md px-2 py-1 text-xs text-primary-light hover:bg-primary/10 transition-colors"
                                    title="Edit tenant details"
                                  >
                                    Edit
                                  </button>
                                  {unit.tenant_email && (
                                    <button
                                      onClick={() => handleSendLink(unit.id)}
                                      disabled={isPending}
                                      className="rounded-md px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-400/10 transition-colors disabled:opacity-40"
                                      title="Email portal link to tenant"
                                    >
                                      {isPending ? "..." : "Send Link"}
                                    </button>
                                  )}
                                  {unit.token && unit.token !== "pending" && (
                                    <button
                                      onClick={() => copyPortalLink(unit.token)}
                                      className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                                      title="Copy portal link"
                                    >
                                      {copiedToken === unit.token ? (
                                        <span className="text-cyan-400">Copied!</span>
                                      ) : (
                                        "Copy Link"
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add unit */}
                    <div className="border-t border-border px-5 py-3">
                      {showAddUnit === property.id ? (
                        <form
                          onSubmit={(e) => handleAddUnit(property.id, e)}
                          className="flex gap-2"
                        >
                          <input
                            name="label"
                            required
                            placeholder="Unit label (e.g. Apt 2B)"
                            className="flex-1 rounded-lg border border-border bg-surface-secondary px-3 py-1.5 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-40"
                          >
                            {isPending ? "..." : "Add"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddUnit(null)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setShowAddUnit(property.id);
                            setError(null);
                          }}
                          className="text-xs text-primary-light hover:text-primary transition-colors font-medium"
                        >
                          + Add Unit
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
