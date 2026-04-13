"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function SignInBtn({ className }: { className?: string }) {
  return (
    <SignInButton>
      <button className={className}>Sign in</button>
    </SignInButton>
  );
}

export function SignUpBtn({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <SignUpButton>
      <button className={className}>{children ?? "Get started"}</button>
    </SignUpButton>
  );
}
