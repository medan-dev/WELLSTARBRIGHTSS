"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { loginTeacherAction } from "@/lib/auth-actions";
import {
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function TeacherLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("teacher@yourschool.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginTeacherAction(email, password);

      if (!res.success || !res.user) {
        throw new Error(res.error || "Invalid password or email.");
      }

      sessionStorage.setItem("ns_teacher_id", res.user.id);
      sessionStorage.setItem("ns_teacher_name", res.user.name);

      toast.success(`Welcome back, ${res.user.name}!`);
      router.push("/teacher/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDemo = (teacherType: "senior" | "science" | "humanities" = "senior") => {
    if (teacherType === "science") {
      setEmail("science@yourschool.com");
      setPassword("password123");
      toast.success("Demo credentials filled (Biology & Chemistry Faculty)!");
    } else if (teacherType === "humanities") {
      setEmail("humanities@yourschool.com");
      setPassword("password123");
      toast.success("Demo credentials filled (History & Geography Faculty)!");
    } else {
      setEmail("teacher@yourschool.com");
      setPassword("password123");
      toast.success("Demo credentials filled (Senior Mathematics & DOS)!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background font-sans">
      {/* Left Showcase Hero Panel */}
      <div className="lg:w-1/2 xl:w-7/12 relative hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] bg-orange-600/30 rounded-full blur-[110px] pointer-events-none" />
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold border border-white/20">
            <Sparkles className="size-3 text-orange-300" />
            <span>Faculty Academic Gradebook & UNEB Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Empowering teachers to <br />
            <span className="text-[#f26522]">inspire excellence.</span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Record class attendance, enter continuous competence scores (1.0 to 3.0 scale), generate automated report cards, and track student mastery seamlessly.
          </p>

          {/* Value Props (Pure Flexbox) */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ClipboardCheck className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Daily Class Attendance</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <FileSpreadsheet className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">UNEB CBC Competence Grading</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <BookOpen className="size-4 text-orange-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Assigned Streams & Subjects</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="size-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Automated Report Cards</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>EDUREXA Faculty Operating System</span>
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-[#f26522]">
              <span>Simulated Domain: yourschool.com</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Teacher Gradebook Sign-In
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign in with your faculty credentials to enter marks and attendance.
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="p-3 bg-muted/60 border border-border/80 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <Lock className="size-3.5 text-primary" /> Fast Demo Accounts:
              </span>
              <Link href="/demo" className="text-[11px] text-[#f26522] hover:underline font-bold">
                All Roles →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAutofillDemo("senior")}
                className="flex-1 min-w-[90px] py-2 px-2.5 rounded-xl bg-white border border-border hover:bg-slate-50 font-bold text-[11px] text-foreground transition-all text-center"
              >
                Senior DOS
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo("science")}
                className="flex-1 min-w-[90px] py-2 px-2.5 rounded-xl bg-white border border-border hover:bg-slate-50 font-bold text-[11px] text-emerald-600 transition-all text-center"
              >
                Sciences
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo("humanities")}
                className="flex-1 min-w-[90px] py-2 px-2.5 rounded-xl bg-white border border-border hover:bg-slate-50 font-bold text-[11px] text-blue-600 transition-all text-center"
              >
                Humanities
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Teacher Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@yourschool.com"
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
                placeholder="password123"
                className="h-11 rounded-xl text-sm font-medium border-border font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#f26522] hover:bg-[#d95314] text-white font-bold text-sm rounded-xl shadow-md transition-all gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Gradebook</span>
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
                Admin Console
              </Link>
              <span>•</span>
              <Link href="/student" className="text-blue-600 hover:underline">
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
