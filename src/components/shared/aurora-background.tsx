import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AuroraBackgroundProps = HTMLAttributes<HTMLDivElement>;

export function AuroraBackground({
  className,
  children,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div className={cn("aurora-background min-h-screen", className)} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
