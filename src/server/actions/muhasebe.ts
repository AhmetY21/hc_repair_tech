"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const accountSchema = z.object({
  ad: z.string().min(3),
  tip: z.string().min(1),
  aciklama: z.string().optional(),
});

const expenseSchema = z.object({
  kategori: z.string().min(2),
  aciklama: z.string().min(3),
  tutar: z.string().min(1),
});

export async function saveAccountAction(formData: FormData) {
  accountSchema.parse({
    ad: formData.get("ad"),
    tip: formData.get("tip"),
    aciklama: formData.get("aciklama"),
  });

  revalidatePath("/muhasebe/kasalar");
}

export async function saveExpenseAction(formData: FormData) {
  expenseSchema.parse({
    kategori: formData.get("kategori"),
    aciklama: formData.get("aciklama"),
    tutar: formData.get("tutar"),
  });

  revalidatePath("/muhasebe/masraflar");
}
