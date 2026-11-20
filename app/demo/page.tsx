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
  Sparkles,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
            name: selectedRole === "admin" ? "School Administrator" : "Counter Cashier",
            email: email,
            role: selectedRole === "admin" ? "SUPER_ADMIN" : "CASHIER",
            title: selectedRole === "admin" ? "Executive Administration" : "Cashier Desk",
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
        sessionStorage.setItem("ns_teacher_name", "Senior Faculty Instructor (DOS)");

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
        sessionStorage.setItem("ns_student_name", "Ronald Mutebi (S.4 East)");
        sessionStorage.setItem("ns_student_class", "cls-senior-4-east");

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      {/* Top Simple Bar */}
      <header className="px-4 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="inline-block transition-opacity hover:opacity-90">
          <Image
            src={edurexaHorizontal}
            alt="EDUREXA Logo"
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-[#0b2256] transition-colors"
        >
          ← Return to Main Website
        </Link>
      </header>

      {/* Main Centered Form Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0b2256]/10 text-[#0b2256] text-xs font-bold">
              <Sparkles className="size-3 text-[#f26522]" />
              <span>Client Demonstration</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Demo Portal Sign-In
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Simulated School: <span className="font-bold text-slate-700">yourschool.com</span>
            </p>
          </div>

          {/* The Primary Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Demo Account Email
              </label>
              <Input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. cashier@yourschool.com"
                className="h-11 rounded-xl text-xs font-mono font-medium border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password or PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#f26522] hover:underline font-semibold flex items-center gap-1"
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
                placeholder="Password or PIN"
                className="h-11 rounded-xl text-xs font-mono font-medium border-slate-200 bg-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0b2256] hover:bg-[#081a42] text-white font-bold text-xs rounded-xl shadow-sm gap-2 transition-all mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In & Launch Demo</span>
                  <ArrowRight className="size-4 text-[#f26522]" />
                </>
              )}
            </Button>
          </form>

          {/* BUTTONS BELOW THE FORM (Pure Flex Layout) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Lock className="size-3 text-[#f26522]" /> Choose role to test:
              </span>
              <span className="text-[11px] text-slate-400">Click to autofill</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.key;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectRole(opt)}
                    className={`flex-1 min-w-[calc(50%-0.25rem)] p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-[#0b2256] text-white border-[#0b2256] shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <Icon className={`size-3.5 ${isSelected ? "text-[#f26522]" : "text-slate-500"}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 text-center leading-relaxed">
            <ShieldCheck className="size-3.5 text-emerald-600 inline mr-1 -mt-0.5" />
            Client sandbox mode. All records are isolated with pre-loaded mock data.
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <p>© 2026 EDUREXA. Educational Institution Operating System.</p>
      </footer>
    </div>
  );
}
