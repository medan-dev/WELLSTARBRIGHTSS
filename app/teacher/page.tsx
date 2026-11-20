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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Empowering teachers to <br />
            <span className="text-[#f26522]">inspire excellence.</span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Record class attendance, enter continuous competence scores (1.0 to 3.0 scale), generate automated report cards, and track student mastery seamlessly.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <ClipboardCheck className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Daily Class Attendance</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <FileSpreadsheet className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">UNEB CBC Competence Grading</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
              <BookOpen className="size-4 text-orange-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Assigned Streams & Subjects</span>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2.5 p-3 rounded-none bg-white/5 border border-white/10">
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
              Teacher Login
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign in with your faculty credentials to enter marks and attendance.
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
              className="w-full h-10 bg-[#f26522] hover:bg-[#d95314] text-white font-semibold text-xs rounded-none shadow-none transition-colors mt-2"
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
                onClick={() => handleAutofillDemo("senior")}
                className="text-xs px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              >
                Senior DOS
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo("science")}
                className="text-xs px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              >
                Sciences
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo("humanities")}
                className="text-xs px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              >
                Humanities
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
