"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { loginStudent } from "../actions";
import { 
  GraduationCap, BookOpen, Calendar, Award, 
  Eye, EyeOff, ShieldCheck, CheckCircle2 
} from "lucide-react";

export default function StudentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("kato.joseph.s-1042@student.wellstarbright.sc.ug");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const student = await loginStudent(email);
      if (student.password !== password) {
        throw new Error("Invalid password");
      }
      
      sessionStorage.setItem("ns_student_id", student.id);
      sessionStorage.setItem("ns_student_name", student.name);
      sessionStorage.setItem("ns_student_class", student.classId);
      
      toast.success(`Welcome back, ${student.name}!`);
      router.push("/student/dashboard");
    } catch (err) {
      toast.error("Invalid email or password. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDemo = (classType = "S.2B") => {
    if (classType === "S.2B") {
      setEmail("kato.joseph.s-1087@student.wellstarbright.sc.ug");
    } else {
      setEmail("kato.joseph.s-1042@student.wellstarbright.sc.ug");
    }
    setPassword("student123");
    toast.success(`Demo credentials filled (${classType})!`);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background">
      {/* Left Showcase Hero Panel */}
      <div className="lg:col-span-6 xl:col-span-7 relative hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] bg-blue-600/30 rounded-full blur-[110px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[450px] bg-indigo-600/25 rounded-full blur-[100px] animate-blob delay-500 pointer-events-none" />
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
            <span className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block -mt-0.5">
              Secondary School
            </span>
          </div>
        </Link>

        {/* Center Pitch */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
            Student Academic Portal
          </p>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Your learning journey, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-amber-300">
              all in one place.
            </span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Access your midterm and final exam results, class timetables, daily homework assignments, and official school notices.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Award className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Exam Results & Ranks</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <BookOpen className="size-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Homework & Due Dates</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Calendar className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Weekly Class Timetable</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="size-4 text-purple-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Honor Roll & Notices</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>Kabembe • Mukono District, Uganda</span>
          <span>© {new Date().getFullYear()} Wellstar Bright</span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-3 mb-6">
            <Link href="/" className="inline-block">
              <Image src={logo} alt="Wellstar Bright" className="w-12 h-12 object-contain" />
            </Link>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Student Portal</h2>
              <p className="text-xs text-muted-foreground">Wellstar Bright Secondary School</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Student Sign In
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in with your student email and password to access your dashboard.
            </p>
          </div>

          {/* Quick Demo Autofill Banner */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-medium">
              <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Demo Student: <strong>Kato Joseph</strong></span>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleAutofillDemo("S.2B")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] transition-colors shadow-xs"
                title="Autofill Kato Joseph (S.2B — Mathematics)"
              >
                Autofill S.2B
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo("S.1A")}
                className="bg-white dark:bg-slate-800 hover:bg-gray-100 text-blue-700 dark:text-blue-300 border border-blue-200 font-semibold px-2 py-1 rounded-lg text-[11px] transition-colors shadow-xs"
                title="Autofill Kato Joseph (S.1A)"
              >
                S.1A
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Student Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kato.joseph.s-1042@student.wellstarbright.sc.ug"
                className="h-11 rounded-xl text-sm font-medium border-border focus-visible:ring-primary"
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
                placeholder="••••••••"
                className="h-11 rounded-xl text-sm font-medium border-border focus-visible:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover-lift-sm transition-all"
            >
              {loading ? "Authenticating..." : "Sign In to Student Dashboard"}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground font-semibold transition-colors">
              ← Return to Main Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/teacher" className="text-orange-600 hover:underline">
                Teacher Login
              </Link>
              <span>•</span>
              <Link href="/admin" className="text-slate-600 dark:text-slate-400 hover:underline">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
