"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
      Back
    </button>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      {/* Left panel — branding / context */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between border-r border-border bg-surface p-10">
        <div>
          <BackButton />

          <div className="mt-16">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              FixFlow
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              The simplest way to manage maintenance requests across all your
              rental units. No spreadsheets, no lost texts.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              "Tenants submit via a link — no login needed",
              "Real-time dashboard for all your properties",
              "Automatic email notifications on status changes",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                <span className="text-sm text-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted/50">
          &copy; {new Date().getFullYear()} FixFlow
        </p>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile-only back link */}
        <div className="mb-8 w-full max-w-sm lg:hidden">
          <BackButton />
        </div>

        {children}
      </div>
    </div>
  );
}
