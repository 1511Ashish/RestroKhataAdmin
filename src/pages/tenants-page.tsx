import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Download, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { SubscriptionModal } from "@/components/modals/subscription-modal";
import { TenantDetailsModal } from "@/components/modals/tenant-details-modal";
import { TenantTable } from "@/components/tables/tenant-table";
import { TenantTableSkeleton } from "@/components/tables/tenant-table-skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { TenantResponse, TenantsResponse, useGetTenantsQuery, useLazyGetTenantBackupQuery } from "@/features/adminApi";
import { downloadBlob } from "@/utils/download";

const PAGE_SIZE = 8;

function getTenantsList(data?: TenantsResponse): TenantResponse[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.data ?? data.result ?? data.tenants ?? [];
}

export default function TenantsPage() {
  const { data, isLoading, isError, refetch } = useGetTenantsQuery();
  const [triggerBackup] = useLazyGetTenantBackupQuery();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<TenantResponse | null>(null);
  const [detailTenant, setDetailTenant] = useState<TenantResponse | null>(null);
  const [backupTenant, setBackupTenant] = useState<TenantResponse | null>(null);
  const [busyTenantId, setBusyTenantId] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 350);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const tenants = getTenantsList(data);

  const filteredTenants = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    return [...tenants]
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .filter((tenant) => {
        if (!normalized) return true;
        return (
          (tenant.name ?? "").toLowerCase().includes(normalized) ||
          (tenant.owner?.email ?? tenant.ownerUserId?.email ?? tenant.email ?? "").toLowerCase().includes(normalized) ||
          (tenant.owner?.name ?? tenant.ownerUserId?.name ?? tenant.ownerName ?? "").toLowerCase().includes(normalized)
        );
      });
  }, [deferredQuery, tenants]);

  const totalPages = Math.max(1, Math.ceil(filteredTenants.length / PAGE_SIZE));
  const paginatedTenants = filteredTenants.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const exportCsv = () => {
    const rows = [
      ["Name", "Owner", "Email", "Plan", "Status", "Expiry Date"],
      ...filteredTenants.map((tenant) => [
        tenant.name ?? "",
        tenant.owner?.name ?? tenant.ownerUserId?.name ?? tenant.ownerName ?? "",
        tenant.owner?.email ?? tenant.ownerUserId?.email ?? tenant.email ?? "",
        tenant.subscription?.plan ?? "",
        tenant.subscription?.status ?? "",
        tenant.subscription?.expiresAt ?? "",
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    downloadBlob(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), "tenants.csv");
  };

  const handleBackupDownload = async () => {
    if (!backupTenant) return;
    const backupTenantId = backupTenant.id ?? backupTenant._id;
    const backupTenantName = backupTenant.name ?? "tenant";
    if (!backupTenantId) return;

    setBusyTenantId(backupTenantId);
    try {
      const blob = await triggerBackup(backupTenantId).unwrap();
      downloadBlob(blob, `${backupTenantName.toLowerCase().replace(/\s+/g, "-")}-backup.zip`);
      toast.success("Backup ready", {
        description: `${backupTenantName} backup downloaded successfully.`,
      });
      setBackupTenant(null);
    } finally {
      setBusyTenantId(null);
    }
  };

  const handleOpenEdit = (tenant: TenantResponse) => {
    setSelectedTenant(tenant);
    setDetailTenant(null);
  };

  const handleOpenBackup = (tenant: TenantResponse) => {
    setBackupTenant(tenant);
  };

  return (
    <div>
      {/* <PageHeader
        eyebrow="Tenants"
        title="Tenant management"
        description="Search, review usage, adjust subscriptions, and download backups without leaving the control plane."
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </>
        }
      /> */}

      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* <div className="relative max-w-md flex-1 ">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by tenant, owner, or email"
            className="pl-10"
          />
        </div> */}
        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Sorted by newest tenant first
        </div> */}
      </Card>

      {isError ? (
        <EmptyState
          title="Unable to load tenants"
          description="The tenant directory request failed. Retry to refresh the latest data."
          action={
            <Button onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : isLoading ? (
        <TenantTableSkeleton />
      ) : paginatedTenants.length ? (
        <>
          <TenantTable
            tenants={paginatedTenants}
            selectedTenantId={detailTenant?.id ?? detailTenant?._id ?? null}
            onSelect={setDetailTenant}
          />
          {/* <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedTenants.length} of {filteredTenants.length} tenants
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div> */}
        </>
      ) : (
        <EmptyState
          title="No tenants found"
          description="Try a different search term or clear your filters to see more results."
        />
      )}

      <TenantDetailsModal
        tenant={detailTenant}
        open={Boolean(detailTenant)}
        isDownloading={busyTenantId === (detailTenant?.id ?? detailTenant?._id)}
        onClose={() => setDetailTenant(null)}
        onEdit={handleOpenEdit}
        onDownload={handleOpenBackup}
      />

      <SubscriptionModal tenant={selectedTenant} open={Boolean(selectedTenant)} onClose={() => setSelectedTenant(null)} />

      <ConfirmDialog
        open={Boolean(backupTenant)}
        title="Download tenant backup"
        description={
          backupTenant
            ? `Generate and download a backup for ${backupTenant.name ?? "this tenant"}. This may include operational data and invoices.`
            : ""
        }
        confirmLabel="Download backup"
        icon={<AlertTriangle className="h-5 w-5 text-warning" />}
        isLoading={busyTenantId === (backupTenant?.id ?? backupTenant?._id)}
        onConfirm={handleBackupDownload}
        onClose={() => setBackupTenant(null)}
      />
    </div>
  );
}
