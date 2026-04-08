import { altStatusLabels, statusColors, statusLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DurumRozet({
  durum,
  altDurum,
}: {
  durum: string;
  altDurum?: string | null;
}) {
  const resolvedStatus = (durum in statusLabels ? durum : "SERVISE_ALINIYOR") as keyof typeof statusLabels;
  const resolvedAltStatus =
    altDurum && altDurum in altStatusLabels
      ? (altDurum as keyof typeof altStatusLabels)
      : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        statusColors[resolvedStatus],
      )}
    >
      {statusLabels[resolvedStatus]}
      {resolvedAltStatus ? (
        <span className="text-[var(--text-secondary)]">/ {altStatusLabels[resolvedAltStatus]}</span>
      ) : null}
    </span>
  );
}
