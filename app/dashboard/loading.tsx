export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-32 rounded bg-surface-secondary" />
        <div className="mt-2 h-4 w-48 rounded bg-surface-secondary" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <div className="h-3 w-16 rounded bg-surface-secondary mb-3" />
            <div className="h-8 w-12 rounded bg-surface-secondary" />
          </div>
        ))}
      </div>

      {/* Recent requests skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface px-4 py-3.5 flex items-center gap-4">
            <div className="h-6 w-6 rounded bg-surface-secondary shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-surface-secondary" />
              <div className="h-3 w-1/2 rounded bg-surface-secondary" />
            </div>
            <div className="h-5 w-16 rounded-full bg-surface-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
