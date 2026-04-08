import { ServiceListPage } from "@/components/service-list-page";
import { getServices } from "@/lib/data";

export default async function WaitingPartServicesPage() {
  const services = await getServices("PARCA_BEKLIYOR");

  return (
    <ServiceListPage
      title="Parca Bekliyor"
      description="Parca veya tedarik bekleyen is emirleri."
      services={services}
    />
  );
}
