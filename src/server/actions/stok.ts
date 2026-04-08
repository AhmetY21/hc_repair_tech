"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  ad: z.string().min(3),
  kod: z.string().min(2),
  kategori: z.string().min(2),
  satis: z.string().min(1),
  stok: z.string().min(1),
});

export async function saveProductAction(formData: FormData) {
  productSchema.parse({
    ad: formData.get("ad"),
    kod: formData.get("kod"),
    kategori: formData.get("kategori"),
    satis: formData.get("satis"),
    stok: formData.get("stok"),
  });

  revalidatePath("/stok/urunler");
}
