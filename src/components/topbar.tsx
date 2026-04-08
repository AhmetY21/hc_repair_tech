"use client";

import Link from "next/link";
import { LogOut, MessageCircleMore, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/actions/auth";

export function Topbar() {
  const pathname = usePathname();

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " "));

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(10,10,11,0.72)] px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 pl-12 lg:pl-0">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">H&C Servis</div>
          <div className="text-sm text-[var(--text-secondary)]">
            {crumbs.length ? crumbs.join(" / ") : "Ana sayfa"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/servis/hizli-kabul" prefetch={false}>
              <PlusCircle className="size-4" />
              Hizli Kabul
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <a
              href="https://wa.me/905555555555?text=Araciniz%20hakkinda%20bilgi%20vermeye%20haziriz."
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircleMore className="size-4" />
              Musteriye Bildir
            </a>
          </Button>
          <form action={logoutAction}>
            <Button variant="ghost" type="submit">
              <LogOut className="size-4" />
              Cikis Yap
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
