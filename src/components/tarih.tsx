import { formatDateTime } from "@/lib/tr";

export function Tarih({
  value,
  className,
}: {
  value?: string | Date | null;
  className?: string;
}) {
  return <time className={className}>{formatDateTime(value)}</time>;
}
