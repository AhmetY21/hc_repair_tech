import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">404</p>
        <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Kayit bulunamadi</h1>
        <p className="text-[var(--text-secondary)]">Istenen sayfa veya servis kaydi mevcut degil.</p>
        <Button asChild>
          <Link href="/ana-sayfa">Ana sayfaya don</Link>
        </Button>
      </div>
    </main>
  );
}
