"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk/appearance";

export function AppHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/trips",
      label: "My Trips",
      icon: Compass,
      isActive:
        pathname === "/trips" ||
        (pathname.startsWith("/trips/") && pathname !== "/trips/new"),
    },
    {
      href: "/trips/new",
      label: "New Trip",
      icon: PlusCircle,
      isActive: pathname === "/trips/new",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 md:h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:px-page">
        <Link
          href="/trips"
          className="text-lg font-semibold tracking-tight text-ocean"
        >
          Voyantra
        </Link>
        <UserButton appearance={clerkAppearance} afterSignOutUrl="/" />
      </div>

      {/* Compact Mobile Navigation Bar (< md) */}
      <nav
        aria-label="Mobile Navigation"
        className="border-t border-border/40 bg-white/60 px-2 py-1 md:hidden"
      >
        <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-xs font-medium transition-colors ${
                  item.isActive
                    ? "bg-ocean/10 font-semibold text-ocean"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
