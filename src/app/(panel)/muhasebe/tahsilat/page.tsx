import { Wallet } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Para } from "@/components/para";
import { Tarih } from "@/components/tarih";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { getCollectionEntries } from "@/lib/data";

export default async function CollectionsPage() {
  const payments = await getCollectionEntries();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tahsilat ve Odemeler"
        description="Servis icinden ve serbest kayitlardan olusan tum para hareketleri."
      />

      <div className="grid gap-4">
        {!payments.length ? (
          <EmptyState
            title="Tahsilat kaydi yok"
            description="Veritabaninda gosterilecek tahsilat veya odeme hareketi bulunmuyor."
          />
        ) : null}
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-[var(--text-primary)]">{payment.aciklama}</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {payment.servisNo} · {payment.musteri} · {payment.kasa}
                </p>
                <p className="text-sm text-[var(--text-secondary)]"><Tarih value={payment.tarih} /></p>
              </div>
              <div className="inline-flex items-center gap-3 text-lg font-semibold text-[var(--text-primary)]">
                <Wallet className="size-4 text-[var(--accent)]" />
                <Para tutar={payment.tutar} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
