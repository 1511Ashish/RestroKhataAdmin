import { Building2, FileText, ReceiptText, Users } from "lucide-react";
import { useGetDashboardStatsQuery } from "@/features/adminApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import type { DashboardStatsResponse, TenantResponse } from "@/features/adminApi";
import { formatCompactNumber, formatRelativeTime } from "@/utils/format";

function getDashboardPayload(data?: DashboardStatsResponse): DashboardStatsResponse | undefined {
  return data?.data ?? data?.result ?? data?.dashboard ?? data;
}

function getRecentTenants(payload?: DashboardStatsResponse): TenantResponse[] {
  return payload?.recentTenants ?? payload?.recent_tenants ?? payload?.latestTenants ?? [];
}

function getTenantContactNumber(tenant: TenantResponse) {
  const contact = tenant.contactNumber ?? tenant.phone ?? tenant.mobile;
  return typeof contact === "string" || typeof contact === "number"
    ? String(contact)
    : "No contact number available";
}

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery();
  const payload = getDashboardPayload(data);
  const recentTenants = getRecentTenants(payload);
  const totalTenants = payload?.totals?.tenants ?? payload?.summary?.totalTenants ?? payload?.totalTenants ?? payload?.tenants ?? 0;
  const totalUsers = payload?.totals?.users ?? payload?.summary?.totalUsers ?? payload?.totalUsers ?? payload?.users ?? 0;
  const totalOrders = payload?.totals?.orders ?? payload?.summary?.totalOrders ?? payload?.totalOrders ?? payload?.orders ?? 0;
  const totalInvoices = payload?.totals?.invoices ?? payload?.summary?.totalInvoices ?? payload?.totalInvoices ?? payload?.invoices ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        // description="A clean snapshot of platform activity, adoption, and tenant growth."
      />

      {isError ? (
        <EmptyState
          title="Dashboard unavailable"
          description="We could not load platform metrics right now."
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-40 rounded-3xl" />)
            ) : (
              <>
                <StatCard
                  label="Total tenants"
                  value={formatCompactNumber(totalTenants)}
                  hint="All active workspaces"
                  icon={<Building2 className="h-6 w-6" />}
                />
                <StatCard
                  label="Total users"
                  value={formatCompactNumber(totalUsers)}
                  hint="Accounts across tenants"
                  icon={<Users className="h-6 w-6" />}
                />
                <StatCard
                  label="Total orders"
                  value={formatCompactNumber(totalOrders)}
                  hint="Orders processed"
                  icon={<ReceiptText className="h-6 w-6" />}
                />
                <StatCard
                  label="Total invoices"
                  value={formatCompactNumber(totalInvoices)}
                  hint="Invoices generated"
                  icon={<FileText className="h-6 w-6" />}
                />
              </>
            )}
          </div>

          <Card className="mt-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Recent tenants</h2>
                {/* <p className="text-sm text-muted-foreground">Latest onboarded workspaces and their last activity.</p> */}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentTenants.length ? recentTenants.map((tenant) => (
                  <div
                    key={tenant.id ?? tenant._id ?? tenant.name}
                    className="flex flex-col justify-between gap-3 rounded-2xl bg-secondary/70 p-4 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTenantContactNumber(tenant)}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last login: {tenant.updatedAt ? formatRelativeTime(tenant.updatedAt) : "No recent login"}
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl bg-secondary/70 p-4 text-sm text-muted-foreground">
                    No recent tenants available.
                  </div>
                )}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
