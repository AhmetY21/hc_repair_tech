import { ServiceListPage } from "@/components/service-list-page";
import { getAllServices, getServices } from "@/lib/data";

const serviceViews = {
  today: {
    label: "Bugun",
    getServices: () => getServices(),
  },
  all: {
    label: "Tum Kayitlar",
    getServices: () => getAllServices(),
  },
  incoming: {
    label: "Servise Aliniyor",
    getServices: () => getServices("SERVISE_ALINIYOR"),
  },
  inProgress: {
    label: "Bakim/Onarimda",
    getServices: () => getServices("BAKIM_ONARIMDA"),
  },
  waitingParts: {
    label: "Parca Bekliyor",
    getServices: () => getServices("PARCA_BEKLIYOR"),
  },
  ready: {
    label: "Teslime Hazir",
    getServices: () => getServices("TESLIME_HAZIR"),
  },
  delivered: {
    label: "Teslim Edildi",
    getServices: () => getServices("TESLIM_EDILDI"),
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
  const activeConfig = serviceViews[activeView];
  const services = await activeConfig.getServices();

  return (
    <ServiceListPage
      title="Servis"
      description={activeConfig.label}
      services={services}
      filters={Object.entries(serviceViews).map(([key, config]) => ({
        label: config.label,
        href: key === "today" ? "/servis" : `/servis?view=${key}`,
        active: activeView === key,
      }))}
    />
  );
}
