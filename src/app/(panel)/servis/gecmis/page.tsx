import { ServiceListPage } from "@/components/service-list-page";
import { getAllServices } from "@/lib/data";

export default async function ServiceHistoryPage() {
  const services = await getAllServices();

  return (
    <ServiceListPage
      title="Servis Gecmisi"
      description="Tum servislerin durum, toplam ve musteri detaylari ile birlikte gecmis gorunumu."
      services={services}
    />
  );
}
