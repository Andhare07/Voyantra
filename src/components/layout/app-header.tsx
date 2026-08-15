"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk/appearance";

export function AppHeader() {
  return (
    <header className="border-b border-border/60 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-page">
        <Link
          href="/trips"
          className="text-lg font-semibold tracking-tight text-ocean"
        >
          Voyantra
        </Link>
        <UserButton appearance={clerkAppearance} afterSignOutUrl="/" />
      </div>
    </header>
  );
}
