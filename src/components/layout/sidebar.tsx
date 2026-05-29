import { Building2, ChevronLeft, LayoutDashboard, Logs, ShieldCheck, UserCircle2, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tenants", label: "Tenants", icon: Building2 },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
  { to: "/activity", label: "Activity", icon: Logs },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onClose,
  onToggleCollapse,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-black/5 bg-white/85 px-4 py-5 backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-950/80",
          collapsed && "lg:w-24",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!collapsed ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">RestroKhata</p>
                <h1 className="text-lg font-semibold">Super Admin</h1>
              </div>
            ) : null}
          </div>
          <button type="button" className="rounded-full p-2 lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                    isActive && "bg-slate-900 text-white shadow-soft dark:bg-white dark:text-slate-950",
                    collapsed && "justify-center px-0",
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <Button variant="ghost" className="justify-start" onClick={onToggleCollapse}>
          <ChevronLeft className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
          {!collapsed ? "Collapse" : null}
        </Button>
      </aside>
    </>
  );
}
