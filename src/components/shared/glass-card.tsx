import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass-card p-6", className)} {...props}>
      {children}
    </div>
  );
}
