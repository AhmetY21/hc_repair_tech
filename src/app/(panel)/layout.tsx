import { Shortcuts } from "@/components/shortcuts";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { requireAuth } from "@/server/auth";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] lg:flex">
      <Shortcuts />
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <main className="space-y-6 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
