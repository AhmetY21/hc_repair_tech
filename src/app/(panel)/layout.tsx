import { GlobalArama } from "@/components/global-arama";
import { Shortcuts } from "@/components/shortcuts";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getSidebarCounts } from "@/lib/data";
import { requireAuth } from "@/server/auth";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  const counts = await getSidebarCounts();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] lg:flex">
      <Shortcuts />
      <Sidebar counts={counts} />
      <div className="min-w-0 flex-1">
        <Topbar />
        <main className="space-y-6 px-4 py-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <GlobalArama />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
