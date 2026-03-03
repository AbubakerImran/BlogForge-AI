import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <Skeleton className="mb-4 h-5 w-28" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Skeleton className="mb-4 h-5 w-24" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  );
}
