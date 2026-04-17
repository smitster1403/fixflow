"use client";

import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: "Open", color: "text-amber-400", dot: "bg-amber-400" },
  in_progress: { label: "In Progress", color: "text-blue-400", dot: "bg-blue-400" },
  resolved: { label: "Resolved", color: "text-cyan-400", dot: "bg-cyan-400" },
};

const CATEGORY_ICONS: Record<string, string> = {
  plumbing: "🔧",
  electrical: "⚡",
  hvac: "❄️",
  appliance: "🏠",
  other: "📋",
};

interface Stats {
  open: number;
  inProgress: number;
  resolved: number;
  totalUnits: number;
  totalProperties: number;
  recentRequests: Array<Record<string, unknown>>;
}

export function OverviewContent({ stats }: { stats: Stats | null }) {
  // Onboarding / empty state
  if (!stats || (stats.totalProperties === 0 && stats.open === 0)) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Welcome to Sevara</h1>
        <p className="mt-3 text-muted max-w-md mx-auto">
          Start by adding your first property, then create units and add tenant details. Each unit gets a unique link for tenants to submit maintenance requests.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Your First Property
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted mt-1">Your maintenance request dashboard</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <StatCard label="Open" value={stats.open} color="text-amber-400" bgColor="bg-amber-400/10 border-amber-400/20" />
        <StatCard label="In Progress" value={stats.inProgress} color="text-blue-400" bgColor="bg-blue-400/10 border-blue-400/20" />
        <StatCard label="Resolved" value={stats.resolved} color="text-cyan-400" bgColor="bg-cyan-400/10 border-cyan-400/20" />
        <StatCard label="Total Units" value={stats.totalUnits} color="text-primary-light" bgColor="bg-primary/10 border-primary/20" />
      </div>

      {/* Quick stats strip */}
      <div className="mb-8">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-secondary">
            <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalProperties}</p>
            <p className="text-xs text-muted">Properties</p>
          </div>
        </div>
      </div>

      {/* Recent requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Requests</h2>
          {stats.recentRequests.length > 0 && (
            <Link
              href="/dashboard/requests"
              className="text-sm text-primary-light hover:text-primary transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {stats.recentRequests.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted">No maintenance requests yet. When requests are submitted, they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface divide-y divide-border overflow-hidden">
            {stats.recentRequests.map((request) => {
              const status = STATUS_CONFIG[(request.status as string) ?? "open"];
              const units = request.units as Record<string, unknown> | null;
              const tenantName = units?.tenant_name as string ?? "Unknown";
              const unitLabel = units?.label as string ?? "";
              const propertyName = (units?.properties as Record<string, unknown>)?.name as string ?? "";
              const category = request.category as string;

              return (
                <div key={request.id as string} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-secondary/50 transition-colors">
                  <span className="text-lg">{CATEGORY_ICONS[category] ?? "📋"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{request.description as string}</p>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      {tenantName} · {unitLabel}{propertyName ? ` · ${propertyName}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  <time className="text-xs text-muted shrink-0">
                    {new Date(request.created_at as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </time>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${bgColor}`}>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}
