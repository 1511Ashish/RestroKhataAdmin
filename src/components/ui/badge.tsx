import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { SubscriptionStatus } from "@/features/adminApi";

const statusClasses: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-success/15 text-success",
  SUSPENDED: "bg-warning/15 text-warning",
  DELETED: "bg-danger/15 text-danger",
};

export function StatusBadge({
  status,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { status: SubscriptionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        statusClasses[status],
        className,
      )}
      {...props}
    >
      {status}
    </span>
  );
}
