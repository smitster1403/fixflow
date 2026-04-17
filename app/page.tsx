import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -top-20 left-1/4 h-[300px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-3xl px-6 pb-32 pt-28 sm:pt-40 text-center">
          <p className="mb-5 text-sm font-medium tracking-wide text-primary uppercase">
            Maintenance ops for landlords
          </p>

          <h1 className="text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            One link for tenants.
            <br />
            <span className="text-muted">One dashboard for you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Tenants open a link, describe the problem, and submit. You see
            every request across every unit in real time — no apps, no
            logins, no spreadsheets.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all hover:bg-primary-dark hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            >
              Get started free
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium text-muted transition-colors hover:border-muted/40 hover:text-foreground"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard preview mockup */}
      <section className="relative -mt-8 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-primary/5">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 flex-1 rounded-md bg-surface-secondary px-3 py-1 text-center text-xs text-muted">
                sevara.app/dashboard
              </span>
            </div>
            {/* Mock dashboard content */}
            <div className="grid grid-cols-3 gap-px bg-border">
              {/* Sidebar */}
              <div className="col-span-1 bg-surface p-4 space-y-3">
                <div className="h-3 w-20 rounded bg-muted/20" />
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded bg-primary/60" />
                    <div className="h-2.5 w-16 rounded bg-muted/15" />
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1.5">
                    <div className="h-2.5 w-2.5 rounded bg-primary" />
                    <div className="h-2.5 w-20 rounded bg-primary/40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded bg-muted/20" />
                    <div className="h-2.5 w-14 rounded bg-muted/15" />
                  </div>
                </div>
              </div>
              {/* Main area */}
              <div className="col-span-2 bg-surface p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-36 rounded bg-muted/20" />
                  <div className="h-6 w-20 rounded-md bg-primary/20" />
                </div>
                {/* Request rows */}
                {[
                  { color: "bg-yellow-500", w: "w-28" },
                  { color: "bg-primary", w: "w-32" },
                  { color: "bg-emerald-500", w: "w-24" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className={`h-2 w-2 rounded-full ${row.color}`} />
                    <div className={`h-2.5 ${row.w} rounded bg-muted/20`} />
                    <div className="ml-auto h-2.5 w-14 rounded bg-muted/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="mt-24 border-y border-border">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-8 text-sm text-muted">
          <span>No credit card required</span>
          <span className="hidden sm:inline text-border">|</span>
          <span>Free for up to 10 units</span>
          <span className="hidden sm:inline text-border">|</span>
          <span>Setup in under 5 minutes</span>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-lg">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Three steps, zero friction.
            </h2>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Set up your properties",
                desc: "Add buildings, create units, invite tenants. Each tenant gets a unique request link — no app install needed.",
              },
              {
                num: "02",
                title: "Tenant submits a request",
                desc: "They tap their link, pick a category (plumbing, HVAC, electrical…), describe the issue, and hit send.",
              },
              {
                num: "03",
                title: "You resolve it",
                desc: "Requests land in your dashboard in real time. Update status, add notes — tenants are notified automatically.",
              },
            ].map((step) => (
              <div key={step.num} className="bg-surface p-8 sm:p-10">
                <span className="font-mono text-xs text-primary">{step.num}</span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento feature grid */}
      <section className="border-t border-border py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-lg">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for the way you actually work.
            </h2>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Large featured card */}
            <div className="sm:col-span-2 lg:col-span-2 rounded-2xl border border-border bg-surface p-8 sm:p-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.03a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.34 8.374" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">No tenant login required</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Every tenant gets a unique link. They open it, submit a request,
                and they&apos;re done. No accounts, no passwords, no friction.
                Works on any device.
              </p>
            </div>

            {[
              {
                title: "Real-time dashboard",
                desc: "New requests appear instantly. Filter by property, unit, status, or category.",
                icon: (
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                  </svg>
                ),
              },
              {
                title: "Status tracking",
                desc: "Open, in progress, resolved. Full audit trail on every request.",
                icon: (
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                title: "Email notifications",
                desc: "Tenants are notified when you update a request. No manual follow-ups.",
                icon: (
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                ),
              },
              {
                title: "Multi-property",
                desc: "Manage buildings across different addresses from a single account.",
                icon: (
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                ),
              },
              {
                title: "Categorized requests",
                desc: "Plumbing, electrical, HVAC, appliance, other — sorted from the start.",
                icon: (
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                  </svg>
                ),
              },
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Stop chasing maintenance requests.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted">
            Set up in minutes. Free for up to 10 units — no credit card
            required.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-all hover:bg-primary-dark hover:shadow-[0_0_36px_rgba(16,185,129,0.4)]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <span className="text-sm font-semibold text-foreground">Sevara</span>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Sevara. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
