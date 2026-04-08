import { Rocket } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createQuickIntakeAction } from "@/server/actions/servis";

export default function QuickIntakePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hizli Kabul"
        description="MVP'nin 5 saniyelik servis kabul akisi: plaka, telefon ve yapilacak is tanimi yeterli."
      />

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
            <Input name="telefon" placeholder="Musteri telefonu" className="h-14 text-lg" required />
            <Textarea
              name="isAciklamasi"
              placeholder="Yapilacak is veya musteri sikayeti"
              className="min-h-40 text-lg"
              required
            />
            <Button type="submit" size="lg" className="w-full">
              <Rocket className="size-5" />
              Servise Al
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
