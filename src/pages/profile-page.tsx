import { Mail, ShieldCheck, User2 } from "lucide-react";
import { useGetProfileQuery } from "@/features/adminApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/format";

export default function ProfilePage() {
  const { data, isLoading, isError, refetch } = useGetProfileQuery();
  const profile = data?.data ?? data?.result ?? data?.profile ?? data?.admin ?? data?.user ?? data;

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Super admin identity, session metadata, and access context."
      />

      <Card className="max-w-3xl">
        {isError ? (
          <EmptyState
            title="Profile unavailable"
            description="The admin profile could not be loaded."
            action={<Button onClick={() => refetch()}>Retry</Button>}
          />
        ) : isLoading || !profile ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-3xl bg-secondary/70 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <User2 className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-secondary/70 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Role
                </div>
                <p className="text-lg font-semibold">{profile.role}</p>
              </div>
              <div className="rounded-3xl bg-secondary/70 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Last login
                </div>
                <p className="text-lg font-semibold">{profile.lastLoginAt ? formatDateTime(profile.lastLoginAt) : "No recent login"}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
