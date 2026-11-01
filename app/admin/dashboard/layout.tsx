"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck,
  Wallet, Bell, LogOut, Menu, Search, Moon, Sun, FileText, LayoutTemplate, Video, ImageIcon, ChevronLeft, ChevronRight,
  Utensils
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/finance", label: "Finance Command", icon: Wallet },
  { href: "/admin/dashboard/notices", label: "Notice Board", icon: Bell },
  { href: "/admin/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/admin/dashboard/students", label: "Students", icon: Users },
  { href: "/admin/dashboard/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/admin/dashboard/classes", label: "Classes", icon: BookOpen },
  { href: "/admin/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },

  { href: "/admin/dashboard/cms", label: "Website Content", icon: LayoutTemplate },
  { href: "/admin/dashboard/media", label: "Media & Events", icon: Video },
  { href: "/admin/dashboard/gallery", label: "Gallery", icon: ImageIcon },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // Mobile sidebar open
  const [collapsed, setCollapsed] = useState(false); // Desktop sidebar collapsed
  const [dark, setDark] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("ns_admin_demo")) {
      router.push("/admin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    const isDark = typeof window !== "undefined" && localStorage.getItem("ns_theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    try { localStorage.setItem("ns_theme", nextDark ? "dark" : "light"); } catch(_) {}
  };

  const logout = () => {
    sessionStorage.removeItem("ns_admin_demo");
    router.push("/admin");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Verifying administrator credentials...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex" suppressHydrationWarning>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 inset-y-0 left-0 z-40 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 lg:translate-x-0 shadow-lg lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("p-6 flex items-center gap-3 border-b border-sidebar-border transition-all", collapsed ? "justify-center px-2" : "")}>
          <Image src={logo} alt="Wellstar Bright Logo" className="w-9 h-9 object-contain shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
              <div className="font-display font-bold">Wellstar Bright</div>
              <div className="text-xs text-sidebar-foreground/60">Admin</div>
            </div>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center rounded-xl font-medium transition-all duration-200 group relative",
                  collapsed ? "justify-center p-3" : "gap-3 px-3 py-3 text-sm",
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className={cn("shrink-0 transition-transform duration-200", collapsed ? "size-6" : "size-5")} />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-sidebar-border flex flex-col gap-2">
          {/* Toggle Button for Desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center p-3 rounded-xl text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-6" /> : (
              <div className="flex items-center gap-2 text-sm w-full font-medium">
                <Menu className="size-5" /> Collapse menu
              </div>
            )}
          </button>

          <button
            onClick={logout}
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              "flex items-center rounded-xl font-medium text-sidebar-foreground/80 hover:bg-red-500 hover:text-white transition-all duration-200",
              collapsed ? "justify-center p-3" : "gap-3 px-3 py-3 text-sm w-full"
            )}
          >
            <LogOut className={cn("shrink-0", collapsed ? "size-6" : "size-5")} />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-background border-b border-border shadow-sm">
          <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
            <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setOpen(true)}>
              <Menu className="size-5" />
            </button>
            <div className="hidden md:flex relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search students, teachers, classes…" className="pl-9 bg-secondary/50 border-none focus-visible:ring-1" />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme" className="rounded-full">
                {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="relative rounded-full">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-accent border-2 border-background" />
              </Button>
              <div className="size-9 rounded-full bg-primary grid place-items-center text-primary-foreground text-sm font-bold shadow-md cursor-pointer hover:ring-2 ring-primary/30 transition-all">
                NM
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

