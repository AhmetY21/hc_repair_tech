import { ServiceListPage } from "@/components/service-list-page";
import { getServices } from "@/lib/data";

export default async function DeliveredServicesPage() {
  const services = await getServices("TESLIM_EDILDI");

  return (
    <ServiceListPage
      title="Teslim Edildi"
      description="Teslim formu, tahsilat ve kapanis adimlari tamamlanan servisler."
      services={services}
    />
  );
}
