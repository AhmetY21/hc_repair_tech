import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[var(--bg-elevated-2)]/90",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_ease-in-out_infinite]",
        "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]",
        className,
      )}
      {...props}
    />
  );
}
