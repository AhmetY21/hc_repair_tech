import { LockKeyhole, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/server/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.hata === "1";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,46,0.24),transparent_35%)]" />
      <Card className="relative w-full max-w-md">
        <CardHeader className="flex-col items-start">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">H&C Otomotiv</p>
          <div className="space-y-2">
            <CardTitle className="text-3xl">Panel Girisi</CardTitle>
            <CardDescription>
              Tek kullanicili panel. Kullanici adi ve sifrenizle devam edin.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)]">Kullanici Adi</label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <Input name="kullaniciAdi" placeholder="kivanc" className="pl-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)]">Sifre</label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <Input name="sifre" type="password" placeholder="******" className="pl-11" required />
              </div>
            </div>
            {hasError ? (
              <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-rose-200">
                Giris basarisiz. Kullanici adi veya sifre hatali.
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              Giris Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
