import { cn } from "@/lib/utils";

export function Plaka({ value, className }: { value: string; className?: string }) {
  const normalized = value.replace(/\s+/g, "").toUpperCase();

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-xl border border-zinc-300 bg-white font-mono text-black shadow-sm",
        className,
      )}
    >
      <div className="flex items-center bg-[#1D4ED8] px-2 text-xs font-semibold tracking-wide text-white">
        TR
      </div>
      <div className="px-3 py-2 text-base font-semibold tracking-[0.2em]">{normalized}</div>
    </div>
  );
}
