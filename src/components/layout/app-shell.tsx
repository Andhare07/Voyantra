"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, Settings } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";

export function AppShell({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen">
      <AppHeader />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 sm:px-6 md:px-page py-4 md:py-6">
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    item.isActive
                      ? "bg-ocean/10 font-semibold text-ocean"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
