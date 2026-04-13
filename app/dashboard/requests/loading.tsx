export default function RequestsLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-28 rounded bg-surface-secondary" />
        <div className="mt-2 h-4 w-52 rounded bg-surface-secondary" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 h-8 rounded-md bg-surface-secondary" />
          ))}
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-9 rounded-lg bg-surface-secondary" />
          <div className="h-9 w-36 rounded-lg bg-surface-secondary" />
        </div>
      </div>

      {/* Request list skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface px-4 py-3.5 flex items-center gap-4">
            <div className="h-6 w-6 rounded bg-surface-secondary shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-surface-secondary" />
              <div className="h-3 w-1/2 rounded bg-surface-secondary" />
            </div>
            <div className="h-5 w-20 rounded-full bg-surface-secondary" />
            <div className="h-3 w-16 rounded bg-surface-secondary hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
