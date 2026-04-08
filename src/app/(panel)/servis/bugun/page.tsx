import { ServiceListPage } from "@/components/service-list-page";
import { getServices } from "@/lib/data";

export default async function TodayServicesPage() {
  const services = await getServices();

  return (
    <ServiceListPage
      title="Serviste Bugun"
      description="Bugun acilan ve aktif takip edilen servis kayitlari."
      services={services}
    />
  );
}
