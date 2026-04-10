import { unstable_cache } from "next/cache";
import { endOfDay, startOfDay } from "date-fns";

import { DATA_TAGS } from "@/lib/cache-tags";
import { db } from "@/server/db";

function toNumber(value: unknown) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (typeof value === "object" && "toNumber" in (value as Record<string, unknown>)) {
    return Number((value as { toNumber: () => number }).toNumber());
  }
  return Number(value);
}

function getCustomerName(customer: {
  ticariUnvan: string | null;
  ad: string | null;
  soyad: string | null;
}) {
  return customer.ticariUnvan || `${customer.ad ?? ""} ${customer.soyad ?? ""}`.trim() || "Isimsiz Musteri";
}

function parseJsonArray(value?: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapService(service: any) {
  return {
    id: service.id,
    servisNo: service.servisNo,
    durum: service.durum,
    altDurum: service.altDurum,
    girisTarihi: service.girisTarihi.toISOString(),
    teslimTarihi: service.teslimTarihi?.toISOString() ?? null,
    musteriId: service.musteriId,
    aracId: service.aracId,
    teknisyenId: service.teknisyenId,
    servisDanismani: service.servisDanismani,
    araciGetiren: service.araciGetiren,
    acilisKm: service.acilisKm,
    acilisYakitOrani: service.acilisYakitOrani,
    kapanisKm: service.kapanisKm,
    kapanisYakitOrani: service.kapanisYakitOrani,
    musteriTalepleri: service.musteriTalepleri,
    musteriyeNot: service.musteriyeNot,
    icNotlar: service.icNotlar,
    toplamKdvHaric: toNumber(service.toplamKdvHaric),
    toplamKdv: toNumber(service.toplamKdv),
    toplamKdvDahil: toNumber(service.toplamKdvDahil),
    customer: service.musteri
      ? {
          id: service.musteri.id,
          adSoyad: getCustomerName(service.musteri),
          telefon: service.musteri.telefon ?? undefined,
        }
      : undefined,
    vehicle: service.arac
      ? {
          id: service.arac.id,
          plaka: service.arac.plaka,
          marka: service.arac.marka ?? undefined,
          model: service.arac.model ?? undefined,
        }
      : undefined,
    technician: service.teknisyen
      ? {
          id: service.teknisyen.id,
          adSoyad: service.teknisyen.adSoyad,
        }
      : undefined,
    kalemler: service.kalemler.map((item: any) => ({
      ad: item.ad,
      birim: item.birim,
      kdvOrani: toNumber(item.kdvOrani),
      miktar: toNumber(item.miktar),
      indirim: toNumber(item.indirimTutari),
      toplam: toNumber(item.satirToplami),
    })),
    hariciKalemler: service.hariciKalemler.map((item: any) => ({
      ad: item.ad,
      tip: item.tip,
      miktar: toNumber(item.miktar),
      maliyet: toNumber(item.maliyet),
      tedarikci: item.tedarikci,
    })),
    tahsilatlar: service.tahsilatlar.map((payment: any) => ({
      id: payment.id,
      tarih: payment.tarih.toISOString(),
      aciklama: payment.aciklama,
      kasa: payment.kasa.ad,
      tutar: toNumber(payment.tutar),
    })),
    statusHistory: service.durumGecmisi.map((history: any) => ({
      id: history.id,
      eskiDurum: history.eskiDurum,
      yeniDurum: history.yeniDurum,
      altDurum: history.altDurum,
      yapan: history.yapan,
      tarih: history.createdAt.toISOString(),
    })),
  };
}

function mapServiceListItem(service: any) {
  return {
    id: service.id,
    servisNo: service.servisNo,
    durum: service.durum,
    altDurum: service.altDurum,
    girisTarihi: service.girisTarihi.toISOString(),
    toplamKdvDahil: toNumber(service.toplamKdvDahil),
    customer: service.musteri
      ? {
          id: service.musteri.id,
          adSoyad: getCustomerName(service.musteri),
          telefon: service.musteri.telefon ?? undefined,
        }
      : undefined,
    vehicle: service.arac
      ? {
          id: service.arac.id,
          plaka: service.arac.plaka,
          marka: service.arac.marka ?? undefined,
          model: service.arac.model ?? undefined,
        }
      : undefined,
  };
}

const serviceListSelect = {
  id: true,
  servisNo: true,
  durum: true,
  altDurum: true,
  girisTarihi: true,
  toplamKdvDahil: true,
  musteri: {
    select: {
      id: true,
      ad: true,
      soyad: true,
      ticariUnvan: true,
      telefon: true,
    },
  },
  arac: {
    select: {
      id: true,
      plaka: true,
      marka: true,
      model: true,
    },
  },
} as const;

export async function getFirma() {
  const company = await unstable_cache(
    async () =>
      db.firma.findUnique({
        where: { id: "singleton" },
      }),
    ["firma"],
    { tags: [DATA_TAGS.firma], revalidate: 300 },
  )();

  return {
    firmaAdi: company?.firmaAdi ?? "",
    vergiNo: company?.vergiNo ?? "",
    telefon: company?.telefon ?? "",
    email: company?.email ?? "",
    website: company?.website ?? "",
    acikAdres: company?.acikAdres ?? "",
    sehir: company?.sehir ?? "",
    vergiDairesi: company?.vergiDairesi ?? "",
    iban: company?.iban ?? "",
    mersisNo: company?.mersisNo ?? "",
    servisKabulNotu: company?.servisKabulNotu ?? "",
    servisTeslimNotu: company?.servisTeslimNotu ?? "",
    hizmetKategorileri: parseJsonArray(company?.hizmetKategorileri),
    haricMarkalar: parseJsonArray(company?.haricMarkalar),
  };
}

export async function getSidebarCounts() {
  return unstable_cache(
    async () => {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());

      const [bugun, gecmis, grouped] = await Promise.all([
        db.servis.count({
          where: {
            deletedAt: null,
            girisTarihi: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        }),
        db.servis.count({
          where: { deletedAt: null },
        }),
        db.servis.groupBy({
          by: ["durum"],
          where: { deletedAt: null },
          _count: {
            durum: true,
          },
        }),
      ]);

      const counts = Object.fromEntries(
        grouped.map((item) => [item.durum, item._count.durum]),
      );

      return {
        bugun,
        gecmis,
        SERVISE_ALINIYOR: counts.SERVISE_ALINIYOR ?? 0,
        BAKIM_ONARIMDA: counts.BAKIM_ONARIMDA ?? 0,
        PARCA_BEKLIYOR: counts.PARCA_BEKLIYOR ?? 0,
        TESLIME_HAZIR: counts.TESLIME_HAZIR ?? 0,
        TESLIM_EDILDI: counts.TESLIM_EDILDI ?? 0,
      };
    },
    ["sidebar-counts"],
    { tags: [DATA_TAGS.sidebar, DATA_TAGS.services], revalidate: 30 },
  )();
}

export async function getCustomers() {
  const customers = await unstable_cache(
    async () =>
      db.musteri.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          musteriKodu: true,
          tip: true,
          ticariUnvan: true,
          ad: true,
          soyad: true,
          vergiTcNo: true,
          email: true,
          telefon: true,
          sehir: true,
          etiket: true,
          aciklama: true,
          bakiye: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ["customers"],
    { tags: [DATA_TAGS.customers], revalidate: 120 },
  )();

  return customers.map((customer) => ({
    id: customer.id,
    musteriKodu: customer.musteriKodu,
    tip: customer.tip,
    adSoyad: getCustomerName(customer),
    vergiTcNo: customer.vergiTcNo ?? "",
    email: customer.email ?? "",
    telefon: customer.telefon ?? "",
    sehir: customer.sehir ?? "",
    etiket: customer.etiket ?? "",
    aciklama: customer.aciklama ?? "",
    bakiye: toNumber(customer.bakiye),
  }));
}

export async function getCustomerById(id: string) {
  const customer = await db.musteri.findUnique({
    where: { id },
    include: {
      araclar: true,
      servisler: {
        include: {
          musteri: true,
          arac: true,
          teknisyen: true,
          kalemler: true,
          hariciKalemler: true,
          tahsilatlar: { include: { kasa: true } },
          durumGecmisi: true,
        },
        orderBy: { girisTarihi: "desc" },
      },
    },
  });

  if (!customer) return null;

  return {
    id: customer.id,
    musteriKodu: customer.musteriKodu,
    tip: customer.tip,
    adSoyad: getCustomerName(customer),
    vergiTcNo: customer.vergiTcNo ?? "",
    email: customer.email ?? "",
    telefon: customer.telefon ?? "",
    sehir: customer.sehir ?? "",
    etiket: customer.etiket ?? "",
    aciklama: customer.aciklama ?? "",
    bakiye: toNumber(customer.bakiye),
    vehicles: customer.araclar.map((vehicle) => ({
      id: vehicle.id,
      plaka: vehicle.plaka,
      marka: vehicle.marka ?? "",
      seri: vehicle.seri ?? "",
      model: vehicle.model ?? "",
      modelYili: vehicle.modelYili ?? null,
      sasiNo: vehicle.sasiNo ?? "",
      motorNo: vehicle.motorNo ?? "",
      yakitTipi: vehicle.yakitTipi ?? "",
      vitesTipi: vehicle.vitesTipi ?? "",
    })),
    services: customer.servisler.map((service) => mapService(service)),
  };
}

export async function getVehicles() {
  const vehicles = await unstable_cache(
    async () =>
      db.arac.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          plaka: true,
          marka: true,
          seri: true,
          model: true,
          modelYili: true,
          sasiNo: true,
          motorNo: true,
          yakitTipi: true,
          vitesTipi: true,
          motorGucu: true,
          renk: true,
          musteri: {
            select: {
              ticariUnvan: true,
              ad: true,
              soyad: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ["vehicles"],
    { tags: [DATA_TAGS.vehicles], revalidate: 120 },
  )();

  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    plaka: vehicle.plaka,
    marka: vehicle.marka ?? "",
    seri: vehicle.seri ?? "",
    model: vehicle.model ?? "",
    modelYili: vehicle.modelYili ?? null,
    sasiNo: vehicle.sasiNo ?? "",
    motorNo: vehicle.motorNo ?? "",
    yakitTipi: vehicle.yakitTipi ?? "",
    vitesTipi: vehicle.vitesTipi ?? "",
    motorGucu: vehicle.motorGucu ?? "",
    renk: vehicle.renk ?? "",
    musteri: vehicle.musteri
      ? {
          adSoyad: getCustomerName(vehicle.musteri),
        }
      : undefined,
  }));
}

export async function getVehicleByPlate(plate: string) {
  const vehicle = await db.arac.findUnique({
    where: { plaka: plate.toUpperCase() },
    include: { musteri: true },
  });

  if (!vehicle) return null;

  return {
    id: vehicle.id,
    plaka: vehicle.plaka,
    marka: vehicle.marka ?? "",
    seri: vehicle.seri ?? "",
    model: vehicle.model ?? "",
    musteri: vehicle.musteri
      ? {
          id: vehicle.musteri.id,
          adSoyad: getCustomerName(vehicle.musteri),
        }
      : undefined,
  };
}

export async function getServices(status?: string) {
  if (!status) {
    return unstable_cache(
      async () => {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const services = await db.servis.findMany({
          where: {
            deletedAt: null,
            girisTarihi: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
          select: serviceListSelect,
          orderBy: { girisTarihi: "desc" },
        });

        return services.map((service) => mapServiceListItem(service));
      },
      ["services-today"],
      { tags: [DATA_TAGS.services], revalidate: 30 },
    )();
  }

  return unstable_cache(
    async () => {
      const services = await db.servis.findMany({
        where: {
          deletedAt: null,
          durum: status as never,
        },
        select: serviceListSelect,
        orderBy: { girisTarihi: "desc" },
      });

      return services.map((service) => mapServiceListItem(service));
    },
    ["services-by-status", status],
    { tags: [DATA_TAGS.services], revalidate: 30 },
  )();
}

export async function getAllServices() {
  return unstable_cache(
    async () => {
      const services = await db.servis.findMany({
        where: { deletedAt: null },
        select: serviceListSelect,
        orderBy: { girisTarihi: "desc" },
      });

      return services.map((service) => mapServiceListItem(service));
    },
    ["services-all"],
    { tags: [DATA_TAGS.services], revalidate: 30 },
  )();
}

export async function getServiceById(id: string) {
  const service = await db.servis.findUnique({
    where: { id },
    include: {
      musteri: true,
      arac: true,
      teknisyen: true,
      kalemler: true,
      hariciKalemler: true,
      tahsilatlar: { include: { kasa: true } },
      durumGecmisi: { orderBy: { createdAt: "desc" } },
    },
  });

  return service ? mapService(service) : null;
}

export async function getProducts() {
  const products = await unstable_cache(
    async () =>
      db.urunHizmet.findMany({
        select: {
          id: true,
          ad: true,
          kod: true,
          tip: true,
          kategori: {
            select: { ad: true },
          },
          rafKodu: true,
          kdvOrani: true,
          alisFiyatiKdvDahil: true,
          satisFiyatiKdvDahil: true,
          kalanMiktar: true,
          uyariMiktari: true,
          aktif: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ["products"],
    { tags: [DATA_TAGS.products], revalidate: 300 },
  )();

  return products.map((product) => ({
    id: product.id,
    ad: product.ad,
    kod: product.kod ?? "",
    tip: product.tip,
    kategori: product.kategori?.ad ?? "",
    rafKodu: product.rafKodu ?? "",
    kdvOrani: toNumber(product.kdvOrani),
    alis: toNumber(product.alisFiyatiKdvDahil),
    satis: toNumber(product.satisFiyatiKdvDahil),
    stok: toNumber(product.kalanMiktar),
    uyari: toNumber(product.uyariMiktari),
    aktif: product.aktif,
  }));
}

export async function getAccounts() {
  const accounts = await unstable_cache(
    async () =>
      db.kasa.findMany({
        select: {
          id: true,
          ad: true,
          tip: true,
          aciklama: true,
          tahsilatlar: {
            select: {
              tutar: true,
            },
          },
          masraflar: {
            select: {
              tutar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ["accounts"],
    { tags: [DATA_TAGS.accounts, DATA_TAGS.collections, DATA_TAGS.expenses], revalidate: 60 },
  )();

  return accounts.map((account) => ({
    id: account.id,
    ad: account.ad,
    tip: account.tip,
    aciklama: account.aciklama ?? "",
    bakiye:
      account.tahsilatlar.reduce((sum, item) => sum + toNumber(item.tutar), 0) -
      account.masraflar.reduce((sum, item) => sum + toNumber(item.tutar), 0),
  }));
}

export async function getExpenses() {
  return unstable_cache(
    async () => {
      const expenses = await db.masraf.findMany({
        select: {
          id: true,
          kategori: true,
          kasaId: true,
          tarih: true,
          aciklama: true,
          tutar: true,
          kasa: {
            select: {
              id: true,
              ad: true,
            },
          },
        },
        orderBy: { tarih: "desc" },
      });

      return expenses.map((expense) => ({
        id: expense.id,
        kategori: expense.kategori,
        kasaId: expense.kasaId,
        tarih: expense.tarih.toISOString(),
        aciklama: expense.aciklama,
        tutar: toNumber(expense.tutar),
        kasa: expense.kasa
          ? {
              id: expense.kasa.id,
              ad: expense.kasa.ad,
            }
          : undefined,
      }));
    },
    ["expenses"],
    { tags: [DATA_TAGS.expenses, DATA_TAGS.accounts], revalidate: 60 },
  )();
}

export async function getStandaloneSales() {
  return [] as Array<{
    id: string;
    tarih: string;
    aciklama: string;
    faturaTipi: string;
    tutar: number;
  }>;
}

export async function getAppointments() {
  return unstable_cache(
    async () => {
      const appointments = await db.randevu.findMany({
        orderBy: { baslangic: "asc" },
      });

      return appointments.map((appointment) => ({
        id: appointment.id,
        baslangic: appointment.baslangic.toISOString(),
        durum: appointment.durum,
        plaka: appointment.plaka ?? "",
        telefon: appointment.telefon ?? "",
        aciklama: appointment.aciklama ?? "",
      }));
    },
    ["appointments"],
    { tags: [DATA_TAGS.appointments], revalidate: 120 },
  )();
}

export async function getTechnicians() {
  const technicians = await unstable_cache(
    async () =>
      db.teknisyen.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          adSoyad: true,
          telefon: true,
          uzmanlik: true,
          aktif: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ["technicians"],
    { tags: [DATA_TAGS.technicians], revalidate: 120 },
  )();

  return technicians.map((technician) => ({
    id: technician.id,
    adSoyad: technician.adSoyad,
    telefon: technician.telefon ?? "",
    uzmanlik: technician.uzmanlik ?? "",
    aktif: technician.aktif,
  }));
}

export async function getDashboardData() {
  return unstable_cache(
    async () => {
      const [services, expenses] = await Promise.all([
        db.servis.findMany({
          where: { deletedAt: null },
          select: {
            durum: true,
            toplamKdvDahil: true,
          },
        }),
        db.masraf.findMany({
          select: {
            tutar: true,
          },
        }),
      ]);

      const totalRevenue = services.reduce((sum, item) => sum + toNumber(item.toplamKdvDahil), 0);
      const totalExpenses = expenses.reduce((sum, item) => sum + toNumber(item.tutar), 0);

      return {
        kpis: {
          gelir: totalRevenue,
          servis: totalRevenue,
          satis: 0,
          gider: totalExpenses,
          teslimEdilen: services.filter((item) => item.durum === "TESLIM_EDILDI").length,
          acikServis: services.filter((item) => item.durum !== "TESLIM_EDILDI").length,
        },
      };
    },
    ["dashboard"],
    {
      tags: [DATA_TAGS.dashboard],
      revalidate: 60,
    },
  )();
}

export async function getTodayServiceCards(limit = 3) {
  return unstable_cache(
    async () => {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());

      const services = await db.servis.findMany({
        where: {
          deletedAt: null,
          girisTarihi: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: serviceListSelect,
        orderBy: { girisTarihi: "desc" },
        take: limit,
      });

      return services.map((service) => mapServiceListItem(service));
    },
    ["today-service-cards", String(limit)],
    { tags: [DATA_TAGS.services, DATA_TAGS.dashboard], revalidate: 30 },
  )();
}

export async function getCollectionEntries() {
  return unstable_cache(
    async () => {
      const payments = await db.tahsilat.findMany({
        select: {
          id: true,
          tarih: true,
          aciklama: true,
          tutar: true,
          kasa: {
            select: {
              ad: true,
            },
          },
          servis: {
            select: {
              servisNo: true,
              musteri: {
                select: {
                  ticariUnvan: true,
                  ad: true,
                  soyad: true,
                },
              },
            },
          },
        },
        orderBy: { tarih: "desc" },
      });

      return payments.map((payment) => ({
        id: payment.id,
        tarih: payment.tarih.toISOString(),
        aciklama: payment.aciklama,
        tutar: toNumber(payment.tutar),
        kasa: payment.kasa.ad,
        servisNo: payment.servis?.servisNo ?? "Serbest Tahsilat",
        musteri: payment.servis?.musteri ? getCustomerName(payment.servis.musteri) : "Bilinmiyor",
      }));
    },
    ["collection-entries"],
    { tags: [DATA_TAGS.collections, DATA_TAGS.accounts], revalidate: 30 },
  )();
}

export async function searchEntities(query: string) {
  const term = query.trim();
  if (term.length < 2) return [];

  const [customers, vehicles, services] = await Promise.all([
    db.musteri.findMany({
      where: {
        deletedAt: null,
        OR: [
          { musteriKodu: { contains: term, mode: "insensitive" } },
          { ad: { contains: term, mode: "insensitive" } },
          { soyad: { contains: term, mode: "insensitive" } },
          { ticariUnvan: { contains: term, mode: "insensitive" } },
          { telefon: { contains: term, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        musteriKodu: true,
        ad: true,
        soyad: true,
        ticariUnvan: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.arac.findMany({
      where: {
        deletedAt: null,
        OR: [
          { plaka: { contains: term, mode: "insensitive" } },
          { marka: { contains: term, mode: "insensitive" } },
          { model: { contains: term, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        plaka: true,
        marka: true,
        model: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.servis.findMany({
      where: {
        deletedAt: null,
        OR: [
          { servisNo: { contains: term, mode: "insensitive" } },
          { musteri: { is: { ad: { contains: term, mode: "insensitive" } } } },
          { musteri: { is: { soyad: { contains: term, mode: "insensitive" } } } },
          { musteri: { is: { ticariUnvan: { contains: term, mode: "insensitive" } } } },
          { arac: { is: { plaka: { contains: term, mode: "insensitive" } } } },
        ],
      },
      select: {
        id: true,
        servisNo: true,
        durum: true,
      },
      orderBy: { girisTarihi: "desc" },
      take: 4,
    }),
  ]);

  return [
    ...services.map((service) => ({
      id: service.id,
      title: service.servisNo,
      subtitle: `${service.durum} · Servis`,
      href: `/servis/${service.id}`,
    })),
    ...customers.map((customer) => ({
      id: customer.id,
      title: getCustomerName(customer),
      subtitle: `${customer.musteriKodu} · Musteri`,
      href: `/musteriler/${customer.id}`,
    })),
    ...vehicles.map((vehicle) => ({
      id: vehicle.id,
      title: vehicle.plaka,
      subtitle: `${vehicle.marka ?? ""} ${vehicle.model ?? ""}`.trim() || "Arac",
      href: "/araclar",
    })),
  ].slice(0, 8);
}

export async function getSearchItems() {
  const [customers, vehicles, services] = await Promise.all([
    getCustomers(),
    getVehicles(),
    getAllServices(),
  ]);

  return [
    ...customers.map((customer) => ({
      id: customer.id,
      title: customer.adSoyad,
      subtitle: `${customer.musteriKodu} · Musteri`,
      href: `/musteriler/${customer.id}`,
    })),
    ...vehicles.map((vehicle) => ({
      id: vehicle.id,
      title: vehicle.plaka,
      subtitle: `${vehicle.marka} ${vehicle.model} · Arac`,
      href: "/araclar",
    })),
    ...services.map((service) => ({
      id: service.id,
      title: service.servisNo,
      subtitle: `${service.durum} · Servis`,
      href: `/servis/${service.id}`,
    })),
  ];
}
