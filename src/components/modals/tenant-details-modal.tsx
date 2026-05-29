import { Building2, CalendarDays, Check, Download, MapPin, MessageCircle, PencilLine, Phone, Star, X } from "lucide-react";
import { TenantResponse } from "@/features/adminApi";
import { Button } from "@/components/ui/button";
import { formatDate, formatRelativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";

function getTenantId(tenant: TenantResponse) {
  return tenant.id ?? tenant._id ?? "N/A";
}

function getTenantImage(tenant: TenantResponse) {
  const image = tenant.image ?? tenant.logo ?? tenant.avatar;
  return typeof image === "string" ? image : "";
}

function getTenantPhone(tenant: TenantResponse) {
  const phone = tenant.phone ?? tenant.mobile ?? tenant.phoneNumber;
  return typeof phone === "string" ? phone : "";
}

function getTenantAddress(tenant: TenantResponse) {
  const address = tenant.address ?? tenant.location;
  return typeof address === "string" ? address : "";
}

function getTenantStoreLocation(tenant: TenantResponse) {
  const location = tenant.storeLocation;
  return typeof location === "string" ? location : "";
}

function getTenantCity(tenant: TenantResponse) {
  return typeof tenant.city === "string" ? tenant.city : "";
}

function getPlanOptions(tenant: TenantResponse) {
  const rawPlans = tenant.availablePlans;
  if (Array.isArray(rawPlans)) {
    return rawPlans.filter((plan): plan is string => typeof plan === "string");
  }

  const currentPlan = tenant.subscription?.plan;
  return currentPlan ? [currentPlan] : [];
}

function isTenantVerified(tenant: TenantResponse) {
  return tenant.isVerified === true || tenant.verified === true;
}

function hasWhatsapp(tenant: TenantResponse) {
  return tenant.whatsapp === true || typeof tenant.whatsapp === "string" || typeof tenant.whatsappNumber === "string";
}

function getTenantStatus(tenant: TenantResponse) {
  return tenant.subscription?.status === "ACTIVE" ? "Active" : tenant.subscription?.status ?? "Pending";
}

export function TenantDetailsModal({
  tenant,
  open,
  isDownloading,
  onClose,
  onEdit,
  onDownload,
}: {
  tenant: TenantResponse | null;
  open: boolean;
  isDownloading?: boolean;
  onClose: () => void;
  onEdit: (tenant: TenantResponse) => void;
  onDownload: (tenant: TenantResponse) => void;
}) {
  if (!open || !tenant) return null;

  const tenantId = getTenantId(tenant);
  const image = getTenantImage(tenant);
  const phone = getTenantPhone(tenant);
  const address = getTenantAddress(tenant);
  const storeLocation = getTenantStoreLocation(tenant);
  const city = getTenantCity(tenant);
  const planOptions = getPlanOptions(tenant);
  const currentPlan = tenant.subscription?.plan ?? "";
  const subscriptionEndDate = tenant.subscription?.expiresAt ? formatDate(tenant.subscription.expiresAt) : "Not set";
  const relativeUpdate = tenant.updatedAt ? formatRelativeTime(tenant.updatedAt) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm md:p-6">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-sky-200/70 bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_52%,#f6faff_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_55%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_50%)]" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-sky-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label="Close tenant details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative p-5 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="relative h-20 w-20 overflow-hidden rounded-[18px] border border-sky-200 bg-slate-900 shadow-sm">
              {image ? (
                <img src={image} alt={tenant.name ?? "Tenant"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold uppercase text-amber-300">
                  {(tenant.name ?? "T").charAt(0)}
                </div>
              )}
              <span className="absolute right-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-rose-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                <span>ID: {tenantId}</span>
                {relativeUpdate ? <span>Updated {relativeUpdate}</span> : null}
              </div>
              <h2 className="mt-1 text-3xl font-bold uppercase tracking-tight text-slate-800">{tenant.name ?? "Unnamed tenant"}</h2>
              {phone ? <p className="text-lg text-slate-500">{phone}</p> : null}
              {address ? <p className="mt-1 max-w-3xl text-base text-slate-500">{address}</p> : null}
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-slate-600 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{phone || "No phone"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-slate-400" />
              <span>{tenant.metrics?.orders ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold md:justify-self-end">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>{tenant.metrics?.staff ?? 0}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              {getTenantStatus(tenant)}
            </span>
            {isTenantVerified(tenant) ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                Verified
              </span>
            ) : null}
            {hasWhatsapp(tenant) ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                <MessageCircle className="h-4 w-4" />
                Whatsapp
              </span>
            ) : null}
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-2xl font-semibold text-slate-700">Subscription ended on - {subscriptionEndDate}</p>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Subscription plan</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {planOptions.length ? (
              planOptions.map((plan) => (
                <span
                  key={plan}
                  className={cn(
                    "inline-flex rounded-xl border px-4 py-2 text-sm font-semibold",
                    plan === currentPlan
                      ? "border-sky-300 bg-sky-50 text-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      : "border-slate-200 bg-white text-slate-500",
                  )}
                >
                  {plan}
                </span>
              ))
            ) : (
              <span className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500">
                No plan data
              </span>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[22px] border border-sky-200 bg-white/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Store location</p>
              <p className="mt-3 break-all text-xl font-semibold text-slate-700">
                {storeLocation || "No store location available"}
              </p>
            </div>

            <div className="rounded-[22px] border border-sky-200 bg-white/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">City</p>
              <div className="mt-3 flex items-start gap-2 text-xl font-semibold text-slate-700">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
                <span>{city || address || "No city available"}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={() => onEdit(tenant)}>
              <PencilLine className="h-4 w-4" />
              Edit Subscription
            </Button>
            <Button variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => onDownload(tenant)} disabled={isDownloading}>
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download Backup"}
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays className="h-4 w-4" />
            <span>Created {tenant.createdAt ? formatDate(tenant.createdAt) : "Unknown"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
