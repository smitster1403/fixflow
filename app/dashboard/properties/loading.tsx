export default function PropertiesLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-28 rounded bg-surface-secondary" />
          <div className="mt-2 h-4 w-48 rounded bg-surface-secondary" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-surface-secondary" />
      </div>

      {/* Property cards skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-2">
                <div className="h-5 w-40 rounded bg-surface-secondary" />
                <div className="h-3 w-56 rounded bg-surface-secondary" />
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-14 rounded-full bg-surface-secondary" />
                <div className="h-5 w-20 rounded-full bg-surface-secondary" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 rounded-lg border border-border bg-surface-secondary/30 px-3 py-2.5">
                  <div className="h-4 w-16 rounded bg-surface-secondary" />
                  <div className="h-4 w-24 rounded bg-surface-secondary" />
                  <div className="ml-auto h-4 w-20 rounded bg-surface-secondary" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
