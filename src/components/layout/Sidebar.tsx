"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, ShoppingCart, FileText, BarChart3,
  Shield, TrendingUp, Settings, ChevronLeft, ChevronRight,
  Building2, ClipboardList, PackageCheck, Workflow,
  Receipt, Star, Database, LogOut, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { Avatar } from "@/components/ui";
import { toast } from "sonner";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { href: "/analytics",       label: "Spend Analytics",     icon: TrendingUp },
    ],
  },
  {
    label: "Supplier Management",
    items: [
      { href: "/suppliers",       label: "Suppliers",           icon: Users },
      { href: "/vendor-master",   label: "Vendor Master (BC)",  icon: Database },
      { href: "/performance",     label: "Performance",         icon: Star },
      { href: "/risk",            label: "Risk & Compliance",   icon: Shield },
    ],
  },
  {
    label: "Procurement",
    items: [
      { href: "/rfq",             label: "RFQ Management",      icon: ClipboardList },
      { href: "/purchase-orders", label: "Purchase Orders",     icon: ShoppingCart },
      { href: "/contracts",       label: "Contracts",           icon: FileText },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/invoices",        label: "Invoices & Payments", icon: Receipt },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/workflow",        label: "Workflow Automation",  icon: Workflow },
      { href: "/reports",         label: "Reports",             icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
      sidebarOpen ? "w-60" : "w-16"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-white/10 px-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">S</div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">SRM Portal</p>
              <p className="text-[10px] text-white/50 truncate">Dynamics 365 BC</p>
            </div>
          )}
        </div>
        <button onClick={toggleSidebar} className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-white/10 transition-colors">
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {sidebarOpen && (
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">{group.label}</p>
            )}
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className={cn(
                    "flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                    active ? "bg-primary text-white font-medium" : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                  title={!sidebarOpen ? label : undefined}>
                  <Icon size={17} className="shrink-0" />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-3 shrink-0 space-y-1">
        <Link href="/settings"
          className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors", pathname === "/settings" ? "bg-primary text-white" : "text-white/60 hover:bg-white/10 hover:text-white")}
          title={!sidebarOpen ? "Settings" : undefined}>
          <Settings size={17} className="shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </Link>

        {sidebarOpen && user && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
            <Avatar name={user.name} size="sm" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors" title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        )}

        {!sidebarOpen && (
          <button onClick={handleLogout} className="flex items-center gap-3 mx-0 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full" title="Sign out">
            <LogOut size={17} className="shrink-0" />
          </button>
        )}
      </div>
    </aside>
  );
}
