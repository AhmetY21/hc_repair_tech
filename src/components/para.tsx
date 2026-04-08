import { formatCurrency } from "@/lib/tr";

export function Para({ tutar, className }: { tutar: number | string; className?: string }) {
  return <span className={className}>{formatCurrency(tutar)}</span>;
}
