import { Navigate, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "@/features/adminApi";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const { data, isLoading, isFetching, isError } = useGetProfileQuery();
  const profile = data?.data ?? data?.result ?? data?.profile ?? data?.admin ?? data?.user ?? data;

  if (isLoading || isFetching) {
    return <FullScreenLoader />;
  }

  if (isError || !profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
