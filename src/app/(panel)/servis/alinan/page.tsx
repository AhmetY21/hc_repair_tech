import { ServiceListPage } from "@/components/service-list-page";
import { getServices } from "@/lib/data";

export default async function IncomingServicesPage() {
  const services = await getServices("SERVISE_ALINIYOR");

  return (
    <ServiceListPage
      title="Servise Aliniyor"
      description="Kabul tamamlanmis ancak isleme alinmamis kayitlar."
      services={services}
    />
  );
}
