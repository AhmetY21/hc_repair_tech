"use client";

import Link from "next/link";
import { LogOut, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/actions/auth";

const segmentLabelMap: Record<string, string> = {
  "ana-sayfa": "Ana Sayfa",
  servis: "Servis",
  kabul: "Servis Kabul",
  "hizli-kabul": "Hizli Kabul",
  bugun: "Serviste Bugun",
  gecmis: "Servis Gecmisi",
  alinan: "Servise Aliniyor",
  bakimda: "Bakim/Onarimda",
  "parca-bekleyen": "Parca Bekliyor",
  "teslime-hazir": "Teslime Hazir",
  "teslim-edildi": "Teslim Edildi",
  musteriler: "Musteriler",
  araclar: "Araclar",
  randevular: "Randevular",
  stok: "Alis-Satis",
  urunler: "Urun ve Hizmetler",
  satislar: "Satislar",
  alislar: "Alislar",
  raporlar: "Raporlar",
  muhasebe: "Muhasebe",
  tahsilat: "Tahsilat ve Odemeler",
  kasalar: "Kasa - Bankalar",
  masraflar: "Masraflar",
  ayarlar: "Ayarlar",
  firma: "Firma Bilgileri",
  notlar: "Ozellestirilmis Notlar",
  markalar: "Arac Markalari",
  teknisyenler: "Teknisyenler",
  islemler: "Servis Islemleri",
  "kabul-formu": "Kabul Formu",
  "teslim-formu": "Teslim Formu",
};

const serviceStaticSegments = new Set([
  "kabul",
  "hizli-kabul",
  "bugun",
  "gecmis",
  "alinan",
  "bakimda",
  "parca-bekleyen",
  "teslime-hazir",
  "teslim-edildi",
]);

function formatSegment(part: string) {
  return part
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const serviceId = segments[0] === "servis" && segments[1] && !serviceStaticSegments.has(segments[1])
    ? segments[1]
    : null;

  const crumbs = segments
    .map((part, index) => {
      if (serviceId && part === serviceId) {
        return "Servis Detayi";
      }

      return segmentLabelMap[part] ?? formatSegment(part);
    });

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(10,10,11,0.72)] px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 pl-12 lg:pl-0">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">H&C Servis</div>
          <div className="text-sm text-[var(--text-secondary)]">
            {crumbs.length ? crumbs.join(" / ") : "Ana sayfa"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/servis/hizli-kabul" prefetch={false}>
              <PlusCircle className="size-4" />
              Hizli Kabul
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button variant="ghost" type="submit">
              <LogOut className="size-4" />
              Cikis Yap
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
