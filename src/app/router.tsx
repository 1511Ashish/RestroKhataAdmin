import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { RouteError } from "@/components/ui/route-error";

const LoginPage = lazy(() => import("@/pages/login-page"));
const DashboardPage = lazy(() => import("@/pages/dashboard-page"));
const TenantsPage = lazy(() => import("@/pages/tenants-page"));
const ProfilePage = lazy(() => import("@/pages/profile-page"));
const ActivityPage = lazy(() => import("@/pages/activity-page"));

function withSuspense(node: JSX.Element) {
  return <Suspense fallback={<FullScreenLoader />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
    errorElement: <RouteError />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: withSuspense(<DashboardPage />) },
      { path: "tenants", element: withSuspense(<TenantsPage />) },
      { path: "profile", element: withSuspense(<ProfilePage />) },
      { path: "activity", element: withSuspense(<ActivityPage />) },
    ],
  },
]);
