"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/assets/logo.png";
import {
  Wallet,
  Globe,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  HardDrive,
  CheckCircle2,
  Lock,
  Landmark,
  UserCheck,
  Receipt,
  Printer,
  Sliders,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampusSwitcher } from "@/components/navigation/CampusSwitcher";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useSchoolBrand } from "@/context/SchoolBrandContext";
import { logoutAction } from "@/lib/auth-actions";

export default function StandaloneFinanceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { brand } = useSchoolBrand();
  const [dark, setDark] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [operator, setOperator] = useState<{ name: string; role: string; title?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = sessionStorage.getItem("ns_admin_demo");
    if (!session) {
      router.push("/finance");
    } else {
      setAuthorized(true);
      try {
        const storedUser = localStorage.getItem("wf_web_user");
        if (storedUser) {
          setOperator(JSON.parse(storedUser));
        } else {
          setOperator({ name: "Chief Bursar", role: "BURSAR", title: "Head of Accounts" });
        }
      } catch {
        setOperator({ name: "Chief Bursar", role: "BURSAR", title: "Head of Accounts" });
      }
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
    localStorage.setItem("ns_theme", nextDark ? "dark" : "light");
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("ns_admin_demo");
    localStorage.removeItem("wf_web_user");
    await logoutAction();
    router.push("/finance");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-900 grid place-items-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-mono tracking-widest text-slate-300">AUTHENTICATING FINANCIAL WORKSTATION...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Workstation Header */}
      <header className="sticky top-0 z-30 bg-[#0b2256] text-white border-b border-white/10 shadow-md">
        <div className="flex items-center justify-between px-3 sm:px-6 h-16 gap-3">
          {/* Left: School Identity & Workstation Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/finance/dashboard" className="flex items-center gap-2.5 shrink-0 group">
              <div className="size-10 bg-white/10 p-1 border border-white/20 rounded-none grid place-items-center group-hover:bg-white/20 transition-all">
                <img
                  src={brand?.badgeUrl || "/logo.png"}
                  alt="School Crest"
                  className="size-8 object-contain"
                />
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="text-xs font-extrabold uppercase tracking-tight text-white truncate max-w-[240px] md:max-w-xs">
                  {brand?.name || "Wellstar Bright Secondary School"}
                </div>
                <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
                  <Landmark className="size-3" />
                  <span>BURSAR FINANCIAL WORKSTATION</span>
                  <span className="text-white/40">•</span>
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="size-2.5" /> ONLINE
                  </span>
                </div>
              </div>
            </Link>

            <CampusSwitcher />
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Shift Drawer Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/15 text-[11px] font-mono text-white">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Float:</span>
              <span className="font-bold text-amber-300">UGX 150,000</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-semibold">Active Shift</span>
            </div>

            {/* Operator Badge */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/15 text-xs text-white">
              <UserCheck className="size-3.5 text-[#f26522]" />
              <div className="text-left text-[11px] leading-tight">
                <div className="font-bold truncate max-w-[120px]">{operator?.name || "Chief Bursar"}</div>
                <div className="text-[9px] text-amber-300 font-mono uppercase">{operator?.role || "BURSAR"}</div>
              </div>
            </div>

            {/* Front Site Link */}
            <Button asChild variant="outline" size="sm" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none gap-1 hidden sm:inline-flex">
              <Link href="/front-site">
                <Globe className="size-3.5 text-amber-300" />
                <span className="hidden md:inline">Front Site</span>
              </Link>
            </Button>

            {/* Admin Console Switcher */}
            <Button asChild variant="outline" size="sm" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none gap-1 hidden sm:inline-flex">
              <Link href="/admin/dashboard">
                <ShieldCheck className="size-3.5 text-blue-300" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </Button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="size-8 rounded-none bg-white/10 hover:bg-white/20 text-white grid place-items-center border border-white/15 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="size-4 text-amber-300" /> : <Moon className="size-4" />}
            </button>

            {/* Notification Center */}
            <NotificationCenter role="ADMIN" />

            {/* Sign Out / Lock Shift */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-8 text-xs bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white border-rose-400/30 rounded-none gap-1"
              title="Lock Workstation & End Shift"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Lock / Exit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
