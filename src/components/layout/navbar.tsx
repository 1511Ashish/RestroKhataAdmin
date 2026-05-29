import { LogOut, Moon, Sun } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi, useGetProfileQuery } from "@/features/adminApi";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useAppDispatch } from "@/hooks/redux";

export function Navbar({
  onOpenSidebar,
  triggerIcon,
}: {
  onOpenSidebar: () => void;
  triggerIcon: ReactNode;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile } = useGetProfileQuery();
  const adminProfile = profile?.data ?? profile?.result ?? profile?.profile ?? profile?.admin ?? profile?.user ?? profile;
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    window.localStorage.removeItem("admin_token");
    dispatch(adminApi.util.resetApiState());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-background/70 backdrop-blur-xl dark:border-white/10">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card shadow-soft lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            {triggerIcon}
          </button>
          <div>
            {/* <p className="text-sm text-muted-foreground">Control center</p>
            <h2 className="text-lg font-semibold">Platform overview</h2> */}
          </div>
        </div>

        {/* <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="hidden rounded-2xl bg-card px-4 py-2 shadow-soft sm:block">
            <p className="text-sm font-medium">{adminProfile?.name ?? "Super Admin"}</p>
            <p className="text-xs text-muted-foreground">{adminProfile?.email ?? "admin@example.com"}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div> */}
      </div>
    </header>
  );
}
