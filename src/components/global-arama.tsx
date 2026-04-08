"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export function GlobalArama({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const searchable = `${item.title} ${item.subtitle}`.toLocaleLowerCase("tr-TR");
        return searchable.includes(query.toLocaleLowerCase("tr-TR"));
      }),
    [items, query],
  );

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="justify-start">
        <Search className="size-4" />
        Global Arama
        <Badge className="ml-2 border-transparent bg-[var(--accent-soft)] text-[var(--accent)]">
          Ctrl+K
        </Badge>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-base)] p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Plaka, servis no veya musteri ara..."
            className="h-12"
          />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          {filtered.slice(0, 8).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 transition hover:border-[var(--accent)] hover:bg-[var(--bg-elevated-2)]"
            >
              <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
              <div className="text-sm text-[var(--text-secondary)]">{item.subtitle}</div>
            </Link>
          ))}
          {!filtered.length ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              Eslesen kayit bulunamadi.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
