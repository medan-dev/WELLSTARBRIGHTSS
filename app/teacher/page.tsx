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
import { loginTeacherAction } from "@/lib/auth-actions";

export default function TeacherLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("teacher@yourschool.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"senior" | "science" | "humanities">("senior");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginTeacherAction(email, password);
      setLoading(false);

      if (res.success && res.user) {
        sessionStorage.setItem("ns_teacher_id", res.user.id);
        sessionStorage.setItem("ns_teacher_name", res.user.name);
        toast.success(`Welcome back, ${res.user.name}!`);
        router.push("/teacher/dashboard");
      } else {
        toast.error(res.error || "Invalid staff email or password. Please try again.");
      }
    } catch {
      setLoading(false);
      toast.error("Authentication server error. Please try again.");
    }
  };

  const handleAutofillDemo = (type: "senior" | "science" | "humanities") => {
    setSelectedRole(type);
    if (type === "senior") {
      setEmail("teacher@yourschool.com");
      setPassword("demo1234");
      toast.success("Senior Faculty selected (@yourschool.com)");
    } else if (type === "science") {
      setEmail("science@yourschool.com");
      setPassword("demo1234");
      toast.success("Science Faculty selected (@yourschool.com)");
    } else {
      setEmail("humanities@yourschool.com");
      setPassword("demo1234");
      toast.success("Humanities Faculty selected (@yourschool.com)");
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
              Enter your credentials to access the faculty gradebook portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Staff Email
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.com"
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
              Quick select faculty:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAutofillDemo("senior")}
                className={`flex-1 min-w-[90px] h-9 text-xs px-3 border rounded-none transition-colors flex items-center justify-center ${
                  selectedRole === "senior"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-semibold"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium"
                }`}
              >
                Senior Faculty
              </button>

              <button
                type="button"
                onClick={() => handleAutofillDemo("science")}
                className={`flex-1 min-w-[90px] h-9 text-xs px-3 border rounded-none transition-colors flex items-center justify-center ${
                  selectedRole === "science"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-semibold"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium"
                }`}
              >
                Science & Math
              </button>

              <button
                type="button"
                onClick={() => handleAutofillDemo("humanities")}
                className={`flex-1 min-w-[90px] h-9 text-xs px-3 border rounded-none transition-colors flex items-center justify-center ${
                  selectedRole === "humanities"
                    ? "bg-[#0b2256] text-white border-[#0b2256] font-semibold"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium"
                }`}
              >
                Humanities
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
    </div>
  );
}
