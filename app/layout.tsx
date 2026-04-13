import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixFlow",
  description: "Tenant maintenance request tracker for small landlords",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
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
          <main className="flex flex-1 flex-col">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
