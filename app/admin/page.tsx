"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Wallet,
  ShieldCheck,
  Users,
  LayoutDashboard,
  Eye,
  EyeOff,
  Lock,
  Award,
  Sparkles,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { loginAdminAction } from "@/lib/auth-actions";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@yourschool.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "cashier" | "bursar">("admin");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAdminAction(email, password);
      setLoading(false);

      if (res.success && res.user) {
        sessionStorage.setItem("ns_admin_demo", "1");
        localStorage.setItem("wf_web_user", JSON.stringify(res.user));
        toast.success(`Welcome back, ${res.user.name}!`);

        if (res.user.role === "SUPER_ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/admin/dashboard/finance");
        }
      } else {
        toast.error(res.error || "Invalid credentials. Please verify your administrative email/password or PIN.");
      }
    } catch {
      setLoading(false);
      toast.error("Authentication server error. Please try again.");
    }
  };

  const handleFillAccount = (type: "admin" | "bursar" | "cashier") => {
    setSelectedRole(type);
    if (type === "admin") {
      setEmail("admin@yourschool.com");
      setPassword("demo1234");
      toast.success("School Admin credentials selected (@yourschool.com)");
    } else if (type === "cashier") {
      setEmail("cashier@yourschool.com");
      setPassword("5566");
      toast.success("Cashier Desk credentials selected (PIN: 5566)");
    } else {
      setEmail("bursar@yourschool.com");
      setPassword("1234");
      toast.success("Chief Bursar credentials selected (PIN: 1234)");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Showcase Hero Panel (Pure Flexbox) */}
      <div className="lg:w-1/2 xl:w-7/12 relative hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] bg-slate-800/50 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[450px] bg-[#f26522]/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Brand */}
        <Link href="/" className="flex items-center gap-3 relative z-10 w-fit">
          <Image
            src={edurexaHorizontal}
            alt="EDUREXA Logo"
            className="h-10 w-auto object-contain brightness-0 invert"
            priority
          />
        </Link>

        {/* Center Pitch */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/20">
            <Sparkles className="size-3 text-amber-300" />
            <span>Multi-Tenant School Administration & Finance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Total operational clarity, <br />
            <span className="text-[#f26522]">for your institution.</span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Manage student fee billing, cashier counters, double-entry ledgers, staff payroll, admissions, and school operations with complete role separation and audit security.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Wallet className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">11-Sector Finance POS</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="size-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Anti-Leakage Auditing</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Users className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Student & Staff SIS</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <LayoutDashboard className="size-4 text-purple-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Real-Time Ledger Sync</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-white/10 text-xs text-slate-400">
          <Award className="size-4 text-amber-400" />
          <span>EDUREXA Multi-Tenant Cloud Architecture • ISO & MOES Standard</span>
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="lg:w-1/2 xl:w-5/12 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile Brand Link */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Link href="/" className="inline-block">
              <Image
                src={edurexaHorizontal}
                alt="EDUREXA Logo"
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            <Link href="/demo" className="text-xs font-bold text-[#f26522] hover:underline">
              Demo Gateway →
            </Link>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0b2256]/10 text-[#0b2256]">
              <span>Simulated Domain: yourschool.com</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Administrative Sign-In
            </h2>
            <p className="text-xs text-muted-foreground">
              Choose your role below to test the full system live.
            </p>
          </div>

          {/* Role Chooser Tabs: Cashier, Admin, Bursar */}
          <div className="p-3 bg-muted/60 border border-border/80 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <Lock className="size-3.5 text-[#0b2256]" /> Choose Workstation to Test:
              </span>
              <Link href="/demo" className="text-[11px] text-[#f26522] hover:underline font-bold">
                All Roles →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleFillAccount("cashier")}
                className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  selectedRole === "cashier"
                    ? "bg-[#0b2256] text-white border-[#0b2256] shadow-xs"
                    : "bg-white hover:bg-slate-100 text-emerald-700 border-border"
                }`}
              >
                Cashier Desk
              </button>

              <button
                type="button"
                onClick={() => handleFillAccount("admin")}
                className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  selectedRole === "admin"
                    ? "bg-[#0b2256] text-white border-[#0b2256] shadow-xs"
                    : "bg-white hover:bg-slate-100 text-slate-900 border-border"
                }`}
              >
                School Admin
              </button>

              <button
                type="button"
                onClick={() => handleFillAccount("bursar")}
                className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  selectedRole === "bursar"
                    ? "bg-[#0b2256] text-white border-[#0b2256] shadow-xs"
                    : "bg-white hover:bg-slate-100 text-blue-700 border-border"
                }`}
              >
                Chief Bursar
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
                placeholder="e.g. cashier@yourschool.com"
                className="h-11 rounded-xl text-sm font-medium border-border font-mono"
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
                  className="text-xs text-[#f26522] hover:underline font-semibold flex items-center gap-1"
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
                className="h-11 rounded-xl text-sm font-medium border-border font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0b2256] hover:bg-[#081a42] text-white font-bold text-sm rounded-xl shadow-md transition-all gap-2"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole === "cashier" ? "Cashier" : selectedRole === "admin" ? "Admin" : "Bursar"}</span>
                  <ArrowRight className="size-4 text-[#f26522]" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground font-semibold transition-colors">
              ← Main Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/demo" className="text-[#f26522] font-bold hover:underline">
                Demo Gateway
              </Link>
              <span>•</span>
              <Link href="/teacher" className="text-orange-600 hover:underline">
                Teacher
              </Link>
              <span>•</span>
              <Link href="/student" className="text-blue-600 hover:underline">
                Student
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
