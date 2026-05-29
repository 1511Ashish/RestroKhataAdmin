import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading,
  onConfirm,
  onClose,
  icon,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  icon?: ReactNode;
}) {
  return (
    <Dialog open={open} title={title} description={description} onClose={onClose}>
      <div className="flex items-center gap-3 rounded-2xl bg-secondary p-4">
        {icon}
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Please wait..." : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
