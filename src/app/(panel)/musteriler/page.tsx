import Link from "next/link";
import { Download, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Para } from "@/components/para";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCustomers } from "@/lib/data";
import { saveCustomerAction } from "@/server/actions/musteri";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Musteri Kartlari"
        description="Musterileri, bakiyelerini, etiketlerini ve servis gecmislerini tek ekranda yonetin."
        actions={
          <Button variant="secondary" asChild>
            <Link href="/api/export/musteriler">
              <Download className="size-4" />
              Excel'e Aktar
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Yeni Musteri</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveCustomerAction} className="space-y-3">
              <Input name="adSoyad" placeholder="Ad Soyad / Ticari Unvan" required />
              <Input name="telefon" placeholder="Telefon" required />
              <Input name="email" placeholder="Email" />
              <Input name="vergiTcNo" placeholder="Vergi / TC No" />
              <Input name="sehir" placeholder="Sehir" />
              <Input name="etiket" placeholder="Etiket" />
              <Textarea name="aciklama" placeholder="Aciklama" />
              <Button type="submit" className="w-full">
                <PlusCircle className="size-4" />
                Musteriyi Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="grid gap-4 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{customer.adSoyad}</h3>
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                      {customer.etiket}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {customer.telefon} · {customer.email || "Email yok"} · {customer.sehir}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">{customer.aciklama}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-muted)]">Bakiye</div>
                    <div className="text-lg font-semibold text-[var(--text-primary)]">
                      <Para tutar={customer.bakiye} />
                    </div>
                  </div>
                  <Button variant="secondary" asChild>
                    <Link href={`/musteriler/${customer.id}`}>Detay</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
