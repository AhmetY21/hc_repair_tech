import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { Plaka } from "@/components/plaka";
import { Para } from "@/components/para";
import { DurumRozet } from "@/components/durum-rozet";
import { Tarih } from "@/components/tarih";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomerById } from "@/lib/data";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.adSoyad}
        description={`${customer.musteriKodu} · ${customer.telefon} · ${customer.email || "Email yok"}`}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Musteri Ozeti</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-[var(--text-secondary)]">
            <p>Vergi / TC: <span className="text-[var(--text-primary)]">{customer.vergiTcNo || "Belirtilmedi"}</span></p>
            <p>Sehir: <span className="text-[var(--text-primary)]">{customer.sehir}</span></p>
            <p>Etiket: <span className="text-[var(--text-primary)]">{customer.etiket}</span></p>
            <p>Bakiye: <span className="text-[var(--text-primary)]"><Para tutar={customer.bakiye} /></span></p>
            <p>Aciklama: <span className="text-[var(--text-primary)]">{customer.aciklama}</span></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Iliskili Araclar</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {customer.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] p-4">
                <div className="mb-3">
                  <Plaka value={vehicle.plaka} />
                </div>
                <p className="font-medium text-[var(--text-primary)]">
                  {vehicle.marka} {vehicle.model}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {vehicle.modelYili} · {vehicle.yakitTipi} · {vehicle.vitesTipi}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servis Gecmisi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {customer.services.map((service: { id: string; servisNo: string; musteriTalepleri?: string | null; durum: string; altDurum?: string | null; girisTarihi: string }) => (
            <div key={service.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">{service.servisNo}</p>
                  <p className="text-base font-medium text-[var(--text-primary)]">{service.musteriTalepleri}</p>
                </div>
                <DurumRozet durum={service.durum} altDurum={service.altDurum} />
              </div>
              <div className="mt-3 text-sm text-[var(--text-secondary)]">
                <Tarih value={service.girisTarihi} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
