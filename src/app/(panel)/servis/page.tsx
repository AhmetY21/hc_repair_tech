import { ServiceListPage } from "@/components/service-list-page";
import { getAllServices } from "@/lib/data";

const serviceViews = {
  today: {
    label: "Bugun",
  },
  all: {
    label: "Tum Kayitlar",
  },
  incoming: {
    label: "Servise Aliniyor",
  },
  inProgress: {
    label: "Bakim/Onarimda",
  },
  waitingParts: {
    label: "Parca Bekliyor",
  },
  ready: {
    label: "Teslime Hazir",
  },
  delivered: {
    label: "Teslim Edildi",
  },
} as const;

type ServiceViewKey = keyof typeof serviceViews;

function isServiceViewKey(value: string | undefined): value is ServiceViewKey {
  return Boolean(value && value in serviceViews);
}

export default async function ServiceIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const activeView: ServiceViewKey = isServiceViewKey(params.view) ? params.view : "today";
  const services = await getAllServices(10);

  return (
    <ServiceListPage
      title="Servis"
      description={serviceViews[activeView].label}
      services={services}
      initialFilter={activeView}
      filters={Object.entries(serviceViews).map(([key, config]) => ({
        key: key as ServiceViewKey,
        label: config.label,
      }))}
    />
  );
}
