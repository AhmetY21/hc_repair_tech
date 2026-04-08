import { notFound } from "next/navigation";

import { ImzaCanvas } from "@/components/imza-canvas";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getServiceById } from "@/lib/data";

export default async function DeliveryFormPage({
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
        title="Servis Teslim Formu"
        description={`${service.servisNo} teslim oncesi kapanis kontrolleri`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Kapanis Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input defaultValue={String(service.kapanisKm ?? service.acilisKm ?? "")} placeholder="Kapanis KM" />
            <Input defaultValue={String(service.kapanisYakitOrani ?? service.acilisYakitOrani ?? "")} placeholder="Kapanis Yakit %" />
          </div>
          <Textarea defaultValue={service.musteriyeNot ?? ""} placeholder="Teslim notu" />
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Musteri Imzasi</h3>
            <ImzaCanvas />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
