import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const activityItems = [
  "Subscription updates are logged here once backend audit events are connected.",
  "Tenant backup generations can be surfaced with export metadata and initiator identity.",
  "Unauthorized access attempts should be routed into this feed for security review.",
];

export default function ActivityPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Bonus"
        title="Activity logs"
        description="Reserved space for audit trails and administrative event history."
      />

      <Card>
        <div className="space-y-3">
          {activityItems.map((item) => (
            <div key={item} className="rounded-2xl bg-secondary/70 p-4 text-sm text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
