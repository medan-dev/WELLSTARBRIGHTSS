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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Your learning journey, <br />
            <span className="text-blue-400">all in one place.</span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Access your terminal exam results, official PDF report cards with verification QR codes, live fee balance ledgers, and class timetables.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <Award className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Terminal Report Cards</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <BookOpen className="size-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Live Fees Ledger Balance</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <Calendar className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Weekly Class Timetables</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
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
      <div className="lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Link href="/" className="inline-block">
              <Image src={edurexaHorizontal} alt="EDUREXA Logo" className="h-9 w-auto object-contain" />
            </Link>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Student & Parent Login
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign in with your student registration account to view academic reports and fees.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Email
              </label>
              <Input
                type="email"
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
                  className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
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
                onClick={() => handleAutofillDemo("S.4")}
                className="text-xs px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              >
                S.4 Student
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo("Parent")}
                className="text-xs px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              >
                Parent / Guardian
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              ← Return to Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/admin" className="hover:text-foreground">
                Admin
              </Link>
              <span>•</span>
              <Link href="/teacher" className="hover:text-foreground">
                Teacher
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
