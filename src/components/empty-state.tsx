import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
