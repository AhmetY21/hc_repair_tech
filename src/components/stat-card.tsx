import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative space-y-4 p-6">
        <div className="absolute right-0 top-0 size-24 rounded-full bg-[radial-gradient(circle,_rgba(225,29,46,0.18),_transparent_60%)]" />
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] p-3">
            <Icon className="size-5 text-[var(--accent)]" />
          </div>
          <span className="text-sm">{label}</span>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-semibold text-[var(--text-primary)]">{value}</div>
          {hint ? <p className="text-sm text-[var(--text-muted)]">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
