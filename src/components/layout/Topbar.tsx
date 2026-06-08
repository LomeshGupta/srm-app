"use client";
import { Bell, Search, Sun, Moon, Menu, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button, Avatar } from "@/components/ui";
import { mockNotifications } from "@/data/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":       "Executive Dashboard",
  "/analytics":       "Spend Analytics",
  "/suppliers":       "Supplier Management",
  "/vendor-master":   "Vendor Master — BC Integration",
  "/performance":     "Supplier Performance",
  "/risk":            "Risk & Compliance",
  "/rfq":             "RFQ Management",
  "/purchase-orders": "Purchase Orders",
  "/contracts":       "Contract Management",
  "/invoices":        "Invoices & Payments",
  "/workflow":        "Workflow Automation",
  "/reports":         "Reports",
  "/settings":        "Settings",
};

export function Topbar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = mockNotifications.filter(n => !n.read).length;

  const pageTitle = Object.entries(PAGE_TITLES).find(([k]) => pathname === k || (k !== "/dashboard" && pathname.startsWith(k)))?.[1] ?? "SRM Portal";

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <header className={cn(
      "fixed top-0 right-0 z-30 h-14 flex items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all duration-300",
      sidebarOpen ? "left-60" : "left-16"
    )}>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}><Menu size={18} /></Button>
      <h1 className="text-sm font-semibold hidden sm:block">{pageTitle}</h1>
      <div className="flex-1" />

      <div className="relative hidden md:flex items-center">
        <Search size={15} className="absolute left-2.5 text-muted-foreground" />
        <input className="h-8 w-56 rounded-md border bg-muted/50 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Search…" />
      </div>

      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      </Button>

      {/* Notifications */}
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setNotifOpen(v => !v)}>
          <Bell size={17} />
          {unread > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">{unread}</span>}
        </Button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border bg-card shadow-xl z-50 animate-fade-in-up">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-sm">Notifications</span>
              <button className="text-xs text-primary hover:underline" onClick={() => setNotifOpen(false)}>Dismiss</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {mockNotifications.slice(0, 6).map(n => (
                <div key={n.id} className={cn("p-3 border-b last:border-0 hover:bg-accent/50 transition-colors", !n.read && "bg-primary/5")}>
                  <div className="flex items-start gap-2">
                    <span className={cn("mt-0.5 h-2 w-2 rounded-full shrink-0",
                      n.type === "error" ? "bg-red-500" : n.type === "warning" ? "bg-amber-500" : n.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                    )} />
                    <div>
                      <p className="text-xs font-semibold">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.module}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User + logout */}
      {user && (
        <div className="flex items-center gap-2">
          <Avatar name={user.name} size="sm" />
          <div className="hidden md:block">
            <p className="text-xs font-medium leading-none">{user.name}</p>
            <p className="text-[10px] text-muted-foreground">{user.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out" className="text-muted-foreground hover:text-destructive">
            <LogOut size={16} />
          </Button>
        </div>
      )}
    </header>
  );
}
