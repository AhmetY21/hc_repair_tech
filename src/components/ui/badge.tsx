import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex min-w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated-2)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]",
        className,
      )}
      {...props}
    />
  );
}
