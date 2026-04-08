import { Download, FileText, Wrench } from "lucide-react";

import { DashboardCharts } from "@/components/dashboard-charts";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData, getTodayServiceCards } from "@/lib/data";
import { formatCurrency } from "@/lib/tr";
import { dashboardCards } from "@/lib/constants";

export default async function DashboardPage() {
  const [dashboard, serviceList] = await Promise.all([
    getDashboardData(),
    getTodayServiceCards(),
  ]);

  const chartConfig = [
    {
      title: "Arac Bazli Servis Cirosu",
      description: "Markalara gore dagilim",
      data: dashboard.markaDagilimi,
    },
    {
      title: "Urun Kategorisi Satis Cirosu",
      description: "Kategori bazli satis katkisi",
      data: dashboard.kategoriDagilimi,
    },
    {
      title: "Urun/Hizmet Satis Cirosu",
      description: "En yuksek ciro yapan kalemler",
      data: dashboard.urunDagilimi,
    },
    {
      title: "Musteri Bakiye Dagilimi",
      description: "Borclu / Alacakli / Bakiyesiz dagilimi",
      data: dashboard.bakiyeDagilimi,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ana Sayfa"
        description="Bugun, bu hafta, bu ay ve bu yil perspektifinden servis ve finans hareketlerini tek panelde takip edin."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" />
              PDF Ozeti
            </Button>
            <Button>
              <FileText className="size-4" />
              Yeni Servis
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={formatCurrency(dashboard.kpis[card.key])}
            hint={card.key === "gelir" ? `${dashboard.kpis.acikServis} acik servis` : undefined}
          />
        ))}
      </div>

      <DashboardCharts charts={chartConfig} />

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
