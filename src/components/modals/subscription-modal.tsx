import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SubscriptionPlan,
  SubscriptionStatus,
  TenantResponse,
  useUpdateSubscriptionMutation,
} from "@/features/adminApi";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const planOptions: SubscriptionPlan[] = ["TRIAL", "STARTER", "GROWTH", "ENTERPRISE"];
const statusOptions: SubscriptionStatus[] = ["ACTIVE", "SUSPENDED", "DELETED"];

export function SubscriptionModal({
  tenant,
  open,
  onClose,
}: {
  tenant: TenantResponse | null;
  open: boolean;
  onClose: () => void;
}) {
  const [updateSubscription, { isLoading }] = useUpdateSubscriptionMutation();
  const [plan, setPlan] = useState<SubscriptionPlan>("STARTER");
  const [status, setStatus] = useState<SubscriptionStatus>("ACTIVE");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    if (!tenant) return;
    setPlan(tenant.subscription?.plan ?? "STARTER");
    setStatus(tenant.subscription?.status ?? "ACTIVE");
    setExpiresAt(tenant.subscription?.expiresAt?.slice(0, 10) ?? "");
  }, [tenant]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tenant) return;
    const tenantId = tenant.id ?? tenant._id;
    if (!tenantId) return;

    await updateSubscription({
      tenantId,
      plan,
      status,
      expiresAt: new Date(expiresAt).toISOString(),
    }).unwrap();

    toast.success("Subscription updated", {
      description: `${tenant.name ?? "Tenant"} is now on the ${plan} plan.`,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit subscription"
      description={tenant ? `Update billing access for ${tenant.name ?? "this tenant"}.` : undefined}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Plan</label>
          <Select value={plan} onChange={(event) => setPlan(event.target.value as SubscriptionPlan)}>
            {planOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onChange={(event) => setStatus(event.target.value as SubscriptionStatus)}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Expiry date</label>
          <Input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} required />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
