import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TenantTableSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden p-0">
          <div className="space-y-4 p-5">
            <Skeleton className="h-6 w-40 rounded-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Skeleton className="h-5 w-28 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-36 rounded-xl" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
