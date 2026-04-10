import { Sparkles } from "lucide-react";

import { FormSubmitButton } from "@/components/form-submit-button";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { serviceTemplates } from "@/lib/constants";
import { createServiceAction } from "@/server/actions/servis";

export default async function ClassicIntakePage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const params = await searchParams;
  const hasValidationError = params.hata === "validation";
  const hasSaveError = params.hata === "save";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servis Kabul"
        description="Klasik 4 sekmeli kabul akisini tek sayfada kademeli bloklarla hizlandiran MVP formu."
      />
      {hasValidationError ? (
        <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-rose-200">
          Kayit olusturulamadi. Telefon en az 10 hane, talep metni en az 5 karakter olmali.
        </p>
      ) : null}
      {hasSaveError ? (
        <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-rose-200">
          Kayit sirasinda teknik bir hata olustu. Lutfen tekrar deneyin.
        </p>
      ) : null}

      <form action={createServiceAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Arac Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Input name="plaka" placeholder="Plaka" required />
            <Input name="sasiNo" placeholder="Sasi No" />
            <Input name="marka" placeholder="Marka" />
            <Input name="seri" placeholder="Seri" />
            <Input name="model" placeholder="Model" />
            <Input name="modelYili" placeholder="Model Yili" />
            <Select name="yakitTipi" defaultValue="Dizel">
              <option>Dizel</option>
              <option>Benzin</option>
              <option>LPG</option>
              <option>Elektrik</option>
              <option>Hibrit</option>
            </Select>
            <Select name="vitesTipi" defaultValue="Otomatik">
              <option>Otomatik</option>
              <option>Manuel</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Musteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Input name="musteriAdi" placeholder="Ad Soyad / Ticari Unvan" required />
            <Input name="telefon" placeholder="Telefon" minLength={10} inputMode="tel" required />
            <Input name="email" placeholder="Email" />
            <Input name="vergiTcNo" placeholder="Vergi / TC" />
            <Input name="adres" placeholder="Adres" className="md:col-span-2 xl:col-span-4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Servis Talepleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Input name="acilisKm" placeholder="Acilis KM" />
              <Input name="acilisYakitOrani" placeholder="Yakit %" />
              <Input name="araciGetiren" placeholder="Araci Getiren" />
            </div>
            <Textarea
              name="talepler"
              placeholder="Musteri talepleri ve yapilacak isler"
              minLength={5}
              required
            />
            <div className="flex flex-wrap gap-2">
              {serviceTemplates.map((template) => (
                <span
                  key={template}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated-2)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                >
                  <Sparkles className="mr-2 inline size-3 text-[var(--accent)]" />
                  {template}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Kabul Formu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              name="musteriyeNot"
              placeholder="Musteriye iletilecek not"
              defaultValue="Islem oncesi ek tespit olursa musteri onayi alinacaktir."
            />
            <div className="flex flex-wrap gap-3">
              <FormSubmitButton idleLabel="Servisi Olustur" pendingLabel="Kaydediliyor..." />
              <Button type="button" variant="secondary">PDF Onizleme</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
