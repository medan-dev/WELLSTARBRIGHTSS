"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Receipt,
  BookOpen,
  GraduationCap,
  Lock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { StandardFrontSiteModal } from "@/components/site/StandardFrontSiteModal";
import {
  loginAdminAction,
  loginTeacherAction,
  loginStudentAction,
  quickDemoLoginAction,
} from "@/lib/auth-actions";

type ClientRole = "cashier" | "admin" | "teacher" | "student";

interface RoleOption {
  key: ClientRole;
  label: string;
  icon: any;
  email: string;
  secret: string;
  destination: string;
}

export default function DemoPage() {
  const router = useRouter();

  const roleOptions: RoleOption[] = [
    {
      key: "cashier",
      label: "Cashier (Fees & Receipts)",
      icon: Receipt,
      email: "cashier@yourschool.com",
      secret: "5566",
      destination: "/admin/dashboard/finance",
    },
    {
      key: "admin",
      label: "School Administrator",
      icon: ShieldCheck,
      email: "admin@yourschool.com",
      secret: "demo1234",
      destination: "/admin/dashboard",
    },
    {
      key: "teacher",
      label: "Teacher Gradebook",
      icon: BookOpen,
      email: "teacher@yourschool.com",
      secret: "password123",
      destination: "/teacher/dashboard",
    },
    {
      key: "student",
      label: "Student / Parent",
      icon: GraduationCap,
      email: "student@yourschool.com",
      secret: "student123",
      destination: "/student/dashboard",
    },
  ];

  const [selectedRole, setSelectedRole] = useState<ClientRole>("cashier");
  const [email, setEmail] = useState("cashier@yourschool.com");
  const [password, setPassword] = useState("5566");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFrontSite, setShowFrontSite] = useState(false);

  // When a user clicks a button below the form, populate the form
  const handleSelectRole = (opt: RoleOption) => {
    setSelectedRole(opt.key);
    setEmail(opt.email);
    setPassword(opt.secret);
    toast.success(`Loaded ${opt.label} credentials`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Set appropriate client session flags based on role
      if (selectedRole === "admin" || selectedRole === "cashier") {
        sessionStorage.setItem("ns_admin_demo", "1");
        localStorage.setItem(
          "wf_web_user",
          JSON.stringify({
            id: `usr-${selectedRole}`,
            name: selectedRole === "admin" ? "Administrator" : "Cashier",
            email: email,
            role: selectedRole === "admin" ? "SUPER_ADMIN" : "CASHIER",
            title: selectedRole === "admin" ? "Administrator" : "Cashier Desk",
          })
        );

        const res = await loginAdminAction(email, password);
        if (res.success && res.user) {
          toast.success(`Welcome to the ${selectedRole === "admin" ? "Admin" : "Cashier"} demonstration!`);
          router.push(selectedRole === "admin" ? "/admin/dashboard" : "/admin/dashboard/finance");
          return;
        } else {
          // Fallback to quick demo session
          const quickRes = await quickDemoLoginAction(selectedRole);
          if (quickRes.success && quickRes.redirectUrl) {
            router.push(quickRes.redirectUrl);
            return;
          }
          toast.error(res.error || "Authentication failed.");
        }
      } else if (selectedRole === "teacher") {
        sessionStorage.setItem("ns_teacher_id", "demo-teacher-01");
        sessionStorage.setItem("ns_teacher_name", "Teacher");

        const res = await loginTeacherAction(email, password);
        if (res.success && res.user) {
          toast.success("Welcome to the Teacher Gradebook demonstration!");
          router.push("/teacher/dashboard");
          return;
        } else {
          const quickRes = await quickDemoLoginAction("teacher");
          if (quickRes.success && quickRes.redirectUrl) {
            router.push(quickRes.redirectUrl);
            return;
          }
          toast.error(res.error || "Authentication failed.");
        }
      } else if (selectedRole === "student") {
        sessionStorage.setItem("ns_student_id", "demo-student-01");
        sessionStorage.setItem("ns_student_name", "Student");
        sessionStorage.setItem("ns_student_class", "");

        const res = await loginStudentAction(email, password);
        if (res.success && res.user) {
          toast.success("Welcome to the Student & Parent demonstration!");
          router.push("/student/dashboard");
          return;
        } else {
          const quickRes = await quickDemoLoginAction("student");
          if (quickRes.success && quickRes.redirectUrl) {
            router.push(quickRes.redirectUrl);
            return;
          }
          toast.error(res.error || "Authentication failed.");
        }
      }
    } catch {
      toast.error("Unable to sign in to demo session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      {/* Top Navigation */}
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

      {/* Main Centered Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Login
            </h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Clean Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
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
              Test accounts:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roleOptions.map((opt) => {
                const isSelected = selectedRole === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectRole(opt)}
                    className={`text-xs px-2.5 py-1.5 border transition-colors ${
                      isSelected
                        ? "border-[#0b2256] bg-[#0b2256] text-white font-medium"
                        : "border-slate-200 text-slate-600 hover:border-slate-400 bg-white"
                    }`}
                  >
                    {opt.label.split(" (")[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-xs text-slate-400">
        <p>© 2026 EDUREXA. All rights reserved.</p>
      </footer>

      {/* Standard Front Site Modal View */}
      <StandardFrontSiteModal
        isOpen={showFrontSite}
        onClose={() => setShowFrontSite(false)}
      />
    </div>
  );
}
