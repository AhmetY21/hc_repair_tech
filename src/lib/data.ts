import { endOfDay, startOfDay } from "date-fns";

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

export async function getFirma() {
  const company = await db.firma.findUnique({
    where: { id: "singleton" },
  });

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
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [bugun, gecmis, grouped] = await Promise.all([
    db.servis.count({
      where: {
        girisTarihi: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    db.servis.count(),
    db.servis.groupBy({
      by: ["durum"],
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
}

export async function getCustomers() {
  const customers = await db.musteri.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

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
  const vehicles = await db.arac.findMany({
    where: { deletedAt: null },
    include: { musteri: true },
    orderBy: { createdAt: "desc" },
  });

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
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const services = await db.servis.findMany({
    where: {
      deletedAt: null,
      ...(status ? { durum: status as never } : {}),
    },
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
  });

  const mapped = services.map((service) => mapService(service));

  if (!status) {
    return mapped.filter((service) => {
      const date = new Date(service.girisTarihi);
      return date >= todayStart && date <= todayEnd;
    });
  }

  return mapped;
}

export async function getAllServices() {
  const services = await db.servis.findMany({
    where: { deletedAt: null },
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
  });

  return services.map((service) => mapService(service));
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
  const products = await db.urunHizmet.findMany({
    include: { kategori: true },
    orderBy: { createdAt: "desc" },
  });

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
  const accounts = await db.kasa.findMany({
    include: {
      tahsilatlar: true,
      masraflar: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
  const expenses = await db.masraf.findMany({
    include: { kasa: true },
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
}

export async function getTechnicians() {
  const technicians = await db.teknisyen.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return technicians.map((technician) => ({
    id: technician.id,
    adSoyad: technician.adSoyad,
    telefon: technician.telefon ?? "",
    uzmanlik: technician.uzmanlik ?? "",
    aktif: technician.aktif,
  }));
}

export async function getDashboardData() {
  const [services, customers, products, expenses] = await Promise.all([
    getAllServices(),
    getCustomers(),
    getProducts(),
    getExpenses(),
  ]);

  const totalRevenue = services.reduce((sum, item) => sum + item.toplamKdvDahil, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.tutar, 0);

  const markaMap = new Map<string, number>();
  const urunMap = new Map<string, number>();

  services.forEach((service: any) => {
    const vehicleName = service.vehicle?.marka || "Belirtilmedi";
    markaMap.set(vehicleName, (markaMap.get(vehicleName) ?? 0) + service.toplamKdvDahil);

    service.kalemler.forEach((item: any) => {
      urunMap.set(item.ad, (urunMap.get(item.ad) ?? 0) + item.toplam);
    });
  });

  const kategoriMap = new Map<string, number>();
  products.forEach((product: any) => {
    const category = product.kategori || "Kategorisiz";
    kategoriMap.set(category, (kategoriMap.get(category) ?? 0) + product.satis * product.stok);
  });

  return {
    kpis: {
      gelir: totalRevenue,
      servis: totalRevenue,
      satis: 0,
      gider: totalExpenses,
      teslimEdilen: services.filter((item) => item.durum === "TESLIM_EDILDI").length,
      acikServis: services.filter((item) => item.durum !== "TESLIM_EDILDI").length,
    },
    markaDagilimi: Array.from(markaMap.entries()).map(([name, value]) => ({ name, value })),
    kategoriDagilimi: Array.from(kategoriMap.entries()).map(([name, value]) => ({ name, value })),
    urunDagilimi: Array.from(urunMap.entries()).map(([name, value]) => ({ name, value })),
    bakiyeDagilimi: [
      { name: "Borclu", value: customers.filter((item) => item.bakiye > 0).length },
      { name: "Alacakli", value: customers.filter((item) => item.bakiye < 0).length },
      { name: "Bakiyesiz", value: customers.filter((item) => item.bakiye === 0).length },
    ],
  };
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
