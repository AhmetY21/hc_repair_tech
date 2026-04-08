import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, MessageCircleMore } from "lucide-react";

import { DurumRozet } from "@/components/durum-rozet";
import { PageHeader } from "@/components/page-header";
import { Plaka } from "@/components/plaka";
import { Tarih } from "@/components/tarih";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceById } from "@/lib/data";
import { formatCurrency } from "@/lib/tr";
import { encodeWhatsAppText } from "@/lib/utils";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Servis ${service.servisNo}`}
        description={`${service.customer?.adSoyad} · ${service.vehicle?.marka} ${service.vehicle?.model}`}
        actions={
          <>
            <Button variant="secondary" asChild>
              <Link href={`/api/pdf/kabul/${service.id}`}>
                <Download className="size-4" />
                Kabul PDF
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/api/pdf/teslim/${service.id}`}>
                <Download className="size-4" />
                Teslim PDF
              </Link>
            </Button>
            <Button asChild>
              <a
                href={encodeWhatsAppText(
                  service.customer?.telefon ?? "+905555555555",
                  `${service.servisNo} numarali kaydiniz ${service.durum} durumundadir. Isterseniz teslim oncesi teyit icin bize yazabilirsiniz.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircleMore className="size-4" />
                Musteriye Bildir
              </a>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Servis Ozeti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <Plaka value={service.vehicle?.plaka ?? "00AAA000"} />
              <DurumRozet durum={service.durum} altDurum={service.altDurum} />
            </div>
            <div className="grid gap-3 md:grid-cols-2 text-sm text-[var(--text-secondary)]">
              <p>Giris: <span className="text-[var(--text-primary)]"><Tarih value={service.girisTarihi} /></span></p>
              <p>Danisman: <span className="text-[var(--text-primary)]">{service.servisDanismani}</span></p>
              <p>Teknisyen: <span className="text-[var(--text-primary)]">{service.technician?.adSoyad || "Atanmadi"}</span></p>
              <p>Acilis KM: <span className="text-[var(--text-primary)]">{service.acilisKm}</span></p>
              <p>Acilis Yakit: <span className="text-[var(--text-primary)]">%{service.acilisYakitOrani}</span></p>
              <p>Toplam: <span className="text-[var(--text-primary)]">{formatCurrency(service.toplamKdvDahil)}</span></p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Musteri Talepleri</h3>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] p-4 text-sm text-[var(--text-primary)]">
                {service.musteriTalepleri}
              </p>
            </div>
            <div className="grid gap-3">
              {service.kalemler.map((item: { ad: string; birim: string; kdvOrani: number; toplam: number }, index: number) => (
                <div key={`${item.ad}-${index}`} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] px-4 py-3">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.ad}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.birim} · KDV %{item.kdvOrani}
                    </p>
                  </div>
                  <p className="font-semibold text-[var(--text-primary)]">{formatCurrency(item.toplam)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hizli Islemler</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="secondary" asChild>
                <Link href={`/servis/${service.id}/islemler`}>
                  Durum Akisi
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`/servis/${service.id}/kabul-formu`}>Kabul Formu</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`/servis/${service.id}/teslim-formu`}>Teslim Formu</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tahsilatlar</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {service.tahsilatlar.map((payment: { id: string; aciklama: string; tarih: string; kasa: string; tutar: number }) => (
                <div key={payment.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] p-4">
                  <p className="font-medium text-[var(--text-primary)]">{payment.aciklama}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <Tarih value={payment.tarih} /> · {payment.kasa}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{formatCurrency(payment.tutar)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
