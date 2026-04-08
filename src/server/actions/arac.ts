"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const aracSchema = z.object({
  plaka: z.string().min(5),
  marka: z.string().optional(),
  model: z.string().optional(),
  seri: z.string().optional(),
  modelYili: z.string().optional(),
  yakitTipi: z.string().optional(),
  vitesTipi: z.string().optional(),
});

export async function saveVehicleAction(formData: FormData) {
  aracSchema.parse({
    plaka: formData.get("plaka"),
    marka: formData.get("marka"),
    model: formData.get("model"),
    seri: formData.get("seri"),
    modelYili: formData.get("modelYili"),
    yakitTipi: formData.get("yakitTipi"),
    vitesTipi: formData.get("vitesTipi"),
  });

  revalidatePath("/araclar");
}
