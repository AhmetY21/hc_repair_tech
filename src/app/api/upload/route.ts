import { NextResponse } from "next/server";
import sharp from "sharp";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadi" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(bytes).resize({ width: 1600 }).webp({ quality: 82 }).toBuffer();

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      message: "Supabase ayarlari bulunmadigi icin dosya mock modda optimize edildi.",
      size: optimized.byteLength,
    });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "otoservis-fotograflar";
  const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}.webp`;

  const { error } = await supabase.storage.from(bucket).upload(path, optimized, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ path, bucket });
}

export async function GET() {
  return NextResponse.json({
    message: "Bu endpoint servis fotografi upload islemleri icin hazir.",
  });
}
