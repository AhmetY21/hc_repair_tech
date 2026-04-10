import Link from "next/link";
import { Download, Eye, FileText, MessageCircleMore } from "lucide-react";

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

export function ServiceListPage({
  title,
  description,
  services,
  filters,
}: {
  title: string;
  description?: string;
  services: ServiceItem[];
  filters?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
}) {
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
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button key={filter.href} asChild size="sm" variant={filter.active ? "default" : "secondary"}>
              <Link href={filter.href} prefetch={false}>
                {filter.label}
              </Link>
            </Button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4">
        {!services.length ? (
          <EmptyState
            title="Kayit bulunmuyor"
            description="Bu listede gosterilecek servis kaydi yok. Yeni bir servis olusturdugunuzda burada gorunecek."
            action={
              <Button asChild>
                <Link href="/servis/kabul" prefetch={false}>Yeni Servis Olustur</Link>
              </Button>
            }
          />
        ) : null}
        {services.map((service) => (
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
                  <Link href={`/servis/${service.id}`} prefetch={false}>
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
