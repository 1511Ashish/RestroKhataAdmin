import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/utils/cn";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((current) => !current)}
      />
      <div className={cn("flex min-h-screen flex-1 flex-col transition-all", collapsed ? "lg:pl-24" : "lg:pl-72")}>
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} triggerIcon={<Menu className="h-5 w-5" />} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
