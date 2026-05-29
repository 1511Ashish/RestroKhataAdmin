import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border-0 bg-secondary px-3 text-sm text-foreground shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-ring",
        className,
      )}
      {...props}
    />
  ),
);

Select.displayName = "Select";
