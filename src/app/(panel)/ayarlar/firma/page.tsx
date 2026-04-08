import { Building2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getFirma } from "@/lib/data";
import { saveFirmaAction } from "@/server/actions/ayarlar";

export default async function CompanySettingsPage() {
  const company = await getFirma();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Firma Bilgileri"
        description="PDF kabul/teslim formlari ve faturalar icin kullanilan temel firma bilgileri."
      />

      <Card>
        <CardHeader><CardTitle>Kurumsal Kart</CardTitle></CardHeader>
        <CardContent>
          <form action={saveFirmaAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input name="firmaAdi" defaultValue={company.firmaAdi} placeholder="Firma Adi" required />
            <Input name="telefon" defaultValue={company.telefon} placeholder="Telefon" />
            <Input name="email" defaultValue={company.email} placeholder="Email" />
            <Input name="website" defaultValue={company.website} placeholder="Website" />
            <Input name="vergiNo" defaultValue={company.vergiNo} placeholder="Vergi No" />
            <Input name="vergiDairesi" defaultValue={company.vergiDairesi} placeholder="Vergi Dairesi" />
            <Input name="iban" defaultValue={company.iban} placeholder="IBAN" className="md:col-span-2 xl:col-span-3" />
            <Input name="acikAdres" defaultValue={company.acikAdres} placeholder="Acik Adres" className="md:col-span-2 xl:col-span-3" />
            <div className="md:col-span-2 xl:col-span-3">
              <Button type="submit">
                <Building2 className="size-4" />
                Firma Bilgilerini Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
