import { CalendarClock, TimerReset } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Tarih } from "@/components/tarih";
import { Card, CardContent } from "@/components/ui/card";
import { getAppointments } from "@/lib/data";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Randevular"
        description="V2'de public form ile genisletilecek randevu modulu icin panel ici listeleme ve takip hazir."
      />

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-[var(--text-primary)]">{appointment.plaka}</p>
                <p className="text-sm text-[var(--text-secondary)]">{appointment.aciklama}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-2">
                  <CalendarClock className="size-4 text-[var(--accent)]" />
                  <Tarih value={appointment.baslangic} />
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">{appointment.durum}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EmptyState
        title="Public randevu formu V2'ye ayrildi"
        description="MVP'de sadece panel ici randevu takibi acik. Web sitesindeki public form ve QR akis sonraki surume planlandi."
        action={
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)]">
            <TimerReset className="size-4 text-[var(--accent)]" />
            V2 backlog hazir
          </div>
        }
      />
    </div>
  );
}
