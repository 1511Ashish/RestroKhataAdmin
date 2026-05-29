import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <Card className="p-5 bg-secondary rounded-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="">
          <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
          <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">{value}</h3>
          {/* <p className="mt-2 text-sm text-muted-foreground">{hint}</p> */}
        </div>
        <div className="flex w-8 h-8 p-1.5 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>
      </div>
    </Card>
  );
}
