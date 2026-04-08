import Link from "next/link";
import { Download, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Plaka } from "@/components/plaka";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getVehicles } from "@/lib/data";
import { saveVehicleAction } from "@/server/actions/arac";

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arac Kartlari"
        description="Plaka, sasi, motor ve servis gecmisi bazinda butun araclari listeleyin."
        actions={
          <Button variant="secondary" asChild>
            <Link href="/api/export/araclar">
              <Download className="size-4" />
              Excel'e Aktar
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Yeni Arac</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveVehicleAction} className="space-y-3">
              <Input name="plaka" placeholder="Plaka" required />
              <Input name="marka" placeholder="Marka" />
              <Input name="seri" placeholder="Seri" />
              <Input name="model" placeholder="Model" />
              <Input name="modelYili" placeholder="Model Yili" />
              <Select name="yakitTipi" defaultValue="Dizel">
                <option>Dizel</option>
                <option>Benzin</option>
                <option>LPG</option>
                <option>Hibrit</option>
                <option>Elektrik</option>
              </Select>
              <Select name="vitesTipi" defaultValue="Otomatik">
                <option>Otomatik</option>
                <option>Manuel</option>
              </Select>
              <Button type="submit" className="w-full">
                <PlusCircle className="size-4" />
                Araci Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="grid gap-4 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-3">
                  <Plaka value={vehicle.plaka} />
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {vehicle.marka} {vehicle.seri} {vehicle.model}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {vehicle.modelYili} · {vehicle.yakitTipi} · {vehicle.vitesTipi}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Musteri: {vehicle.musteri?.adSoyad}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  <p>Sasi: {vehicle.sasiNo}</p>
                  <p>Motor: {vehicle.motorNo}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
