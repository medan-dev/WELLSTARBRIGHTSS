"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Globe, ArrowRight, Sliders } from "lucide-react";
import { loginStudentAction } from "@/lib/auth-actions";
import { SchoolAutomationWizard } from "@/components/wizard/SchoolAutomationWizard";

export default function StudentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("student@yourschool.com");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("student");

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

  const handleAutofillDemo = (classType = "student") => {
    setSelectedRole(classType);
    if (classType === "parent") {
      setEmail("parent@yourschool.com");
      setPassword("student123");
      toast.success("Loaded Parent Portal credentials");
    } else {
      setEmail("student@yourschool.com");
      setPassword("student123");
      toast.success("Loaded Student Portal credentials");
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
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowWizard(true)}
            className="h-8 rounded-none text-xs gap-1.5 border-slate-300 hover:bg-slate-50 text-slate-800"
          >
            <Sliders className="size-3.5 text-[#f26522]" />
            <span>System Wizard</span>
          </Button>
          <Link
            href="/front-site"
            className="inline-flex items-center gap-1.5 h-8 px-3 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-none transition-colors"
          >
            <Globe className="size-3.5 text-[#0b2256]" />
            <span>Front Site View</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:inline"
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
              Enter your credentials to access your student & parent portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Student Email / ID
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@school.com"
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

            <Link
              href="/front-site"
              className="w-full flex items-center justify-between py-2.5 px-3 border border-slate-200 hover:border-slate-400 bg-slate-50/80 hover:bg-slate-100 text-xs text-slate-700 rounded-none transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Globe className="size-3.5 text-[#0b2256]" />
                <span className="font-semibold text-slate-900">Front Site View</span>
                <span className="text-[11px] text-slate-500">• Standard School Website</span>
              </span>
              <ArrowRight className="size-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => setShowWizard(true)}
              className="w-full flex items-center justify-between py-2 px-3 border border-dashed border-slate-300 hover:border-slate-500 bg-white text-xs text-slate-600 rounded-none transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Sliders className="size-3.5 text-[#f26522]" />
                <span className="font-semibold text-slate-800">System Setup Wizard</span>
                <span className="text-[10px] text-slate-400">• Customize School & Badge</span>
              </span>
              <ArrowRight className="size-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick Select Buttons Below Form */}
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-medium text-slate-400">
              Quick select access:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleAutofillDemo("student")}
                className={`text-xs px-2.5 py-1.5 border rounded-none transition-colors ${
                  selectedRole === "student"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-medium"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Student Access
              </button>

              <button
                type="button"
                onClick={() => handleAutofillDemo("parent")}
                className={`text-xs px-2.5 py-1.5 border rounded-none transition-colors ${
                  selectedRole === "parent"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-medium"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Parent Access
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              ← Return to Website
            </Link>
            <div className="flex items-center gap-3 font-medium">
              <Link href="/admin" className="hover:text-slate-900">
                Administrator
              </Link>
              <span>•</span>
              <Link href="/teacher" className="hover:text-slate-900">
                Teacher
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        EDUREXA Ecosystem Platform
      </footer>

      {/* School Setup & Customization Automation Wizard */}
      <SchoolAutomationWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
      />
    </div>
  );
}