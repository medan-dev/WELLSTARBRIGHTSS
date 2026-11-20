"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { loginStudentAction } from "@/lib/auth-actions";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function StudentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("student@yourschool.com");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginStudentAction(email, password);
      if (!res.success || !res.user) {
        throw new Error(res.error || "Invalid student credentials.");
      }

      sessionStorage.setItem("ns_student_id", res.user.id);
      sessionStorage.setItem("ns_student_name", res.user.name);
      if (res.user.classId) {
        sessionStorage.setItem("ns_student_class", res.user.classId);
      }

      toast.success(`Welcome back, ${res.user.name}!`);
      router.push("/student/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Invalid email or password. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDemo = (classType = "S.4") => {
    if (classType === "Parent") {
      setEmail("parent@yourschool.com");
      setPassword("student123");
      toast.success("Demo credentials filled (Parent Access)!");
    } else {
      setEmail("student@yourschool.com");
      setPassword("student123");
      toast.success(`Demo credentials filled (Senior 4 Boarding)!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background font-sans">
      {/* Left Showcase Hero Panel */}
      <div className="lg:w-1/2 xl:w-7/12 relative hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] bg-blue-600/30 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[450px] bg-indigo-600/25 rounded-full blur-[100px] pointer-events-none" />

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold border border-white/20">
            <Sparkles className="size-3 text-blue-300" />
            <span>Student & Parent Academic Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Your learning journey, <br />
            <span className="text-blue-400">all in one place.</span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Access your terminal exam results, official PDF report cards with verification QR codes, live fee balance ledgers, and class timetables.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Award className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Terminal Report Cards</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <BookOpen className="size-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Live Fees Ledger Balance</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Calendar className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Weekly Class Timetables</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="size-4 text-purple-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Clearance Gate Passes</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>EDUREXA Student & Parent Station</span>
          <span>© 2026 EDUREXA</span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Link href="/" className="inline-block">
              <Image src={edurexaHorizontal} alt="EDUREXA Logo" className="h-9 w-auto object-contain" />
            </Link>
            <Link href="/demo" className="text-xs font-bold text-[#f26522] hover:underline">
              Demo Gateway →
            </Link>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700">
              <span>Simulated Domain: yourschool.com</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Student & Parent Portal
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign in with your student registration account to view academic reports and fees.
            </p>
          </div>

          {/* Quick Autofill */}
          <div className="p-3 bg-muted/60 border border-border/80 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <Lock className="size-3.5 text-blue-600" /> Fast Demo Accounts:
              </span>
              <Link href="/demo" className="text-[11px] text-[#f26522] hover:underline font-bold">
                All Roles →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAutofillDemo("S.4")}
                className="flex-1 min-w-[120px] py-2 px-2.5 rounded-xl bg-white border border-border hover:bg-slate-50 font-bold text-[11px] text-blue-700 transition-all text-center"
              >
                S.4 Student Profile
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo("Parent")}
                className="flex-1 min-w-[120px] py-2 px-2.5 rounded-xl bg-white border border-border hover:bg-slate-50 font-bold text-[11px] text-emerald-700 transition-all text-center"
              >
                Parent / Guardian
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Student or Parent Email
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@yourschool.com"
                className="h-11 rounded-xl text-sm font-medium border-border font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
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
                placeholder="student123"
                className="h-11 rounded-xl text-sm font-medium border-border font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Access Student Station</span>
                  <ArrowRight className="size-4" />
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
              <Link href="/admin" className="text-emerald-600 hover:underline">
                Admin
              </Link>
              <span>•</span>
              <Link href="/teacher" className="text-orange-600 hover:underline">
                Teacher
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
