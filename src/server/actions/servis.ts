"use server";

import {
  MusteriTipi,
  Prisma,
  ServisAltDurumu,
  ServisDurumu,
  TahsilatKaynak,
  VitesTipi,
  YakitTipi,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/server/db";

const quickIntakeSchema = z.object({
  plaka: z.string().min(5),
  telefon: z.string().min(10),
  isAciklamasi: z.string().min(5),
});

const serviceSchema = z.object({
  plaka: z.string().min(5),
  musteriAdi: z.string().min(3),
  telefon: z.string().min(10),
  talepler: z.string().min(5),
});

const statusSchema = z.object({
  servisId: z.string().min(1),
  durum: z.nativeEnum(ServisDurumu),
  altDurum: z.nativeEnum(ServisAltDurumu).optional(),
  teknisyenId: z.string().optional(),
});

const paymentSchema = z.object({
  servisId: z.string().min(1),
  aciklama: z.string().min(3),
  tutar: z.string().min(1),
  kasa: z.string().min(1),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function normalizePlate(value: string) {
  return value.toLocaleUpperCase("tr-TR").replace(/\s+/g, "");
}

function parseOptionalInt(value: string) {
  if (!value) return null;
  const normalized = Number(value.replace(/[^\d-]/g, ""));
  return Number.isFinite(normalized) ? normalized : null;
}

function parseMoney(value: string) {
  const normalized = Number(value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(normalized)) {
    throw new Error("Gecersiz tutar.");
  }
  return normalized;
}

function splitCustomerName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return {
      ad: parts[0] || "Musteri",
      soyad: null as string | null,
    };
  }

  return {
    ad: parts.slice(0, -1).join(" "),
    soyad: parts.at(-1) ?? null,
  };
}

function mapFuelType(value: string | null) {
  switch (value) {
    case "Benzin":
      return YakitTipi.BENZIN;
    case "Dizel":
      return YakitTipi.DIZEL;
    case "LPG":
      return YakitTipi.LPG;
    case "Elektrik":
      return YakitTipi.ELEKTRIK;
    case "Hibrit":
      return YakitTipi.HIBRIT;
    default:
      return null;
  }
}

function mapTransmissionType(value: string | null) {
  switch (value) {
    case "Manuel":
      return VitesTipi.MANUEL;
    case "Otomatik":
      return VitesTipi.OTOMATIK;
    default:
      return null;
  }
}

async function generateCustomerCode(tx: Prisma.TransactionClient) {
  const latest = await tx.musteri.findFirst({
    where: {
      musteriKodu: {
        startsWith: "MUS-",
      },
    },
    orderBy: { createdAt: "desc" },
    select: { musteriKodu: true },
  });

  const lastNumber = latest?.musteriKodu.match(/MUS-(\d+)/)?.[1];
  const nextNumber = (lastNumber ? Number(lastNumber) : 0) + 1;
  return `MUS-${String(nextNumber).padStart(4, "0")}`;
}

async function generateServiceNo(tx: Prisma.TransactionClient) {
  const prefix = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const latest = await tx.servis.findFirst({
    where: {
      servisNo: {
        startsWith: prefix,
      },
    },
    orderBy: { createdAt: "desc" },
    select: { servisNo: true },
  });

  const lastNumber = latest?.servisNo.slice(prefix.length);
  const nextNumber = (lastNumber ? Number(lastNumber) : 0) + 1;
  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

async function findCustomerByPhone(tx: Prisma.TransactionClient, phone: string) {
  const candidates = await tx.musteri.findMany({
    where: {
      deletedAt: null,
      telefon: {
        not: null,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return candidates.find((candidate) => normalizePhone(candidate.telefon ?? "") === phone) ?? null;
}

async function upsertCustomerAndVehicle(
  tx: Prisma.TransactionClient,
  input: {
    plaka: string;
    musteriAdi: string;
    telefon: string;
    email?: string | null;
    vergiTcNo?: string | null;
    adres?: string | null;
    sasiNo?: string | null;
    marka?: string | null;
    seri?: string | null;
    model?: string | null;
    modelYili?: number | null;
    yakitTipi?: YakitTipi | null;
    vitesTipi?: VitesTipi | null;
  },
) {
  const normalizedPlate = normalizePlate(input.plaka);
  const normalizedPhone = normalizePhone(input.telefon);
  const { ad, soyad } = splitCustomerName(input.musteriAdi);

  const existingVehicle = await tx.arac.findUnique({
    where: { plaka: normalizedPlate },
    include: { musteri: true },
  });

  const existingCustomer =
    existingVehicle?.musteri ??
    (normalizedPhone ? await findCustomerByPhone(tx, normalizedPhone) : null);

  const customer =
    existingCustomer
      ? await tx.musteri.update({
          where: { id: existingCustomer.id },
          data: {
            ad,
            soyad,
            telefon: normalizedPhone || input.telefon,
            email: input.email,
            vergiTcNo: input.vergiTcNo,
            adres: input.adres,
          },
        })
      : await tx.musteri.create({
          data: {
            musteriKodu: await generateCustomerCode(tx),
            tip: MusteriTipi.BIREYSEL,
            ad,
            soyad,
            telefon: normalizedPhone || input.telefon,
            email: input.email,
            vergiTcNo: input.vergiTcNo,
            adres: input.adres,
          },
        });

  const vehicle =
    existingVehicle
      ? await tx.arac.update({
          where: { id: existingVehicle.id },
          data: {
            musteriId: customer.id,
            plaka: normalizedPlate,
            sasiNo: input.sasiNo,
            marka: input.marka,
            seri: input.seri,
            model: input.model,
            modelYili: input.modelYili,
            yakitTipi: input.yakitTipi,
            vitesTipi: input.vitesTipi,
          },
        })
      : await tx.arac.create({
          data: {
            musteriId: customer.id,
            plaka: normalizedPlate,
            sasiNo: input.sasiNo,
            marka: input.marka,
            seri: input.seri,
            model: input.model,
            modelYili: input.modelYili,
            yakitTipi: input.yakitTipi,
            vitesTipi: input.vitesTipi,
          },
        });

  return { customer, vehicle };
}

function revalidateServicePaths(serviceId?: string) {
  revalidatePath("/ana-sayfa");
  revalidatePath("/musteriler");
  revalidatePath("/araclar");
  revalidatePath("/servis");
  revalidatePath("/servis/bugun");
  revalidatePath("/servis/gecmis");
  revalidatePath("/servis/kabul");
  revalidatePath("/servis/hizli-kabul");
  revalidatePath("/muhasebe/tahsilat");

  if (serviceId) {
    revalidatePath(`/servis/${serviceId}`);
    revalidatePath(`/servis/${serviceId}/islemler`);
    revalidatePath(`/servis/${serviceId}/kabul-formu`);
    revalidatePath(`/servis/${serviceId}/teslim-formu`);
  }
}

export async function createQuickIntakeAction(formData: FormData) {
  const parsed = quickIntakeSchema.parse({
    plaka: getString(formData, "plaka"),
    telefon: getString(formData, "telefon"),
    isAciklamasi: getString(formData, "isAciklamasi"),
  });

  const service = await db.$transaction(async (tx) => {
    const { customer, vehicle } = await upsertCustomerAndVehicle(tx, {
      plaka: parsed.plaka,
      musteriAdi: "Yeni Musteri",
      telefon: parsed.telefon,
    });

    const createdService = await tx.servis.create({
      data: {
        servisNo: await generateServiceNo(tx),
        durum: ServisDurumu.SERVISE_ALINIYOR,
        musteriId: customer.id,
        aracId: vehicle.id,
        musteriTalepleri: parsed.isAciklamasi,
        servisDanismani: process.env.ADMIN_USERNAME ?? "kivanc",
      },
    });

    await tx.servisDurumGecmisi.create({
      data: {
        servisId: createdService.id,
        yeniDurum: ServisDurumu.SERVISE_ALINIYOR,
        aciklama: "Hizli kabul ile servis kaydi olusturuldu.",
        yapan: process.env.ADMIN_USERNAME ?? "kivanc",
      },
    });

    return createdService;
  });

  revalidateServicePaths(service.id);
  redirect(`/servis/${service.id}`);
}

export async function createServiceAction(formData: FormData) {
  const parsed = serviceSchema.parse({
    plaka: getString(formData, "plaka"),
    musteriAdi: getString(formData, "musteriAdi"),
    telefon: getString(formData, "telefon"),
    talepler: getString(formData, "talepler"),
  });

  const service = await db.$transaction(async (tx) => {
    const { customer, vehicle } = await upsertCustomerAndVehicle(tx, {
      plaka: parsed.plaka,
      musteriAdi: parsed.musteriAdi,
      telefon: parsed.telefon,
      email: getOptionalString(formData, "email"),
      vergiTcNo: getOptionalString(formData, "vergiTcNo"),
      adres: getOptionalString(formData, "adres"),
      sasiNo: getOptionalString(formData, "sasiNo"),
      marka: getOptionalString(formData, "marka"),
      seri: getOptionalString(formData, "seri"),
      model: getOptionalString(formData, "model"),
      modelYili: parseOptionalInt(getString(formData, "modelYili")),
      yakitTipi: mapFuelType(getOptionalString(formData, "yakitTipi")),
      vitesTipi: mapTransmissionType(getOptionalString(formData, "vitesTipi")),
    });

    const createdService = await tx.servis.create({
      data: {
        servisNo: await generateServiceNo(tx),
        durum: ServisDurumu.SERVISE_ALINIYOR,
        musteriId: customer.id,
        aracId: vehicle.id,
        servisDanismani: process.env.ADMIN_USERNAME ?? "kivanc",
        araciGetiren: getOptionalString(formData, "araciGetiren"),
        acilisKm: parseOptionalInt(getString(formData, "acilisKm")),
        acilisYakitOrani: parseOptionalInt(getString(formData, "acilisYakitOrani")),
        musteriTalepleri: parsed.talepler,
        musteriyeNot: getOptionalString(formData, "musteriyeNot"),
      },
    });

    await tx.servisDurumGecmisi.create({
      data: {
        servisId: createdService.id,
        yeniDurum: ServisDurumu.SERVISE_ALINIYOR,
        aciklama: "Klasik servis kabul formu ile kayit olusturuldu.",
        yapan: process.env.ADMIN_USERNAME ?? "kivanc",
      },
    });

    return createdService;
  });

  revalidateServicePaths(service.id);
  redirect(`/servis/${service.id}`);
}

export async function updateServiceStatusAction(formData: FormData) {
  const parsed = statusSchema.parse({
    servisId: getString(formData, "servisId"),
    durum: getString(formData, "durum"),
    altDurum: getString(formData, "altDurum") || undefined,
    teknisyenId: getString(formData, "teknisyenId") || undefined,
  });

  await db.$transaction(async (tx) => {
    const currentService = await tx.servis.findUnique({
      where: { id: parsed.servisId },
      select: { durum: true },
    });

    await tx.servis.update({
      where: { id: parsed.servisId },
      data: {
        durum: parsed.durum,
        altDurum: parsed.altDurum ?? null,
        teknisyenId: parsed.teknisyenId || null,
        teslimTarihi:
          parsed.durum === ServisDurumu.TESLIM_EDILDI ? new Date() : undefined,
      },
    });

    await tx.servisDurumGecmisi.create({
      data: {
        servisId: parsed.servisId,
        eskiDurum: currentService?.durum,
        yeniDurum: parsed.durum,
        altDurum: parsed.altDurum ?? null,
        aciklama: "Durum servis islemleri ekranindan guncellendi.",
        yapan: process.env.ADMIN_USERNAME ?? "kivanc",
      },
    });
  });

  revalidateServicePaths(parsed.servisId);
}

export async function addCollectionAction(formData: FormData) {
  const parsed = paymentSchema.parse({
    servisId: getString(formData, "servisId"),
    aciklama: getString(formData, "aciklama"),
    tutar: getString(formData, "tutar"),
    kasa: getString(formData, "kasa"),
  });

  await db.$transaction(async (tx) => {
    const service = await tx.servis.findUnique({
      where: { id: parsed.servisId },
      select: { id: true, musteriId: true },
    });

    if (!service) {
      throw new Error("Servis kaydi bulunamadi.");
    }

    const account = await tx.kasa.findFirst({
      where: { ad: parsed.kasa },
      select: { id: true },
    });

    if (!account) {
      throw new Error("Tahsilat hesabi bulunamadi.");
    }

    const amount = parseMoney(parsed.tutar);

    await tx.tahsilat.create({
      data: {
        servisId: service.id,
        musteriId: service.musteriId,
        kasaId: account.id,
        kaynak: TahsilatKaynak.SERVIS,
        aciklama: parsed.aciklama,
        tutar: amount,
      },
    });

    await tx.kasaHareketi.create({
      data: {
        kasaId: account.id,
        tip: "TAHSILAT",
        referansId: service.id,
        aciklama: parsed.aciklama,
        tutar: amount,
      },
    });
  });

  revalidateServicePaths(parsed.servisId);
}
