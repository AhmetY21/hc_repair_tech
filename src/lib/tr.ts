import { format, isValid } from "date-fns";
import { tr } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

export const paraFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number | string) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return paraFormatter.format(numeric ?? 0);
}

export function formatDateTime(
  value?: string | Date | null,
  pattern = "dd.MM.yyyy HH:mm",
) {
  if (!value) return "Belirtilmedi";
  const date = typeof value === "string" ? new Date(value) : value;
  if (!isValid(date)) return "Belirtilmedi";
  return format(toZonedTime(date, "Europe/Istanbul"), pattern, { locale: tr });
}

export function formatDate(value?: string | Date | null) {
  return formatDateTime(value, "dd.MM.yyyy");
}
