import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { getAllServices, getCustomers, getProducts, getVehicles } from "@/lib/data";

export async function GET(
  _: Request,
  context: { params: Promise<{ resource: string }> },
) {
  const { resource } = await context.params;

  let data: unknown[] = [];

  switch (resource) {
    case "musteriler":
      data = await getCustomers();
      break;
    case "araclar":
      data = await getVehicles();
      break;
    case "servisler":
      data = await getAllServices();
      break;
    case "urunler":
      data = await getProducts();
      break;
    default:
      return NextResponse.json({ error: "Bilinmeyen export kaynagi" }, { status: 404 });
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, resource);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${resource}.xlsx"`,
    },
  });
}
