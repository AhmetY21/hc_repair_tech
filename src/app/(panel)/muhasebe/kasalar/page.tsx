import { Landmark, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Para } from "@/components/para";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getAccounts } from "@/lib/data";
import { saveAccountAction } from "@/server/actions/muhasebe";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kasa - Bankalar"
        description="Birden cok kasa ve banka hesabini tek merkezden yonetin."
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><CardTitle>Yeni Hesap</CardTitle></CardHeader>
          <CardContent>
            <form action={saveAccountAction} className="space-y-3">
              <Input name="ad" placeholder="Hesap adi" required />
              <Select name="tip" defaultValue="KASA">
                <option value="KASA">Kasa</option>
                <option value="BANKA">Banka</option>
              </Select>
              <Input name="aciklama" placeholder="Aciklama" />
              <Button type="submit" className="w-full">
                <PlusCircle className="size-4" />
                Hesabi Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{account.ad}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{account.tip} · {account.aciklama}</p>
                </div>
                <div className="inline-flex items-center gap-3 text-lg font-semibold text-[var(--text-primary)]">
                  <Landmark className="size-4 text-[var(--accent)]" />
                  <Para tutar={account.bakiye} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
