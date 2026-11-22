"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Globe } from "lucide-react";
import { loginStudentAction } from "@/lib/auth-actions";

export default function StudentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("student@yourschool.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "parent">("student");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginStudentAction(email, password);
      setLoading(false);

      if (res.success && res.user) {
        sessionStorage.setItem("ns_student_id", res.user.id);
        sessionStorage.setItem("ns_student_name", res.user.name);
        sessionStorage.setItem("ns_student_class", (res.user as any).className || "");
        toast.success(`Welcome back, ${res.user.name}!`);
        router.push("/student/dashboard");
      } else {
        toast.error(res.error || "Invalid student/parent credentials. Please verify your email and password.");
      }
    } catch {
      setLoading(false);
      toast.error("Authentication server error. Please try again.");
    }
  };

  const handleAutofillDemo = (type: "student" | "parent") => {
    setSelectedRole(type);
    if (type === "student") {
      setEmail("student@yourschool.com");
      setPassword("demo1234");
      toast.success("Student demo credentials selected (@yourschool.com)");
    } else {
      setEmail("parent@yourschool.com");
      setPassword("demo1234");
      toast.success("Parent demo credentials selected (@yourschool.com)");
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
        <Link
          href="/"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Return to Website
        </Link>
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

            {/* Flexible Action Buttons with Identical Height and Design */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 h-10 bg-[#0b2256] hover:bg-[#081a42] text-white font-semibold text-xs rounded-none shadow-none transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Link
                href="/front-site"
                className="w-full sm:flex-1 h-10 inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-none transition-colors"
              >
                <Globe className="size-3.5 text-[#0b2256]" />
                <span>Front Site View</span>
              </Link>
            </div>
          </form>

          {/* Quick Select Buttons Below Form */}
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-medium text-slate-400">
              Quick select access:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAutofillDemo("student")}
                className={`flex-1 min-w-[90px] h-9 text-xs px-3 border rounded-none transition-colors flex items-center justify-center ${
                  selectedRole === "student"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-semibold"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium"
                }`}
              >
                Student Access
              </button>

              <button
                type="button"
                onClick={() => handleAutofillDemo("parent")}
                className={`flex-1 min-w-[90px] h-9 text-xs px-3 border rounded-none transition-colors flex items-center justify-center ${
                  selectedRole === "parent"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-semibold"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium"
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
    </div>
  );
}
