import { BarChart3 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Para } from "@/components/para";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/lib/data";

export default async function StockReportsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stok Raporlari"
        description="Urun, hizmet ve kategori bazli potansiyel kar marji gorunumu."
      />

      <div className="grid gap-4">
        {products.map((product) => {
          const profit = product.satis - product.alis;
          const margin = product.satis ? Math.round((profit / product.satis) * 100) : 0;

          return (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BarChart3 className="size-5 text-[var(--accent)]" />
                  {product.ad}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-4 text-sm text-[var(--text-secondary)]">
                <p>Alis: <span className="text-[var(--text-primary)]"><Para tutar={product.alis} /></span></p>
                <p>Satis: <span className="text-[var(--text-primary)]"><Para tutar={product.satis} /></span></p>
                <p>Kar: <span className="text-[var(--text-primary)]"><Para tutar={profit} /></span></p>
                <p>Kar Marji: <span className="text-[var(--text-primary)]">%{margin}</span></p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
