"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const firmaSchema = z.object({
  firmaAdi: z.string().min(2),
  telefon: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  vergiNo: z.string().optional(),
  vergiDairesi: z.string().optional(),
  iban: z.string().optional(),
  acikAdres: z.string().optional(),
});

const notlarSchema = z.object({
  servisKabulNotu: z.string().optional(),
  servisTeslimNotu: z.string().optional(),
});

const markalarSchema = z.object({
  kategoriler: z.string().optional(),
  haricMarkalar: z.string().optional(),
});

const teknisyenSchema = z.object({
  adSoyad: z.string().min(3),
  telefon: z.string().optional(),
  uzmanlik: z.string().optional(),
});

export async function saveFirmaAction(formData: FormData) {
  firmaSchema.parse({
    firmaAdi: formData.get("firmaAdi"),
    telefon: formData.get("telefon"),
    email: formData.get("email"),
    website: formData.get("website"),
    vergiNo: formData.get("vergiNo"),
    vergiDairesi: formData.get("vergiDairesi"),
    iban: formData.get("iban"),
    acikAdres: formData.get("acikAdres"),
  });

  revalidatePath("/ayarlar/firma");
}

export async function saveNotesAction(formData: FormData) {
  notlarSchema.parse({
    servisKabulNotu: formData.get("servisKabulNotu"),
    servisTeslimNotu: formData.get("servisTeslimNotu"),
  });

  revalidatePath("/ayarlar/notlar");
}

export async function saveBrandsAction(formData: FormData) {
  markalarSchema.parse({
    kategoriler: formData.get("kategoriler"),
    haricMarkalar: formData.get("haricMarkalar"),
  });

  revalidatePath("/ayarlar/markalar");
}

export async function saveTechnicianAction(formData: FormData) {
  teknisyenSchema.parse({
    adSoyad: formData.get("adSoyad"),
    telefon: formData.get("telefon"),
    uzmanlik: formData.get("uzmanlik"),
  });

  revalidatePath("/ayarlar/teknisyenler");
}
