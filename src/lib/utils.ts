import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatPhone(phone?: string | null) {
  if (!phone) return "Belirtilmedi";
  return phone.replace(/(\+90|0)?(\d{3})(\d{3})(\d{2})(\d{2})/, "+90 $2 $3 $4 $5");
}

export function encodeWhatsAppText(phone: string, text: string) {
  const normalized = phone.replace(/\D/g, "").replace(/^0/, "90");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
