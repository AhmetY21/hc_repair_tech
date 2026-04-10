import { notFound } from "next/navigation";

import { FormSubmitButton } from "@/components/form-submit-button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAccounts, getServiceById, getTechnicians } from "@/lib/data";
import { addCollectionAction, updateServiceStatusAction } from "@/server/actions/servis";

export default async function ServiceOperationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { id } = await params;
  const paramsState = await searchParams;
  const [service, technicians, accounts] = await Promise.all([
    getServiceById(id),
    getTechnicians(),
    getAccounts(),
  ]);

  if (!service) notFound();

  const hasStatusValidationError = paramsState.hata === "durum-validation";
  const hasCollectionValidationError = paramsState.hata === "tahsilat-validation";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servis Islemleri"
        description={`${service.servisNo} icin durum akisi, teknisyen ve tahsilat yonetimi`}
      />
      {hasStatusValidationError ? (
        <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-rose-200">
          Durum guncellenemedi. Lutfen zorunlu alanlari kontrol edin.
        </p>
      ) : null}
      {hasCollectionValidationError ? (
        <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-rose-200">
          Tahsilat kaydedilemedi. Kasa secimi ve tutar bilgisi zorunlu.
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Durum Gecisi</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateServiceStatusAction} className="space-y-3">
              <input type="hidden" name="servisId" value={service.id} />
              <Select name="durum" defaultValue={service.durum}>
                <option value="SERVISE_ALINIYOR">Servise Aliniyor</option>
                <option value="BAKIM_ONARIMDA">Bakim/Onarimda</option>
                <option value="PARCA_BEKLIYOR">Parca Bekliyor</option>
                <option value="TESLIME_HAZIR">Teslime Hazir</option>
                <option value="TESLIM_EDILDI">Teslim Edildi</option>
              </Select>
              <Select name="altDurum" defaultValue={service.altDurum ?? "MEKANIK"}>
                <option value="MEKANIK">Mekanik</option>
                <option value="ELEKTRIK">Elektrik</option>
                <option value="KAPORTA">Kaporta</option>
                <option value="BOYA">Boya</option>
                <option value="HARICI_MEKANIK">Harici Mekanik</option>
                <option value="HARICI_ELEKTRIK">Harici Elektrik</option>
                <option value="HARICI_KAPORTA">Harici Kaporta</option>
                <option value="HARICI_BOYA">Harici Boya</option>
              </Select>
              <Select name="teknisyenId" defaultValue={service.technician?.id ?? technicians[0]?.id}>
                {technicians.map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.adSoyad} · {technician.uzmanlik}
                  </option>
                ))}
              </Select>
              <FormSubmitButton
                className="w-full"
                idleLabel="Durumu Guncelle"
                pendingLabel="Durum Guncelleniyor..."
              />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tahsilat Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addCollectionAction} className="space-y-3">
              <input type="hidden" name="servisId" value={service.id} />
              <Input name="aciklama" defaultValue={`${service.servisNo} - ${service.vehicle?.plaka}`} required />
              <Input name="tutar" placeholder="Tutar" inputMode="decimal" required />
              <Select name="kasa" defaultValue={accounts[0]?.ad ?? ""} required>
                <option value="" disabled>
                  Kasa secin
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.ad}>
                    {account.ad}
                  </option>
                ))}
              </Select>
              {!accounts.length ? (
                <p className="text-sm text-[var(--text-muted)]">Tahsilat icin once bir kasa veya banka hesabi ekleyin.</p>
              ) : null}
              <Textarea name="not" placeholder="Ic not" />
              <FormSubmitButton
                className="w-full"
                idleLabel="Tahsilat Kaydet"
                pendingLabel="Tahsilat Kaydediliyor..."
                disabled={!accounts.length}
              />
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Durum Gecmisi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {service.statusHistory.map((history: { id: string; eskiDurum?: string | null; yeniDurum: string; altDurum?: string | null; yapan: string; tarih: string }) => (
            <div key={history.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] p-4">
              <p className="font-medium text-[var(--text-primary)]">
                {history.eskiDurum ?? "Olusturuldu"} → {history.yeniDurum}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {history.altDurum} · {history.yapan} · {history.tarih}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
