import { Rocket } from "lucide-react";

import { FormSubmitButton } from "@/components/form-submit-button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createQuickIntakeAction } from "@/server/actions/servis";

export default async function QuickIntakePage({
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
        title="Hizli Kabul"
        description="MVP'nin 5 saniyelik servis kabul akisi: plaka, telefon ve yapilacak is tanimi yeterli."
      />
      {hasValidationError ? (
        <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-rose-200">
          Kayit olusturulamadi. Telefon en az 10 hane ve is tanimi en az 5 karakter olmali.
        </p>
      ) : null}
      {hasSaveError ? (
        <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-rose-200">
          Kayit sirasinda teknik bir hata olustu. Lutfen tekrar deneyin.
        </p>
      ) : null}

      <Card className="overflow-hidden">
        <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Tek Sayfa Akis
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
              Plakayi gir, telefonu yaz, isi acikla ve servise al.
            </h2>
            <p className="max-w-xl text-base text-[var(--text-secondary)]">
              Durum otomatik olarak <strong>Servise Aliniyor</strong> olur. Eksik alanlar servis detay ekranindan sonra doldurulur.
            </p>
          </div>

          <form action={createQuickIntakeAction} className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
            <Input name="plaka" placeholder="Plaka" className="h-14 text-lg uppercase" required />
            <Input
              name="telefon"
              placeholder="Musteri telefonu"
              minLength={10}
              inputMode="tel"
              className="h-14 text-lg"
              required
            />
            <Textarea
              name="isAciklamasi"
              placeholder="Yapilacak is veya musteri sikayeti"
              minLength={5}
              className="min-h-40 text-lg"
              required
            />
            <FormSubmitButton
              size="lg"
              className="w-full"
              idleLabel="Servise Al"
              pendingLabel="Kaydediliyor..."
              idleIcon={<Rocket className="size-5" />}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
