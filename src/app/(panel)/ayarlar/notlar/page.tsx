import { FilePenLine } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getFirma } from "@/lib/data";
import { saveNotesAction } from "@/server/actions/ayarlar";

export default async function NotesSettingsPage() {
  const company = await getFirma();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ozellestirilmis Notlar"
        description="Servis kabul ve teslim formlarinda kullanilan sabit alt notlar."
      />

      <Card>
        <CardHeader><CardTitle>Form Notlari</CardTitle></CardHeader>
        <CardContent>
          <form action={saveNotesAction} className="space-y-4">
            <Textarea name="servisKabulNotu" defaultValue={company.servisKabulNotu} />
            <Textarea name="servisTeslimNotu" defaultValue={company.servisTeslimNotu} />
            <Button type="submit">
              <FilePenLine className="size-4" />
              Notlari Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
