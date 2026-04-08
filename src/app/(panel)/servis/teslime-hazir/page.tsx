import { ServiceListPage } from "@/components/service-list-page";
import { getServices } from "@/lib/data";

export default async function ReadyServicesPage() {
  const services = await getServices("TESLIME_HAZIR");

  return (
    <ServiceListPage
      title="Teslime Hazir"
      description="Teslim formu tamamlanarak musterinin alinmasini bekleyen servisler."
      services={services}
    />
  );
}
