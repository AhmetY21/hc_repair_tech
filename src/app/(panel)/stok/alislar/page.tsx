import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alislar"
        description="Tedarikci bazli alim modulu yol haritasinda V2 olarak ayrildi."
      />
      <EmptyState
        title="V2 planlandi"
        description="MVP'de stok kartlari ve servis icinden dusum akisi kuruldu. Detayli tedarikci alim modulu bir sonraki fazda acilacak."
      />
    </div>
  );
}
