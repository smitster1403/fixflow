"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const pathname = usePathname();

  // Hide navbar on tenant portal pages
  if (pathname.startsWith("/request/")) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-base font-semibold tracking-tight text-foreground">
          FixFlow
        </Link>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Get started
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}
