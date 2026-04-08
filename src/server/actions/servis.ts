"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  durum: z.string().min(1),
  altDurum: z.string().optional(),
  teknisyenId: z.string().optional(),
});

const paymentSchema = z.object({
  servisId: z.string().min(1),
  aciklama: z.string().min(3),
  tutar: z.string().min(1),
  kasa: z.string().min(1),
});

export async function createQuickIntakeAction(formData: FormData) {
  quickIntakeSchema.parse({
    plaka: formData.get("plaka"),
    telefon: formData.get("telefon"),
    isAciklamasi: formData.get("isAciklamasi"),
  });

  revalidatePath("/servis/hizli-kabul");
  revalidatePath("/servis/bugun");
}

export async function createServiceAction(formData: FormData) {
  serviceSchema.parse({
    plaka: formData.get("plaka"),
    musteriAdi: formData.get("musteriAdi"),
    telefon: formData.get("telefon"),
    talepler: formData.get("talepler"),
  });

  revalidatePath("/servis/kabul");
  revalidatePath("/servis/bugun");
}

export async function updateServiceStatusAction(formData: FormData) {
  statusSchema.parse({
    servisId: formData.get("servisId"),
    durum: formData.get("durum"),
    altDurum: formData.get("altDurum"),
    teknisyenId: formData.get("teknisyenId"),
  });

  revalidatePath("/servis/gecmis");
}

export async function addCollectionAction(formData: FormData) {
  paymentSchema.parse({
    servisId: formData.get("servisId"),
    aciklama: formData.get("aciklama"),
    tutar: formData.get("tutar"),
    kasa: formData.get("kasa"),
  });

  revalidatePath("/muhasebe/tahsilat");
}
