import { memo } from "react";
import { CalendarDays, Phone, ReceiptText } from "lucide-react";
import { TenantResponse } from "@/features/adminApi";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";

interface TenantTableProps {
  tenants: TenantResponse[];
  selectedTenantId?: string | null;
  onSelect: (tenant: TenantResponse) => void;
}

const TenantRow = memo(function TenantRow({
  tenant,
  selectedTenantId,
  onSelect,
}: {
  tenant: TenantResponse;
  selectedTenantId?: string | null;
  onSelect: (tenant: TenantResponse) => void;
}) {
  const tenantId = tenant.id ?? tenant._id ?? "";
  const name = tenant.name ?? "No Name";
  const phoneRaw =
  tenant.phone ??
  tenant.mobile ??
  tenant.phoneNumber ??
  tenant.contactNumber ??
  tenant.ownerUserId?.email;

  const phone: string = typeof phoneRaw === "string" ? phoneRaw : "No contact";

  const plan = tenant.subscription?.plan ?? "TRIAL";
  const status: string =
  tenant?.status === "ACTIVE"
    ? "Active"
    : typeof tenant?.status === "string"
    ? tenant.status
    : "Pending";
  const updatedAt = tenant.updatedAt ?? tenant.lastLoginAt ?? tenant.lastLogin;
  const avatarLetter = name.charAt(0).toUpperCase();
  const isSelected = selectedTenantId === tenantId;

  console.log("tenant", tenant)

  return (
    <button
      type="button"
      onClick={() => onSelect(tenant)}
      className={cn(
        "group relative flex w-full items-center gap-3 overflow-hidden rounded-[18px] border border-sky-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)]",
        isSelected && "border-sky-400 shadow-[0_16px_36px_rgba(59,130,246,0.16)]",
      )}
    >
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-sky-200 bg-slate-50 text-3xl font-bold uppercase text-blue-500">
        {avatarLetter}
        {/* <span className="absolute right-1 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-rose-500" /> */}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* <p className="text-sm text-slate-500">ID: {tenantId || "N/A"}</p> */}
            <h3 className="truncate text-sm font-bold uppercase tracking-tight text-slate-900">{name}</h3>
          </div>
          <span className="inline-flex shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
            {status}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-500">
          <span className="inline-flex items-center text-[12px] gap-1">
            <Phone className="h-3 w-3" />
            {phone}
          </span>
          <span className="inline-flex items-center text-[12px] gap-1">
            <ReceiptText className="h-3 w-3" />
            {plan}
          </span>
          {updatedAt ? (
            <span className="inline-flex items-center text-[12px] gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatRelativeTime(tenant?.lastLoginAt)}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
});

export function TenantTable({ tenants, selectedTenantId, onSelect }: TenantTableProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      {tenants.map((tenant) => (
        <TenantRow
          key={tenant.id ?? tenant._id ?? tenant.name}
          tenant={tenant}
          selectedTenantId={selectedTenantId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
