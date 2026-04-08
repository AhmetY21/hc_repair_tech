import { Car } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getFirma } from "@/lib/data";
import { saveBrandsAction } from "@/server/actions/ayarlar";

export default async function BrandsSettingsPage() {
  const company = await getFirma();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arac Markalari"
        description="Hizmet verilen kategorileri ve haric markalari yonetmek icin ayar alani."
      />

      <Card>
        <CardHeader><CardTitle>Kategori / Haric Marka Listeleri</CardTitle></CardHeader>
        <CardContent>
          <form action={saveBrandsAction} className="space-y-4">
            <Textarea
              name="kategoriler"
              defaultValue={company.hizmetKategorileri.join(", ")}
              placeholder="Otomobil-SUV, Kamyonet, Traktor..."
            />
            <Textarea
              name="haricMarkalar"
              defaultValue={company.haricMarkalar.join(", ")}
              placeholder="Haric markalar"
            />
            <Button type="submit">
              <Car className="size-4" />
              Marka Ayarlarini Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
