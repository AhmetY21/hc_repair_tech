import { NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";

import { getFirma, getServiceById } from "@/lib/data";
import { KabulFormuPdf } from "@/lib/pdf/kabul-formu";
import { TeslimFormuPdf } from "@/lib/pdf/teslim-formu";
import { formatCurrency } from "@/lib/tr";

export async function GET(
  _: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  const { type, id } = await context.params;
  const [company, service] = await Promise.all([getFirma(), getServiceById(id)]);

  if (!service) {
    return NextResponse.json({ error: "Servis bulunamadi" }, { status: 404 });
  }

  const document =
    type === "teslim"
      ? TeslimFormuPdf({
          company: {
            firmaAdi: company.firmaAdi,
            servisTeslimNotu: company.servisTeslimNotu,
          },
          service: {
            servisNo: service.servisNo,
            customerName: service.customer?.adSoyad ?? "",
            vehiclePlate: service.vehicle?.plaka ?? "",
            closingKm: String(service.kapanisKm ?? service.acilisKm ?? ""),
            closingFuel: String(service.kapanisYakitOrani ?? service.acilisYakitOrani ?? ""),
            total: formatCurrency(service.toplamKdvDahil),
            note: service.musteriyeNot ?? "",
          },
        })
      : KabulFormuPdf({
          company: {
            firmaAdi: company.firmaAdi,
            acikAdres: company.acikAdres,
            telefon: company.telefon,
            email: company.email,
            servisKabulNotu: company.servisKabulNotu,
          },
          service: {
            servisNo: service.servisNo,
            customerName: service.customer?.adSoyad ?? "",
            customerPhone: service.customer?.telefon ?? "",
            vehiclePlate: service.vehicle?.plaka ?? "",
            vehicleModel: `${service.vehicle?.marka ?? ""} ${service.vehicle?.model ?? ""}`.trim(),
            requests: service.musteriTalepleri ?? "",
            total: formatCurrency(service.toplamKdvDahil),
          },
        });

  const blob = await pdf(document).toBlob();

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${type}-${service.servisNo}.pdf"`,
    },
  });
}
