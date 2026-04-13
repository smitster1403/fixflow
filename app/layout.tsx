import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SignInBtn, SignUpBtn } from "@/components/auth-buttons";
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
          <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
              <Link href="/" className="text-xl font-bold tracking-tight text-primary">
                FixFlow
              </Link>
              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInBtn className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary" />
                  <SignUpBtn className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark" />
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
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
