"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { loginTeacher } from "../actions";
import { 
  BookOpen, Users, ClipboardCheck, FileSpreadsheet, 
  Eye, EyeOff, ShieldCheck, PlusCircle, CheckCircle2 
} from "lucide-react";

export default function TeacherLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("i.sserwadda@wellstarbright.sc.ug");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const teacher = await loginTeacher(email);
      if (teacher.password !== password) {
        throw new Error("Invalid password");
      }
      
      sessionStorage.setItem("ns_teacher_id", teacher.id);
      sessionStorage.setItem("ns_teacher_name", teacher.name);
      
      toast.success(`Welcome back, ${teacher.name}!`);
      router.push("/teacher/dashboard");
    } catch (err) {
      toast.error("Invalid email or password. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail("i.sserwadda@wellstarbright.sc.ug");
    setPassword("password123");
    toast.success("Demo credentials filled!");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background">
      {/* Left Showcase Hero Panel */}
      <div className="lg:col-span-6 xl:col-span-7 relative hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] bg-orange-600/30 rounded-full blur-[110px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-[450px] bg-amber-600/25 rounded-full blur-[100px] animate-blob delay-500 pointer-events-none" />
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
            <span className="text-[10px] text-orange-200 uppercase tracking-widest font-semibold block -mt-0.5">
              Faculty & Staff Console
            </span>
          </div>
        </Link>

        {/* Center Pitch */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-300">
            Faculty Academic Management
          </p>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Empowering teachers to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200">
              inspire excellence.
            </span>
          </h1>

          <p className="text-base text-slate-300/90 leading-relaxed">
            Record class attendance, enter exam marks, assign homework tasks, and monitor student academic performance seamlessly.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ClipboardCheck className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Digital Daily Attendance</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <FileSpreadsheet className="size-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Exam Grading & Marks</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <BookOpen className="size-4 text-orange-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Assigned Classes & Groups</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <PlusCircle className="size-4 text-yellow-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Homework & Assignments</span>
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
              <h2 className="font-display text-2xl font-bold text-foreground">Teacher Portal</h2>
              <p className="text-xs text-muted-foreground">Wellstar Bright Secondary School</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Teacher Sign In
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in with your staff credentials to access your teaching dashboard.
            </p>
          </div>

          {/* Quick Demo Autofill Banner */}
          <div className="p-3.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-orange-900 dark:text-orange-300 font-medium">
              <BookOpen className="size-4 text-orange-600 dark:text-orange-400 shrink-0" />
              <span>Demo Teacher: <strong>I. Sserwadda</strong></span>
            </div>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] transition-colors shrink-0 shadow-xs"
            >
              Autofill
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Staff Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. i.sserwadda@wellstarbright.sc.ug"
                className="h-11 rounded-xl text-sm font-medium border-border focus-visible:ring-orange-600"
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
                  className="text-xs text-orange-600 hover:underline font-semibold flex items-center gap-1"
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
                className="h-11 rounded-xl text-sm font-medium border-border focus-visible:ring-orange-600"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover-lift-sm transition-all"
            >
              {loading ? "Verifying Credentials..." : "Sign In to Teacher Dashboard"}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground font-semibold transition-colors">
              ← Return to Main Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/student" className="text-orange-600 hover:underline">
                Student Login
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
