"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export function GlobalArama() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Arama istegi basarisiz oldu.");
        }

        const data = (await response.json()) as { items: SearchItem[] };
        setItems(data.items);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [open, query]);

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
          {!loading && items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 transition hover:border-[var(--accent)] hover:bg-[var(--bg-elevated-2)]"
            >
              <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
              <div className="text-sm text-[var(--text-secondary)]">{item.subtitle}</div>
            </Link>
          ))}
          {query.trim().length < 2 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              Aramak icin en az 2 karakter yazin.
            </div>
          ) : null}
          {loading ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              Araniyor...
            </div>
          ) : null}
          {!loading && query.trim().length >= 2 && !items.length ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              Eslesen kayit bulunamadi.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
