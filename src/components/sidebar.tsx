"use client";

import Link from "next/link";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(() => navigation, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[var(--text-primary)] lg:hidden"
      >
        <PanelLeftOpen className="size-4" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/60 transition lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[320px] flex-col border-r border-[var(--border)] bg-[var(--bg-base)] p-4 transition duration-300 lg:static lg:z-auto lg:translate-x-0",
          collapsed ? "lg:w-[104px]" : "lg:w-[320px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className={cn("space-y-1", collapsed && "lg:hidden")}>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">H&C</p>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">OtoServis</h2>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hidden lg:inline-flex"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-3 py-3 transition",
                    active
                      ? "border-[var(--accent)] bg-[linear-gradient(135deg,rgba(225,29,46,0.15),rgba(225,29,46,0.03))] text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    {Icon ? <Icon className="size-4 shrink-0" /> : null}
                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </div>
                </Link>

                {!collapsed && item.children ? (
                  <div className="ml-3 space-y-1 border-l border-[var(--border)] pl-3">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          prefetch={false}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                            childActive
                              ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                              : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="flex items-center gap-2">
                            <ChevronRight className="size-3" />
                            {child.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-[var(--border)] pt-4">
          {!collapsed ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">Tek kullanici panel</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Telefon, tablet ve masaustu icin responsive calisir.
              </p>
            </div>
          ) : null}
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
