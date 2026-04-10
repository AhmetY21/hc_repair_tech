import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-[var(--bg-elevated-2)] ${className}`} />;
}

export default function ServiceDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-10 w-64" />
        <SkeletonBlock className="h-5 w-48" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <SkeletonBlock className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <SkeletonBlock className="h-14 w-56" />
              <SkeletonBlock className="h-10 w-48" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-5 w-full" />
            </div>
            <SkeletonBlock className="h-28 w-full" />
            <div className="grid gap-3">
              <SkeletonBlock className="h-16 w-full" />
              <SkeletonBlock className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <SkeletonBlock className="h-7 w-36" />
            </CardHeader>
            <CardContent className="grid gap-3">
              <SkeletonBlock className="h-11 w-full" />
              <SkeletonBlock className="h-11 w-full" />
              <SkeletonBlock className="h-11 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SkeletonBlock className="h-7 w-28" />
            </CardHeader>
            <CardContent className="grid gap-3">
              <SkeletonBlock className="h-20 w-full" />
              <SkeletonBlock className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
