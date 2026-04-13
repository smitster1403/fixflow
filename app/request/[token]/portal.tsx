"use client";

import { useState, useTransition } from "react";
import { submitRequest } from "./actions";

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing", icon: "🔧" },
  { value: "electrical", label: "Electrical", icon: "⚡" },
  { value: "hvac", label: "HVAC", icon: "❄️" },
  { value: "appliance", label: "Appliance", icon: "🏠" },
  { value: "other", label: "Other", icon: "📋" },
] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  resolved: { label: "Resolved", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
};

interface UnitData {
  unit: { id: string; label: string; tenant_name: string | null; tenant_email: string | null; tenant_phone: string | null; property_id: string };
  property: { id: string; name: string; address: string } | null;
}

interface Request {
  id: string;
  unit_id: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function TenantPortal({
  unitData,
  requests: initialRequests,
  token,
}: {
  unitData: UnitData;
  requests: Request[];
  token: string;
}) {
  const { unit, property } = unitData;
  const [tab, setTab] = useState<"submit" | "history">("submit");
  const [requests] = useState(initialRequests);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<{ success?: boolean; error?: string } | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitRequest(token, formData);
      if (result.error) {
        setFormState({ error: result.error });
      } else {
        setFormState({ success: true });
        setCategory("");
        setDescription("");
      }
    });
  }

  const openCount = requests.filter((r) => r.status === "open").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">FixFlow</h1>
              <p className="text-xs text-muted mt-0.5">Maintenance Portal</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{unit.tenant_name ?? "Tenant"}</p>
              {property && (
                <p className="text-xs text-muted">
                  {unit.label} · {property.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Stats bar */}
        {requests.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-surface p-3 text-center">
              <p className="text-2xl font-bold">{requests.length}</p>
              <p className="text-xs text-muted">Total</p>
            </div>
            <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{openCount}</p>
              <p className="text-xs text-muted">Open</p>
            </div>
            <div className="rounded-lg border border-blue-400/20 bg-blue-400/5 p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{inProgressCount}</p>
              <p className="text-xs text-muted">In Progress</p>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-lg border border-border bg-surface p-1">
          <button
            onClick={() => {
              setTab("submit");
              setFormState(null);
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "submit"
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            New Request
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "history"
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            My Requests{requests.length > 0 && ` (${requests.length})`}
          </button>
        </div>

        {/* Submit tab */}
        {tab === "submit" && (
          <>
            {formState?.success ? (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10">
                  <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Request Submitted</h2>
                <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
                  Your maintenance request has been received. Your landlord will be notified and you can track the status here.
                </p>
                <button
                  onClick={() => setFormState(null)}
                  className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formState?.error && (
                  <div className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                    {formState.error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                          category === cat.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-surface text-muted hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={category === cat.value}
                          onChange={(e) => setCategory(e.target.value)}
                          className="sr-only"
                        />
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Describe the issue
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                    placeholder="What's broken? Where is it? Any details that might help..."
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <p className="mt-1 text-xs text-muted">Minimum 10 characters</p>
                </div>

                <button
                  type="submit"
                  disabled={isPending || !category || description.length < 10}
                  className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* History tab */}
        {tab === "history" && (
          <>
            {requests.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
                  <svg className="h-7 w-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <h3 className="font-medium">No requests yet</h3>
                <p className="mt-1 text-sm text-muted">
                  Submit your first maintenance request to get started.
                </p>
                <button
                  onClick={() => setTab("submit")}
                  className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                >
                  New Request
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => {
                  const status = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.open;
                  const categoryInfo = CATEGORIES.find((c) => c.value === request.category);
                  return (
                    <div
                      key={request.id}
                      className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{categoryInfo?.icon}</span>
                            <span className="text-sm font-medium">{categoryInfo?.label ?? request.category}</span>
                          </div>
                          <p className="text-sm text-muted line-clamp-2">{request.description}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                        <time>
                          {new Date(request.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                        {request.updated_at !== request.created_at && (
                          <>
                            <span>·</span>
                            <span>
                              Updated{" "}
                              {new Date(request.updated_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-4">
        <p className="text-center text-xs text-muted">
          Powered by <span className="font-medium text-foreground">FixFlow</span>
        </p>
      </footer>
    </div>
  );
}
