import { Receipt, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Para } from "@/components/para";
import { Tarih } from "@/components/tarih";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getExpenses } from "@/lib/data";
import { saveExpenseAction } from "@/server/actions/muhasebe";

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Masraflar"
        description="Kira, elektrik ve diger genel giderlerin muhasebe takibi."
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><CardTitle>Yeni Masraf</CardTitle></CardHeader>
          <CardContent>
            <form action={saveExpenseAction} className="space-y-3">
              <Input name="kategori" placeholder="Kategori" required />
              <Input name="aciklama" placeholder="Aciklama" required />
              <Input name="tutar" placeholder="Tutar" required />
              <Button type="submit" className="w-full">
                <PlusCircle className="size-4" />
                Masrafi Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {expenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{expense.aciklama}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {expense.kategori} · {expense.kasa?.ad}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]"><Tarih value={expense.tarih} /></p>
                </div>
                <div className="inline-flex items-center gap-3 text-lg font-semibold text-[var(--text-primary)]">
                  <Receipt className="size-4 text-[var(--accent)]" />
                  <Para tutar={expense.tutar} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
