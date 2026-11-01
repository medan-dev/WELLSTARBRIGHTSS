"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  ShieldCheck, LayoutDashboard, Bell, Users, BookOpen, 
  Eye, EyeOff, CheckCircle2, Award, Wallet, Lock
} from "lucide-react";
import { ENTERPRISE_FINANCE_USERS } from "@/lib/finance-users";

export default function AdminLogin() {
  const router = useRouter();
  // Start inputs completely empty for professional security
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);

    // 1. Super Admin Authentication
    if (
      (cleanEmail === "admin@wellstarbright.sc.ug" && (cleanPass === "demo1234" || cleanPass === "admin1234" || cleanPass === "9900")) ||
      (cleanEmail === "admin" && cleanPass === "9900")
    ) {
      sessionStorage.setItem("ns_admin_demo", "1");
      const adminUser = ENTERPRISE_FINANCE_USERS.find((u) => u.role === "SUPER_ADMIN");
      if (adminUser) localStorage.setItem("wf_web_user", JSON.stringify(adminUser));

      toast.success("Welcome, Super Administrator (Dr. Arthur Ssentongo)!");
      router.push("/admin/dashboard");
      return;
    }

    // 2. Chief Bursar Authentication
    if (
      (cleanEmail === "bursar@wellstarbright.sc.ug" && (cleanPass === "bursar1234" || cleanPass === "1234")) ||
      (cleanEmail === "bursar" && cleanPass === "1234")
    ) {
      sessionStorage.setItem("ns_admin_demo", "1");
      const bursarUser = ENTERPRISE_FINANCE_USERS.find((u) => u.role === "BURSAR");
      if (bursarUser) localStorage.setItem("wf_web_user", JSON.stringify(bursarUser));

      toast.success("Welcome, Chief Bursar (CPA Sarah Namubiru)!");
      router.push("/admin/dashboard/finance");
      return;
    }

    // 3. Cashier Authentication
    if (
      (cleanEmail === "cashier@wellstarbright.sc.ug" && (cleanPass === "cashier1234" || cleanPass === "5566")) ||
      (cleanEmail === "cashier" && cleanPass === "5566")
    ) {
      sessionStorage.setItem("ns_admin_demo", "1");
      const cashierUser = ENTERPRISE_FINANCE_USERS.find((u) => u.role === "CASHIER");
      if (cashierUser) localStorage.setItem("wf_web_user", JSON.stringify(cashierUser));

      toast.success("Welcome, Counter Cashier (Joseph Kato)!");
      router.push("/admin/dashboard/finance");
      return;
    }

    // 4. Senior Auditor Authentication
    if (
      (cleanEmail === "auditor@wellstarbright.sc.ug" && (cleanPass === "auditor1234" || cleanPass === "7788")) ||
      (cleanEmail === "auditor" && cleanPass === "7788")
    ) {
      sessionStorage.setItem("ns_admin_demo", "1");
      const auditorUser = ENTERPRISE_FINANCE_USERS.find((u) => u.role === "AUDITOR");
      if (auditorUser) localStorage.setItem("wf_web_user", JSON.stringify(auditorUser));

      toast.success("Welcome, Senior Auditor (CPA Robert Mugisha)!");
      router.push("/admin/dashboard/finance");
      return;
    }

    toast.error("Invalid credentials. Please verify your administrative email/password or PIN.");
  };

  const handleFillAccount = (type: "admin" | "bursar" | "cashier") => {
    if (type === "admin") {
      setEmail("admin@wellstarbright.sc.ug");
      setPassword("demo1234");
      toast.success("Super Admin credentials selected");
    } else if (type === "bursar") {
      setEmail("bursar@wellstarbright.sc.ug");
      setPassword("bursar1234");
      toast.success("Chief Bursar credentials selected");
    } else {
      setEmail("cashier@wellstarbright.sc.ug");
      setPassword("cashier1234");
      toast.success("Counter Cashier credentials selected");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background">
      {/* Left Showcase Hero Panel */}
      <div className="lg:col-span-6 xl:col-span-7 relative hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] bg-slate-800/50 rounded-full blur-[110px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[450px] bg-amber-600/20 rounded-full blur-[100px] animate-blob delay-500 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top Brand */}
        <Link href="/" className="flex items-center gap-3 relative z-10 group w-fit">
          <div className="size-11 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-sm group-hover:scale-105 transition-all">
            <Image src={logo} alt="Wellstar Bright Logo" className="object-contain w-full h-full" priority />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl tracking-tight text-white block">
              Wellstar Bright
            </span>
            <span className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold block -mt-0.5">
              Executive Administration & Finance
            </span>
          </div>
        </Link>

        {/* Center Pitch */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
            School Leadership & Financial Governance
          </p>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Total operational clarity, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-100">
              at your fingertips.
            </span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Manage student fee billing, cashier counters, double-entry ledgers, staff payroll, admissions, and school operations with complete role separation and audit security.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Wallet className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">11-Sector Finance ERP</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="size-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Workstation Remote Lockout</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Users className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Staff Payroll & Statutory Tax</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <LayoutDashboard className="size-4 text-purple-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Audited Financial Statements</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-white/10 text-xs text-slate-400">
          <Award className="size-4 text-amber-400" />
          <span>Kabembe, Mukono • ISO & MOES Standard School Governance</span>
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile Brand Link */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <Link href="/" className="size-10 rounded-xl bg-slate-900 p-2 border border-border shadow-xs">
              <Image src={logo} alt="Logo" className="object-contain w-full h-full" priority />
            </Link>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Admin & Finance Console</h2>
              <p className="text-xs text-muted-foreground">Wellstar Bright Secondary School</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Sign In to Console
            </h2>
            <p className="text-sm text-muted-foreground">
              Authenticate with your staff administrative credentials or security PIN.
            </p>
          </div>

          {/* Quick Staff Account Switcher for Demo Convenience */}
          <div className="p-3 bg-muted/60 border border-border/80 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-primary" /> Fast Role Autofill:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFillAccount("admin")}
                className="py-1.5 px-2 rounded-lg bg-card hover:bg-card/80 border border-border font-bold text-[11px] text-foreground transition-all"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleFillAccount("bursar")}
                className="py-1.5 px-2 rounded-lg bg-card hover:bg-card/80 border border-border font-bold text-[11px] text-emerald-600 transition-all"
              >
                Chief Bursar
              </button>
              <button
                type="button"
                onClick={() => handleFillAccount("cashier")}
                className="py-1.5 px-2 rounded-lg bg-card hover:bg-card/80 border border-border font-bold text-[11px] text-blue-600 transition-all"
              >
                Cashier 1
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Staff Email or Username
              </label>
              <Input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. bursar@wellstarbright.sc.ug"
                className="h-11 rounded-xl text-sm font-medium border-border focus-visible:ring-primary"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Password or 4-Digit Security PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password or 4-digit PIN..."
                className="h-11 rounded-xl text-sm font-medium border-border focus-visible:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Verifying Credentials..." : "Authenticate & Sign In"}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground font-semibold transition-colors">
              ← Return to Main Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/student" className="text-blue-600 hover:underline">
                Student Portal
              </Link>
              <span>•</span>
              <Link href="/teacher" className="text-orange-600 hover:underline">
                Teacher Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
