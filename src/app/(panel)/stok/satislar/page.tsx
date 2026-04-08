import { ReceiptText } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Para } from "@/components/para";
import { Tarih } from "@/components/tarih";
import { Card, CardContent } from "@/components/ui/card";
import { getStandaloneSales } from "@/lib/data";

export default async function SalesPage() {
  const sales = await getStandaloneSales();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Satislar"
        description="Servis disi tezgah satislari, tarih filtreleri ve fatura durumu takibi."
      />

      <div className="grid gap-4">
        {sales.map((sale) => (
          <Card key={sale.id}>
            <CardContent className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-[var(--text-primary)]">{sale.aciklama}</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  <Tarih value={sale.tarih} /> · {sale.faturaTipi}
                </p>
              </div>
              <div className="inline-flex items-center gap-3 text-lg font-semibold text-[var(--text-primary)]">
                <ReceiptText className="size-4 text-[var(--accent)]" />
                <Para tutar={sale.tutar} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
