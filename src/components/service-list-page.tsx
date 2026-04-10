"use client";

import Link from "next/link";
import { Download, Eye, FileText, MessageCircleMore } from "lucide-react";
import { useMemo, useState } from "react";

import { DurumRozet } from "@/components/durum-rozet";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Plaka } from "@/components/plaka";
import { Tarih } from "@/components/tarih";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { encodeWhatsAppText } from "@/lib/utils";

type ServiceItem = {
  id: string;
  servisNo: string;
  durum: string;
  altDurum?: string | null;
  girisTarihi: string;
  toplamKdvDahil: number;
  customer?: { adSoyad: string; telefon?: string };
  vehicle?: { plaka: string; marka?: string; model?: string };
};

type ServiceFilterKey =
  | "today"
  | "all"
  | "incoming"
  | "inProgress"
  | "waitingParts"
  | "ready"
  | "delivered";

type ServiceFilter = {
  key: ServiceFilterKey;
  label: string;
};

function isTodayValue(value: string) {
  const target = new Date(value);
  const now = new Date();

  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}

function matchesFilter(service: ServiceItem, filter: ServiceFilterKey) {
  switch (filter) {
    case "today":
      return isTodayValue(service.girisTarihi);
    case "incoming":
      return service.durum === "SERVISE_ALINIYOR";
    case "inProgress":
      return service.durum === "BAKIM_ONARIMDA";
    case "waitingParts":
      return service.durum === "PARCA_BEKLIYOR";
    case "ready":
      return service.durum === "TESLIME_HAZIR";
    case "delivered":
      return service.durum === "TESLIM_EDILDI";
    case "all":
    default:
      return true;
  }
}

export function ServiceListPage({
  title,
  description,
  services,
  filters,
  initialFilter = "today",
}: {
  title: string;
  description?: string;
  services: ServiceItem[];
  filters?: ServiceFilter[];
  initialFilter?: ServiceFilterKey;
}) {
  const [activeFilter, setActiveFilter] = useState<ServiceFilterKey>(initialFilter);
  const filteredServices = useMemo(
    () => services.filter((service) => matchesFilter(service, activeFilter)),
    [activeFilter, services],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href="/api/export/servisler" prefetch={false}>
                <Download className="size-4" />
                Excel'e Aktar
              </Link>
            </Button>
            <Button asChild>
              <Link href="/servis/kabul" prefetch={false}>
                <FileText className="size-4" />
                Yeni Servis
              </Link>
            </Button>
          </>
        }
      />

      {filters?.length ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                type="button"
                size="sm"
                variant={filter.key === activeFilter ? "default" : "secondary"}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)]">Son 10 kayit gosteriliyor</p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {!filteredServices.length ? (
          <EmptyState
            title="Kayit bulunmuyor"
            description="Secili sekmede gosterilecek servis kaydi yok. Yeni bir servis olusturdugunuzda burada gorunecek."
            action={
              <Button asChild>
                <Link href="/servis/kabul" prefetch={false}>Yeni Servis Olustur</Link>
              </Button>
            }
          />
        ) : null}
        {filteredServices.map((service) => (
          <Card key={service.id}>
            <CardContent className="grid gap-4 p-6 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                    {service.servisNo}
                  </span>
                  <DurumRozet durum={service.durum} altDurum={service.altDurum} />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {service.vehicle?.plaka ? <Plaka value={service.vehicle.plaka} /> : null}
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{service.customer?.adSoyad}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {service.vehicle?.marka} {service.vehicle?.model}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-1 text-sm text-[var(--text-secondary)]">
                <p>
                  Giris: <Tarih value={service.girisTarihi} className="text-[var(--text-primary)]" />
                </p>
                <p>Toplam: <span className="font-medium text-[var(--text-primary)]">{service.toplamKdvDahil.toLocaleString("tr-TR")} ₺</span></p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/servis/${service.id}`}>
                    <Eye className="size-4" />
                    Detay
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <a
                    href={encodeWhatsAppText(
                      service.customer?.telefon ?? "+905555555555",
                      `${service.servisNo} numarali servis kaydiniz ${service.durum} durumundadir.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircleMore className="size-4" />
                    Musteriye Bildir
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
