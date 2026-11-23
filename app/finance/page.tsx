"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Wallet,
  Lock,
  Eye,
  EyeOff,
  Globe,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Landmark,
  KeyRound,
  ArrowRight,
  UserCheck,
  BadgeCheck,
  Receipt,
  Users,
  CreditCard
} from "lucide-react";
import { loginAdminAction } from "@/lib/auth-actions";
import { useSchoolBrand } from "@/context/SchoolBrandContext";

export default function StandaloneFinanceLoginPage() {
  const router = useRouter();
  const { brand } = useSchoolBrand();

  const [email, setEmail] = useState("bursar@yourschool.com");
  const [password, setPassword] = useState("1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openingFloat, setOpeningFloat] = useState("150,000");
  const [workstationId, setWorkstationId] = useState("WS-BURSAR-WEB01");
  const [selectedRole, setSelectedRole] = useState<"bursar" | "cashier" | "auditor">("bursar");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAdminAction(email, password);
      setLoading(false);

      if (res.success && res.user) {
        sessionStorage.setItem("ns_admin_demo", "1");
        localStorage.setItem("wf_web_user", JSON.stringify(res.user));
        localStorage.setItem("wf_drawer_float", openingFloat);
        localStorage.setItem("wf_workstation_id", workstationId);

        toast.success(`Welcome to Financial Workstation, ${res.user.name}!`);
        router.push("/finance/dashboard");
      } else {
        toast.error(res.error || "Authentication failed. Verify operator email/PIN.");
      }
    } catch {
      setLoading(false);
      toast.error("Authentication server error. Please try again.");
    }
  };

  const handleFillAccount = (type: "bursar" | "cashier" | "auditor") => {
    setSelectedRole(type);
    if (type === "bursar") {
      setEmail("bursar@yourschool.com");
      setPassword("1234");
      setWorkstationId("WS-BURSAR-WEB01");
      toast.success("Chief Bursar credentials selected (PIN: 1234)");
    } else if (type === "cashier") {
      setEmail("cashier@yourschool.com");
      setPassword("5566");
      setWorkstationId("WS-COUNTER-POS1");
      toast.success("Counter Cashier Desk 1 credentials selected (PIN: 5566)");
    } else {
      setEmail("auditor@yourschool.com");
      setPassword("7788");
      setWorkstationId("WS-AUDIT-DESK01");
      toast.success("Internal Auditor credentials selected (PIN: 7788)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between font-sans selection:bg-[#f26522] selection:text-white">
      {/* Top Banner Navigation */}
      <header className="h-16 border-b border-white/10 px-4 sm:px-8 flex items-center justify-between text-white shrink-0 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/front-site" className="flex items-center gap-2.5 group">
            <div className="size-9 bg-white/10 p-1 border border-white/20 rounded-none grid place-items-center group-hover:bg-white/20 transition-all">
              <img
                src={brand?.badgeUrl || "/logo.png"}
                alt="School Crest"
                className="size-7 object-contain"
              />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white block leading-tight">
                {brand?.name || "Wellstar Bright Secondary School"}
              </span>
              <span className="text-[10px] text-amber-300 font-mono tracking-wider uppercase block">
                OFFICE OF THE BURSAR • STANDALONE FINANCE PORTAL
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none gap-1">
            <Link href="/front-site">
              <Globe className="size-3.5 text-amber-300" />
              <span className="hidden sm:inline">Front Site</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none gap-1">
            <Link href="/admin">
              <ShieldCheck className="size-3.5 text-blue-300" />
              <span className="hidden sm:inline">Admin Console</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-950 border border-white/15 shadow-2xl overflow-hidden rounded-none">
          {/* LEFT: Institutional Financial Hero Panel */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-[#0b2256] via-slate-900 to-slate-950 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none mb-4">
                <Wallet className="size-3 text-[#f26522]" />
                <span>Authorized Financial Terminal</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 font-display">
                Standalone Web Finance Portal
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Direct workstation for institutional fee collections, thermal receipt printing, cash drawer reconciliation, double-entry general ledger, and staff payroll management under Ministry of Education &amp; Sports standards.
              </p>

              {/* Core Features Grid */}
              <div className="space-y-3 font-sans text-xs">
                {[
                  {
                    title: "Counter POS & Thermal Receipts",
                    desc: "Fast student fee collection with 58mm/80mm thermal receipt printing and split installments.",
                    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                    icon: Receipt,
                  },
                  {
                    title: "Cash Drawer Float & Shifts",
                    desc: "Daily opening float verification, petty cash disbursements, and end-of-shift cash balancing.",
                    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                    icon: Landmark,
                  },
                  {
                    title: "Double-Entry General Ledger",
                    desc: "Full Chart of Accounts, balanced journal vouchers, trial balance, and balance sheet.",
                    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                    icon: CreditCard,
                  },
                  {
                    title: "Audit-Locked Sequential Receipts",
                    desc: "Sequential cryptographic receipt tracking with complete anti-leakage protection.",
                    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                    icon: ShieldCheck,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="p-3 bg-white/5 border border-white/10 rounded-none flex items-start gap-3">
                      <div className={`p-1.5 rounded-none border ${item.color} shrink-0`}>
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{item.title}</div>
                        <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Institutional Footer Verification */}
            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>UNEB {brand?.unebCenterNumber || "U0482"}</span>
              </div>
              <div className="text-amber-300 font-bold">
                {brand?.currency || "UGX"} Active
              </div>
            </div>
          </div>

          {/* RIGHT: Operator Sign-In Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-white text-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Operator Shift Sign In
                  </h2>
                  <p className="text-xs text-slate-500">
                    Authenticate your financial credentials and verify cash drawer float.
                  </p>
                </div>
                <div className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-bold font-mono">
                  GATEWAY ONLINE
                </div>
              </div>

              {/* Quick Preset Role Switcher */}
              <div className="mb-5">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Select Workstation Operator Role:
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { key: "bursar", label: "Chief Bursar", pin: "1234", sub: "Accounts & GL" },
                    { key: "cashier", label: "Counter Cashier", pin: "5566", sub: "POS Desk 1" },
                    { key: "auditor", label: "Internal Auditor", pin: "7788", sub: "Audit & Books" },
                  ].map((role) => (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => handleFillAccount(role.key as any)}
                      className={`p-2 border text-left rounded-none transition-all ${
                        selectedRole === role.key
                          ? "border-[#0b2256] bg-[#0b2256]/5 ring-1 ring-[#0b2256]"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                    >
                      <div className="font-bold text-slate-900 text-xs truncate">{role.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">PIN: {role.pin}</div>
                      <div className="text-[9px] text-[#f26522] font-semibold">{role.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Authentication Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Workstation Machine ID</Label>
                    <Input
                      value={workstationId}
                      onChange={(e) => setWorkstationId(e.target.value)}
                      className="rounded-none mt-1 h-9 font-mono text-xs font-bold text-[#0b2256] bg-slate-50"
                      placeholder="e.g. WS-COUNTER-POS1"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Opening Drawer Float (UGX)</Label>
                    <Input
                      value={openingFloat}
                      onChange={(e) => setOpeningFloat(e.target.value)}
                      className="rounded-none mt-1 h-9 font-mono text-xs font-bold text-amber-700 bg-slate-50"
                      placeholder="150,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Operator Email or Username</Label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-none mt-1 h-9 text-xs font-mono"
                    placeholder="bursar@yourschool.com"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Operator Password or Counter PIN</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-none pr-9 h-9 text-xs font-mono"
                      placeholder="Enter 4-digit PIN or password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#0b2256] hover:bg-slate-900 text-white font-extrabold text-sm rounded-none shadow-md transition-all gap-2 mt-2"
                >
                  <KeyRound className="size-4 text-[#f26522]" />
                  <span>{loading ? "Authenticating Operator..." : "Open Cash Drawer & Launch Finance Portal"}</span>
                  <ArrowRight className="size-4 text-[#f26522]" />
                </Button>
              </form>
            </div>

            {/* Other Portal Jump Links */}
            <div className="border-t border-slate-200 pt-4 mt-6">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Other School Workstations:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/admin"
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Admin Console →
                </Link>
                <Link
                  href="/teacher"
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Teacher Portal →
                </Link>
                <Link
                  href="/student"
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Student Portal →
                </Link>
                <Link
                  href="/front-site"
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Front Site View →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Footer */}
      <footer className="h-10 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0 bg-slate-950/40">
        <div>EDUREXA Finance Engine &bull; Multi-Tenant Financial ERP</div>
        <div className="flex items-center gap-2">
          <span>Anti-Leakage Protocol v2.6</span>
          <span>&bull;</span>
          <span className="text-emerald-400">Encrypted</span>
        </div>
      </footer>
    </div>
  );
}
