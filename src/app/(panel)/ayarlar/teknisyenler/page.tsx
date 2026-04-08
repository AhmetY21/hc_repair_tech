import { Wrench, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTechnicians } from "@/lib/data";
import { saveTechnicianAction } from "@/server/actions/ayarlar";

export default async function TechniciansSettingsPage() {
  const technicians = await getTechnicians();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teknisyenler"
        description="Login olmayan ama servis is emirlerine atanabilen teknisyen listesi."
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><CardTitle>Yeni Teknisyen</CardTitle></CardHeader>
          <CardContent>
            <form action={saveTechnicianAction} className="space-y-3">
              <Input name="adSoyad" placeholder="Ad Soyad" required />
              <Input name="telefon" placeholder="Telefon" />
              <Input name="uzmanlik" placeholder="Uzmanlik" />
              <Button type="submit" className="w-full">
                <PlusCircle className="size-4" />
                Teknisyeni Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {technicians.map((technician) => (
            <Card key={technician.id}>
              <CardContent className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{technician.adSoyad}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {technician.uzmanlik} · {technician.telefon}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                  <Wrench className="size-3 text-[var(--accent)]" />
                  {technician.aktif ? "Aktif" : "Pasif"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
