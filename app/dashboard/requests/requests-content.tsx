"use client";

import { useState, useTransition } from "react";
import { updateRequestStatus } from "../actions";

const STATUS_OPTIONS = [
  { value: "open", label: "Open", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
  { value: "in_progress", label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", dot: "bg-blue-400" },
  { value: "resolved", label: "Resolved", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
];

const CATEGORY_ICONS: Record<string, string> = {
  plumbing: "🔧",
  electrical: "⚡",
  hvac: "❄️",
  appliance: "🏠",
  other: "📋",
};

interface Request {
  id: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  units: { label: string; tenant_name: string | null; tenant_email: string | null; properties: { name: string } | null } | null;
}

export function RequestsContent({ requests: initialRequests }: { requests: Request[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const filtered = requests.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const tenantName = r.units?.tenant_name?.toLowerCase() ?? "";
      const desc = r.description.toLowerCase();
      const unit = r.units?.label?.toLowerCase() ?? "";
      if (!tenantName.includes(q) && !desc.includes(q) && !unit.includes(q)) return false;
    }
    return true;
  });

  function handleStatusUpdate(requestId: string, newStatus: string) {
    const requestNote = notes[requestId];
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, newStatus, requestNote || undefined);
      if (result.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r
          )
        );
        setNotes((prev) => {
          const next = { ...prev };
          delete next[requestId];
          return next;
        });
        setExpandedId(null);
      }
    });
  }

  const statusCounts = {
    all: requests.length,
    open: requests.filter((r) => r.status === "open").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Requests</h1>
        <p className="text-sm text-muted mt-1">Manage all maintenance requests</p>
      </div>

      {/* Filters bar */}
      <div className="mb-6 space-y-3">
        {/* Status filter tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "in_progress", label: "In Progress" },
            { value: "resolved", label: "Resolved" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === opt.value
                  ? "bg-surface-secondary text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {opt.label} ({statusCounts[opt.value as keyof typeof statusCounts]})
            </button>
          ))}
        </div>

        {/* Search + category */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search by tenant, description, or unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="appliance">Appliance</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Request list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-sm text-muted">
            {requests.length === 0
              ? "No maintenance requests yet."
              : "No requests match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((request) => {
            const statusConf = STATUS_OPTIONS.find((s) => s.value === request.status) ?? STATUS_OPTIONS[0];
            const isExpanded = expandedId === request.id;

            return (
              <div
                key={request.id}
                className="rounded-xl border border-border bg-surface overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  className="flex w-full items-center gap-4 px-4 py-3.5 text-left hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="text-lg shrink-0">{CATEGORY_ICONS[request.category] ?? "📋"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{request.description}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {request.units?.tenant_name ?? "No tenant"} · {request.units?.label ?? ""}{request.units?.properties?.name ? ` · ${request.units.properties.name}` : ""}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConf.dot}`} />
                    {statusConf.label}
                  </span>
                  <time className="text-xs text-muted shrink-0 hidden sm:block">
                    {new Date(request.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                  <svg
                    className={`h-4 w-4 text-muted shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-4 py-4 space-y-4 bg-surface-secondary/30">
                    <div>
                      <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Full Description</h4>
                      <p className="text-sm">{request.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted">Tenant</p>
                        <p className="text-sm font-medium">{request.units?.tenant_name ?? "No tenant"}</p>
                        <p className="text-xs text-muted">{request.units?.tenant_email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Category</p>
                        <p className="text-sm font-medium capitalize">{request.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Submitted</p>
                        <p className="text-sm font-medium">{new Date(request.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Last Updated</p>
                        <p className="text-sm font-medium">{new Date(request.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>

                    {/* Status update */}
                    <div className="border-t border-border pt-4">
                      <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-3">Update Status</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {STATUS_OPTIONS.filter((s) => s.value !== request.status).map((s) => (
                          <button
                            key={s.value}
                            onClick={() => handleStatusUpdate(request.id, s.value)}
                            disabled={isPending}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80 disabled:opacity-40 ${s.bg} ${s.color}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                            Mark as {s.label}
                          </button>
                        ))}
                      </div>
                      <textarea
                        placeholder="Add a note (optional)..."
                        value={notes[request.id] ?? ""}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [request.id]: e.target.value }))}
                        rows={2}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
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
