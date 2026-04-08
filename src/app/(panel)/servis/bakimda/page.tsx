import { ServiceListPage } from "@/components/service-list-page";
import { getServices } from "@/lib/data";

export default async function InProgressServicesPage() {
  const services = await getServices("BAKIM_ONARIMDA");

  return (
    <ServiceListPage
      title="Bakim/Onarimda"
      description="Teknisyen atanmis ve aktif islemde olan servisler."
      services={services}
    />
  );
}
