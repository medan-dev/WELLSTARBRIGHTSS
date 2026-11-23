"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Globe,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Sparkles,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampusSwitcher } from "@/components/navigation/CampusSwitcher";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useSchoolBrand } from "@/context/SchoolBrandContext";
import { toast } from "sonner";
import { ENTERPRISE_FINANCE_USERS, FinanceAuthUser } from "@/lib/finance-users";

export default function StandaloneFinanceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { brand } = useSchoolBrand();
  const [dark, setDark] = useState(false);
  const [operator, setOperator] = useState<FinanceAuthUser>(ENTERPRISE_FINANCE_USERS[0]);
  const [operatorMenuOpen, setOperatorMenuOpen] = useState(false);
  const [drawerFloat, setDrawerFloat] = useState("150,000");
  const [showFloatModal, setShowFloatModal] = useState(false);
  const [tempFloatInput, setTempFloatInput] = useState("150,000");
  const operatorMenuRef = useRef<HTMLDivElement>(null);

  // Initialize or restore active web finance session automatically
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure demo / web access is enabled
    sessionStorage.setItem("ns_admin_demo", "1");

    // Load or initialize operator
    try {
      const savedUser = localStorage.getItem("wf_web_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const match = ENTERPRISE_FINANCE_USERS.find((u) => u.id === parsed.id || u.email === parsed.email);
        if (match) {
          setOperator(match);
        } else {
          setOperator(ENTERPRISE_FINANCE_USERS[0]);
          localStorage.setItem("wf_web_user", JSON.stringify(ENTERPRISE_FINANCE_USERS[0]));
        }
      } else {
        setOperator(ENTERPRISE_FINANCE_USERS[0]);
        localStorage.setItem("wf_web_user", JSON.stringify(ENTERPRISE_FINANCE_USERS[0]));
      }

      const savedFloat = localStorage.getItem("wf_drawer_float");
      if (savedFloat) {
        setDrawerFloat(savedFloat);
      } else {
        localStorage.setItem("wf_drawer_float", "150,000");
      }
    } catch {
      setOperator(ENTERPRISE_FINANCE_USERS[0]);
    }
  }, []);

  // Theme Sync
  useEffect(() => {
    const isDark = typeof window !== "undefined" && localStorage.getItem("ns_theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Close operator menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (operatorMenuRef.current && !operatorMenuRef.current.contains(e.target as Node)) {
        setOperatorMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDark = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("ns_theme", nextDark ? "dark" : "light");
  };

  const handleSelectOperator = (user: FinanceAuthUser) => {
    setOperator(user);
    localStorage.setItem("wf_web_user", JSON.stringify(user));
    setOperatorMenuOpen(false);
    toast.success(`Active workstation operator switched to: ${user.name} (${user.title})`);
  };

  const handleSaveDrawerFloat = (e: React.FormEvent) => {
    e.preventDefault();
    setDrawerFloat(tempFloatInput);
    localStorage.setItem("wf_drawer_float", tempFloatInput);
    setShowFloatModal(false);
    toast.success(`Opening Cash Float updated to UGX ${tempFloatInput}`);
  };

  const handleResetShift = () => {
    sessionStorage.setItem("ns_admin_demo", "1");
    localStorage.setItem("wf_web_user", JSON.stringify(ENTERPRISE_FINANCE_USERS[0]));
    setOperator(ENTERPRISE_FINANCE_USERS[0]);
    toast.success("Workstation session refreshed as Chief Bursar");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#f26522] selection:text-white">
      {/* Top Workstation Header */}
      <header className="sticky top-0 z-40 bg-[#0b2256] text-white border-b border-white/10 shadow-md">
        <div className="flex items-center justify-between px-3 sm:px-6 h-16 gap-3">
          {/* Left: School Identity & Workstation Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/finance" className="flex items-center gap-2.5 shrink-0 group">
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
                  <span>STANDALONE WEB FINANCE PORTAL</span>
                  <span className="text-white/40">•</span>
                  <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                    <CheckCircle2 className="size-2.5" /> LIVE
                  </span>
                </div>
              </div>
            </Link>

            <CampusSwitcher />
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Shift Drawer Status Pill (Clickable to adjust opening float) */}
            <button
              type="button"
              onClick={() => {
                setTempFloatInput(drawerFloat);
                setShowFloatModal(true);
              }}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-mono text-white transition-colors cursor-pointer"
              title="Click to view/adjust opening cash float"
            >
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Float:</span>
              <span className="font-bold text-amber-300">UGX {drawerFloat}</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-semibold">Active Shift</span>
            </button>

            {/* Operator Switcher Dropdown */}
            <div className="relative" ref={operatorMenuRef}>
              <button
                type="button"
                onClick={() => setOperatorMenuOpen(!operatorMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white transition-all active:scale-95"
                title="Click to switch operator role"
              >
                <UserCheck className="size-3.5 text-[#f26522]" />
                <div className="text-left text-[11px] leading-tight hidden md:block">
                  <div className="font-bold truncate max-w-[120px]">{operator.name}</div>
                  <div className="text-[9px] text-amber-300 font-mono uppercase">{operator.role}</div>
                </div>
                <ChevronDown className="size-3 text-white/70" />
              </button>

              {operatorMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-white/20 shadow-2xl z-50 p-2 text-white animate-scale-in">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
                    Select Active Finance Operator
                  </div>
                  <div className="space-y-1">
                    {ENTERPRISE_FINANCE_USERS.map((u) => {
                      const isActive = operator.id === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleSelectOperator(u)}
                          className={`w-full text-left p-2 flex items-center justify-between text-xs transition-colors ${
                            isActive
                              ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                              : "hover:bg-white/10 text-slate-200"
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isActive && <CheckCircle2 className="size-3 text-emerald-400" />}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{u.title} &bull; {u.email}</div>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-amber-200 font-mono uppercase">
                            {u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
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

            {/* Shift Refresh Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetShift}
              className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none gap-1"
              title="Reset Workstation Shift"
            >
              <RotateCcw className="size-3 text-amber-300" />
              <span className="hidden sm:inline">Reset Shift</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Drawer Float Adjustment Modal */}
      {showFloatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-slate-900 border border-white/20 p-6 max-w-sm w-full text-white shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="size-5 text-amber-400" />
              <h3 className="font-display font-bold text-base">Opening Drawer Cash Float</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Set the physical cash float verified in the workstation till at the beginning of this shift.
            </p>
            <form onSubmit={handleSaveDrawerFloat} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Drawer Float Amount (UGX)
                </label>
                <input
                  type="text"
                  value={tempFloatInput}
                  onChange={(e) => setTempFloatInput(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-950 border border-white/20 font-mono text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFloatModal(false)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-none text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-none text-xs font-bold"
                >
                  Save Float
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
