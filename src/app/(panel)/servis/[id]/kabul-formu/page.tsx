import { notFound } from "next/navigation";

import { ImzaCanvas } from "@/components/imza-canvas";
import { PageHeader } from "@/components/page-header";
import { Plaka } from "@/components/plaka";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirma, getServiceById } from "@/lib/data";

export default async function AcceptanceFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [service, company] = await Promise.all([getServiceById(id), getFirma()]);

  if (!service) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servis Kabul Formu"
        description={`${company.firmaAdi} · ${service.servisNo}`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Form Onizleme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-8 text-black">
            <div className="flex flex-col gap-4 border-b border-zinc-300 pb-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{company.firmaAdi}</h2>
                <p>{company.acikAdres}</p>
                <p>{company.telefon} · {company.email}</p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-sm text-zinc-500">Servis No</p>
                <p className="text-lg font-semibold">{service.servisNo}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Musteri</h3>
                <p>{service.customer?.adSoyad}</p>
                <p>{service.customer?.telefon}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Arac</h3>
                <Plaka value={service.vehicle?.plaka ?? "00AAA000"} />
                <p>{service.vehicle?.marka} {service.vehicle?.model}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-semibold">Musteri Talepleri</h3>
              <p>{service.musteriTalepleri}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Musteri Imzasi</h3>
              <ImzaCanvas />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Servis Yetkili Imzasi</h3>
              <ImzaCanvas />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
