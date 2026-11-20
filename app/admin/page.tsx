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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Total operational clarity, <br />
            <span className="text-[#f26522]">for your institution.</span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Manage student fee billing, cashier counters, double-entry ledgers, staff payroll, admissions, and school operations with complete role separation and audit security.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <Wallet className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">11-Sector Finance POS</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <ShieldCheck className="size-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Anti-Leakage Auditing</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <Users className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Student & Staff SIS</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <LayoutDashboard className="size-4 text-purple-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Real-Time Ledger Sync</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-white/10 text-xs text-slate-400">
          <Award className="size-4 text-amber-400" />
          <span>EDUREXA Multi-Tenant Cloud Architecture</span>
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="lg:w-1/2 xl:w-5/12 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-sm mx-auto space-y-6">
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
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Login
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your credentials to access your administrative workstation.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Email
              </label>
              <Input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.com"
                className="h-10 rounded-none text-xs border-slate-300 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-10 rounded-none text-xs border-slate-300 bg-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#0b2256] hover:bg-[#081a42] text-white font-semibold text-xs rounded-none shadow-none transition-colors mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Quick Select Buttons Below Form */}
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-medium text-slate-400">
              Quick select account:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleFillAccount("cashier")}
                className={`text-xs px-2.5 py-1.5 border transition-colors ${
                  selectedRole === "cashier"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-medium"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Cashier
              </button>

              <button
                type="button"
                onClick={() => handleFillAccount("admin")}
                className={`text-xs px-2.5 py-1.5 border transition-colors ${
                  selectedRole === "admin"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-medium"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Administrator
              </button>

              <button
                type="button"
                onClick={() => handleFillAccount("bursar")}
                className={`text-xs px-2.5 py-1.5 border transition-colors ${
                  selectedRole === "bursar"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-medium"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Bursar
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              ← Return to Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/teacher" className="hover:text-foreground">
                Teacher
              </Link>
              <span>•</span>
              <Link href="/student" className="hover:text-foreground">
                Student
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
