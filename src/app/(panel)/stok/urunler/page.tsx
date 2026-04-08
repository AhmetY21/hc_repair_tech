import Link from "next/link";
import { AlertTriangle, Download, PackagePlus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Para } from "@/components/para";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getProducts } from "@/lib/data";
import { saveProductAction } from "@/server/actions/stok";

export default async function ProductsPage() {
  const products = await getProducts();

  const totalBuy = products.reduce((sum, item) => sum + item.alis * item.stok, 0);
  const totalSell = products.reduce((sum, item) => sum + item.satis * item.stok, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Urun ve Hizmetler"
        description="Kritik stok uyarisi, kategori takibi ve servis kalemi esitligi icin stok kartlari."
        actions={
          <Button variant="secondary" asChild>
            <Link href="/api/export/urunler">
              <Download className="size-4" />
              Excel'e Aktar
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-6"><p className="text-sm text-[var(--text-secondary)]">Toplam Alis Degeri</p><p className="mt-2 text-2xl font-semibold"><Para tutar={totalBuy} /></p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-[var(--text-secondary)]">Toplam Satis Degeri</p><p className="mt-2 text-2xl font-semibold"><Para tutar={totalSell} /></p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-[var(--text-secondary)]">Potansiyel Kar</p><p className="mt-2 text-2xl font-semibold"><Para tutar={totalSell - totalBuy} /></p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-[var(--text-secondary)]">Kritik Stok</p><p className="mt-2 text-2xl font-semibold">{products.filter((item) => item.stok <= item.uyari).length}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><CardTitle>Yeni Stok Karti</CardTitle></CardHeader>
          <CardContent>
            <form action={saveProductAction} className="space-y-3">
              <Input name="ad" placeholder="Malzeme / Hizmet Adi" required />
              <Input name="kod" placeholder="Kod" required />
              <Input name="kategori" placeholder="Kategori" required />
              <Select name="tip" defaultValue="URUN">
                <option value="URUN">Urun</option>
                <option value="HIZMET">Hizmet</option>
              </Select>
              <Input name="satis" placeholder="Satis Fiyati" required />
              <Input name="stok" placeholder="Kalan Miktar" required />
              <Button type="submit" className="w-full">
                <PackagePlus className="size-4" />
                Karti Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="grid gap-4 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{product.ad}</h3>
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                      {product.tip}
                    </span>
                    {product.stok <= product.uyari ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                        <AlertTriangle className="size-3" />
                        Kritik stok
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {product.kategori} · {product.kod} · Raf {product.rafKodu || "-"}
                  </p>
                </div>
                <div className="grid gap-1 text-right text-sm text-[var(--text-secondary)]">
                  <p>Alis: <span className="text-[var(--text-primary)]"><Para tutar={product.alis} /></span></p>
                  <p>Satis: <span className="text-[var(--text-primary)]"><Para tutar={product.satis} /></span></p>
                  <p>Stok: <span className="text-[var(--text-primary)]">{product.stok}</span></p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
