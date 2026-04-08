"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const musteriSchema = z.object({
  adSoyad: z.string().min(3),
  telefon: z.string().min(10),
  email: z.string().optional(),
  vergiTcNo: z.string().optional(),
  sehir: z.string().optional(),
  etiket: z.string().optional(),
  aciklama: z.string().optional(),
});

export async function saveCustomerAction(formData: FormData) {
  musteriSchema.parse({
    adSoyad: formData.get("adSoyad"),
    telefon: formData.get("telefon"),
    email: formData.get("email"),
    vergiTcNo: formData.get("vergiTcNo"),
    sehir: formData.get("sehir"),
    etiket: formData.get("etiket"),
    aciklama: formData.get("aciklama"),
  });

  revalidatePath("/musteriler");
}
