"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Globe, ArrowRight } from "lucide-react";
import { loginAdminAction } from "@/lib/auth-actions";
import { StandardFrontSiteModal } from "@/components/site/StandardFrontSiteModal";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@yourschool.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFrontSite, setShowFrontSite] = useState(false);
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      <header className="px-6 py-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="inline-block transition-opacity hover:opacity-90">
          <Image
            src={edurexaHorizontal}
            alt="EDUREXA Logo"
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFrontSite(true)}
            className="h-8 rounded-none text-xs gap-1.5 border-slate-300 hover:bg-slate-50 text-slate-800"
          >
            <Globe className="size-3.5 text-[#0b2256]" />
            <span>Front Site View</span>
          </Button>
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Return to Website
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Login
            </h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your administrative workstation.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email / Workstation ID
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
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
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

            <button
              type="button"
              onClick={() => setShowFrontSite(true)}
              className="w-full flex items-center justify-between py-2.5 px-3 border border-slate-200 hover:border-slate-400 bg-slate-50/80 hover:bg-slate-100 text-xs text-slate-700 rounded-none transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Globe className="size-3.5 text-[#0b2256]" />
                <span className="font-semibold text-slate-900">Front Site View</span>
                <span className="text-[11px] text-slate-500">• Standard School Website</span>
              </span>
              <ArrowRight className="size-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick Select Buttons Below Form */}
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-medium text-slate-400">
              Quick select role:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleFillAccount("cashier")}
                className={`text-xs px-2.5 py-1.5 border rounded-none transition-colors ${
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
                className={`text-xs px-2.5 py-1.5 border rounded-none transition-colors ${
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
                className={`text-xs px-2.5 py-1.5 border rounded-none transition-colors ${
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
            <Link href="/" className="hover:text-slate-900 transition-colors">
              ← Return to Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/teacher" className="hover:text-slate-900">
                Teacher
              </Link>
              <span>•</span>
              <Link href="/student" className="hover:text-slate-900">
                Student
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        EDUREXA Ecosystem Platform
      </footer>

      {/* Standard Front Site Modal View */}
      <StandardFrontSiteModal
        isOpen={showFrontSite}
        onClose={() => setShowFrontSite(false)}
      />
    </div>
  );
}