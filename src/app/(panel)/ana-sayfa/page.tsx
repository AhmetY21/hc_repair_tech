import Link from "next/link";
import { Activity, BriefcaseBusiness, FileText, Wrench } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData, getTodayServiceCards } from "@/lib/data";
import { formatCurrency } from "@/lib/tr";

export default async function DashboardPage() {
  const [dashboard, serviceList] = await Promise.all([
    getDashboardData(),
    getTodayServiceCards(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ana Sayfa"
        actions={
          <Button asChild>
            <Link href="/servis/kabul" prefetch={false}>
              <FileText className="size-4" />
              Yeni Servis
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Toplam Gelir"
          value={formatCurrency(dashboard.kpis.gelir)}
          hint={`${dashboard.kpis.acikServis} acik servis`}
        />
        <StatCard
          icon={Wrench}
          label="Acik Servis"
          value={dashboard.kpis.acikServis.toLocaleString("tr-TR")}
        />
        <StatCard
          icon={FileText}
          label="Teslim Edilen"
          value={dashboard.kpis.teslimEdilen.toLocaleString("tr-TR")}
        />
        <StatCard
          icon={BriefcaseBusiness}
          label="Toplam Gider"
          value={formatCurrency(dashboard.kpis.gider)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bugun Serviste Olanlar</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {!serviceList.length ? (
            <EmptyState
              title="Bugun servis kaydi yok"
              description="Veritabaninda bugune ait aktif servis bulunmuyor."
            />
          ) : null}
          {serviceList.slice(0, 3).map((service: { id: string; servisNo: string; durum: string; customer?: { adSoyad?: string }; vehicle?: { plaka?: string } }) => (
            <div
              key={service.id}
              className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated-2)] p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <div className="text-sm text-[var(--text-secondary)]">{service.servisNo}</div>
                <div className="text-lg font-medium text-[var(--text-primary)]">
                  {service.customer?.adSoyad} · {service.vehicle?.plaka}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <Wrench className="size-4 text-[var(--accent)]" />
                {service.durum}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
