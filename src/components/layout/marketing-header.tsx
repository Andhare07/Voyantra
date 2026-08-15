import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk/appearance";

export function MarketingHeader() {
  return (
    <header className="border-b border-border/60 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-page">
        <Link href="/" className="text-lg font-semibold tracking-tight text-ocean">
          Voyantra
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/sample"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Sample
          </Link>
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-ocean px-3.5 py-1.5 text-white transition-opacity hover:opacity-90"
            >
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/trips"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              My Trips
            </Link>
            <UserButton appearance={clerkAppearance} afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
