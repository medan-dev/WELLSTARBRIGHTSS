"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import {
  Receipt,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  CheckCircle2,
  Phone,
  Copy,
  Check,
  Key,
  ExternalLink,
  Laptop,
  Building2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { quickDemoLoginAction, loginAdminAction, loginTeacherAction, loginStudentAction } from "@/lib/auth-actions";

type DemoRoleKey = "cashier" | "admin" | "bursar" | "teacher" | "student" | "super-admin";

interface DemoStation {
  key: DemoRoleKey;
  title: string;
  badge: string;
  badgeColor: string;
  icon: any;
  color: string;
  destination: string;
  email: string;
  secretLabel: string;
  secretValue: string;
  description: string;
  capabilities: string[];
}

export default function DemoGatewayPage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<DemoRoleKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<DemoRoleKey>("cashier");

  // Form states for manual testing
  const [customEmail, setCustomEmail] = useState("cashier@yourschool.com");
  const [customSecret, setCustomSecret] = useState("5566");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const stations: DemoStation[] = [
    {
      key: "cashier",
      title: "Cashier POS Desk",
      badge: "High Volume POS",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Receipt,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      destination: "/admin/dashboard/finance",
      email: "cashier@yourschool.com",
      secretLabel: "Quick POS PIN",
      secretValue: "5566",
      description: "Fast counter fee collection with 58mm/80mm thermal receipt printing, cash float counts, and instant ledger updates.",
      capabilities: [
        "Issue instant thermal slips with cryptographic anti-fraud QR",
        "Lookup students by name, registration code, or barcode",
        "Split payments across Tuition, Boarding, and Lab vote heads",
      ],
    },
    {
      key: "admin",
      title: "School Admin & Headteacher",
      badge: "Full Institutional Control",
      badgeColor: "bg-blue-100 text-blue-800",
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      destination: "/admin/dashboard",
      email: "admin@yourschool.com",
      secretLabel: "Password",
      secretValue: "demo1234",
      description: "Central command dashboard for school directors and headteachers overseeing admissions, student rosters, and academic terms.",
      capabilities: [
        "Admissions pipeline and class stream promotions",
        "Staff permissions, teaching workloads, and user roles",
        "Executive revenue collection and attendance analytics",
      ],
    },
    {
      key: "bursar",
      title: "Chief Bursar & Ledger Control",
      badge: "Financial Anti-Leakage",
      badgeColor: "bg-indigo-100 text-indigo-800",
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      destination: "/admin/dashboard/finance",
      email: "bursar@yourschool.com",
      secretLabel: "Bursar PIN",
      secretValue: "1234",
      description: "Double-entry accounting, bank statement auto-matching (Centenary, Stanbic, Equity), and family sibling balance consolidation.",
      capabilities: [
        "Auto-reconcile electronic bank CSV files against student ledgers",
        "Sibling family ledger consolidation and fee discounts",
        "Real-time fee defaulter lists and automated reminder triggers",
      ],
    },
    {
      key: "teacher",
      title: "Teacher Gradebook & UNEB CBC",
      badge: "CBC Engine",
      badgeColor: "bg-purple-100 text-purple-800",
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      destination: "/teacher/dashboard",
      email: "teacher@yourschool.com",
      secretLabel: "Password",
      secretValue: "password123",
      description: "Distraction-free academic marking portal supporting Uganda Lower Secondary CBC competence scoring and A-Level grading.",
      capabilities: [
        "Score formative Activities of Integration (AOIs) on 1.0 - 3.0 scale",
        "Automatic conversion into UNEB terminal report cards",
        "Daily subject and homeroom class attendance registers",
      ],
    },
    {
      key: "student",
      title: "Student & Parent Station",
      badge: "Parent Transparency",
      badgeColor: "bg-amber-100 text-amber-800",
      icon: GraduationCap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      destination: "/student/dashboard",
      email: "student@yourschool.com",
      secretLabel: "Password",
      secretValue: "student123",
      description: "Self-service station for parents and students to inspect live fee balances, download official report cards, and check exam schedules.",
      capabilities: [
        "1-click download of terminal report cards with verification QR",
        "Transparent fee ledger breakdown of every receipted installment",
        "Exam timetables, assignments, and school notices",
      ],
    },
    {
      key: "super-admin",
      title: "Multi-Campus Fleet Command",
      badge: "Executive Fleet",
      badgeColor: "bg-slate-800 text-white",
      icon: Lock,
      color: "text-[#0b2256] bg-slate-100 border-slate-300",
      destination: "/super-admin",
      email: "superadmin@yourschool.com",
      secretLabel: "Master Passcode",
      secretValue: "9900",
      description: "Executive multi-branch oversight for school groups, educational trusts, and boards managing several branch campuses.",
      capabilities: [
        "Consolidated group collection metrics across all campuses",
        "Instant provisioning of new school branches and quotas",
        "Multi-tenant system health, backup verification, and audit logs",
      ],
    },
  ];

  // 1-Click Launch Handler
  const handleLaunch = async (station: DemoStation) => {
    setLoadingRole(station.key);
    try {
      // Set client session flags
      if (station.key === "admin" || station.key === "cashier" || station.key === "bursar") {
        sessionStorage.setItem("ns_admin_demo", "1");
        localStorage.setItem(
          "wf_web_user",
          JSON.stringify({
            id: `usr-${station.key}`,
            name: station.title,
            email: station.email,
            role: station.key === "admin" ? "SUPER_ADMIN" : station.key === "bursar" ? "BURSAR" : "CASHIER",
            title: station.title,
          })
        );
      } else if (station.key === "teacher") {
        sessionStorage.setItem("ns_teacher_id", "demo-teacher-01");
        sessionStorage.setItem("ns_teacher_name", "Senior Faculty Instructor (DOS)");
      } else if (station.key === "student") {
        sessionStorage.setItem("ns_student_id", "demo-student-01");
        sessionStorage.setItem("ns_student_name", "Ronald Mutebi (S.4 East)");
        sessionStorage.setItem("ns_student_class", "cls-senior-4-east");
      } else if (station.key === "super-admin") {
        sessionStorage.setItem("ws_super_admin_unlocked", "true");
      }

      // Execute server auth action
      const res = await quickDemoLoginAction(station.key);
      if (res.success && res.redirectUrl) {
        toast.success(`Authenticated as ${station.title}! Redirecting...`);
        router.push(res.redirectUrl);
      } else {
        router.push(station.destination);
      }
    } catch {
      // Fallback navigation
      router.push(station.destination);
    } finally {
      setTimeout(() => setLoadingRole(null), 1500);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectTab = (key: DemoRoleKey) => {
    setSelectedTab(key);
    const station = stations.find((s) => s.key === key);
    if (station) {
      setCustomEmail(station.email);
      setCustomSecret(station.secretValue);
    }
  };

  const handleManualFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (selectedTab === "admin" || selectedTab === "cashier" || selectedTab === "bursar") {
        const res = await loginAdminAction(customEmail, customSecret);
        if (res.success && res.user) {
          sessionStorage.setItem("ns_admin_demo", "1");
          localStorage.setItem("wf_web_user", JSON.stringify(res.user));
          toast.success(`Signed in as ${res.user.name}!`);
          router.push(selectedTab === "admin" ? "/admin/dashboard" : "/admin/dashboard/finance");
          return;
        } else {
          toast.error(res.error || "Invalid credentials.");
        }
      } else if (selectedTab === "teacher") {
        const res = await loginTeacherAction(customEmail, customSecret);
        if (res.success && res.user) {
          sessionStorage.setItem("ns_teacher_id", res.user.id);
          sessionStorage.setItem("ns_teacher_name", res.user.name);
          toast.success("Signed in to Teacher Gradebook!");
          router.push("/teacher/dashboard");
          return;
        } else {
          toast.error(res.error || "Invalid credentials.");
        }
      } else if (selectedTab === "student") {
        const res = await loginStudentAction(customEmail, customSecret);
        if (res.success && res.user) {
          sessionStorage.setItem("ns_student_id", res.user.id);
          sessionStorage.setItem("ns_student_name", res.user.name);
          toast.success("Signed in to Student Station!");
          router.push("/student/dashboard");
          return;
        } else {
          toast.error(res.error || "Invalid credentials.");
        }
      } else if (selectedTab === "super-admin") {
        if (customSecret === "9900" || customSecret === "demo1234") {
          sessionStorage.setItem("ws_super_admin_unlocked", "true");
          toast.success("Super-Admin Console Unlocked!");
          router.push("/super-admin");
          return;
        } else {
          toast.error("Incorrect Master Passcode. Use 9900.");
        }
      }
    } catch {
      toast.error("Authentication check failed. Please use 1-click launch.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={edurexaHorizontal}
              alt="EDUREXA Logo"
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-[#0b2256] transition-colors"
            >
              Main Website
            </Link>
            <a
              href="https://wa.me/256758611414"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
            >
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>WhatsApp: +256 758 611 414</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO / INDICATION BANNER */}
      <section className="bg-gradient-to-b from-white to-slate-100/70 border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b2256]/10 text-[#0b2256] text-xs font-extrabold border border-[#0b2256]/20">
            <Sparkles className="size-3.5 text-[#f26522]" />
            <span>Interactive Demo Gateway • Free 4-Hour Live Testing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Test the Full System at <span className="text-[#f26522]">your-domain.com</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Experience how EDUREXA looks white-labeled for your school. Choose any workstation below to log in instantly. Test the <strong>Cashier Desk</strong> with thermal slips, <strong>School Admin</strong> controls, <strong>Teacher UNEB Grading</strong>, or the <strong>Student Results Station</strong> using pre-loaded test data.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Zero Registration Required</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Simulated Domain: yourschool.com</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Instant 1-Click Authentication</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSTATION SELECTION CARDS (Pure Flexbox Side-by-Side) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Select a Workstation to Test
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Click any <strong>Launch Demo</strong> button to sign in directly without typing.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <Building2 className="size-3.5 text-[#0b2256]" />
              <span>Tenant: Demo International Academy (UG)</span>
            </div>
          </div>

          {/* Cards Grid using Pure Flexbox (flex-wrap) */}
          <div className="flex flex-wrap gap-5">
            {stations.map((st) => {
              const Icon = st.icon;
              const isCurrentLoading = loadingRole === st.key;

              return (
                <div
                  key={st.key}
                  className="flex-1 min-w-[310px] sm:min-w-[340px] max-w-[420px] bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#0b2256]/30 transition-all"
                >
                  <div className="space-y-4">
                    {/* Card Top: Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl border ${st.color}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${st.badgeColor}`}>
                        {st.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-slate-900">
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {st.description}
                      </p>
                    </div>

                    {/* Capabilities Bullet points */}
                    <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                      {st.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{cap}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Demo Account Credentials Badge */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Login Email:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">{st.email}</span>
                          <button
                            onClick={() => handleCopy(st.email, `${st.key}-email`)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700"
                            title="Copy email"
                          >
                            {copiedKey === `${st.key}-email` ? (
                              <Check className="size-3 text-emerald-600" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{st.secretLabel}:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">{st.secretValue}</span>
                          <button
                            onClick={() => handleCopy(st.secretValue, `${st.key}-secret`)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700"
                            title="Copy secret"
                          >
                            {copiedKey === `${st.key}-secret` ? (
                              <Check className="size-3 text-emerald-600" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Launch Button */}
                  <div className="pt-6">
                    <Button
                      onClick={() => handleLaunch(st)}
                      disabled={isCurrentLoading}
                      className="w-full bg-[#0b2256] hover:bg-[#081a42] text-white rounded-xl text-xs font-bold h-11 shadow-sm gap-2 transition-all"
                    >
                      {isCurrentLoading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>Launch {st.title} Demo</span>
                          <ArrowRight className="size-4 text-[#f26522]" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. INTERACTIVE FRONT AUTHENTICATION FORM (Direct Station Tester) */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Interactive Authentication Console
              </h3>
              <p className="text-xs text-slate-500">
                Test the actual sign-in experience using your choice of role.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Laptop className="size-4 text-[#0b2256]" />
              <span>Live Authentication Engine</span>
            </div>
          </div>

          {/* Role Pill Switcher */}
          <div className="flex flex-wrap gap-2">
            {stations.map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => handleSelectTab(st.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedTab === st.key
                    ? "bg-[#0b2256] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{st.title}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleManualFormSubmit} className="max-w-2xl space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {selectedTab === "super-admin" ? "Super-Admin Account" : "Staff / Student Email"}
              </label>
              <Input
                type="text"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="e.g. cashier@yourschool.com"
                className="h-10 text-xs rounded-xl font-mono"
                required
              />
              <span className="text-[11px] text-slate-400">
                Shows your school domain: <code className="text-slate-600 font-bold">@yourschool.com</code>
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {selectedTab === "cashier" || selectedTab === "bursar"
                  ? "4-Digit Authorization PIN"
                  : selectedTab === "super-admin"
                  ? "Master Fleet PIN"
                  : "Password"}
              </label>
              <Input
                type="text"
                value={customSecret}
                onChange={(e) => setCustomSecret(e.target.value)}
                placeholder="Secret / PIN"
                className="h-10 text-xs rounded-xl font-mono"
                required
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                disabled={formSubmitting}
                className="bg-[#f26522] hover:bg-[#d95314] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-sm gap-2"
              >
                <span>{formSubmitting ? "Verifying..." : "Sign In & Test Station"}</span>
                <ArrowRight className="size-4" />
              </Button>

              <button
                type="button"
                onClick={() => {
                  const station = stations.find((s) => s.key === selectedTab);
                  if (station) handleLaunch(station);
                }}
                className="px-4 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Or 1-Click Quick Launch
              </button>
            </div>
          </form>
        </section>

        {/* 5. NOTICE & PRIVATE SANDBOX INQUIRY */}
        <section className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="size-3 text-emerald-400" />
              <span>Custom School Setup</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Need a Private 4-Hour Sandbox with Your Actual Classes & Fees?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our implementation team can provision a private staging sandbox pre-loaded with your actual school name, crest, class streams, and fee structures for an executive board demonstration.
            </p>
          </div>

          <a
            href="https://wa.me/256758611414?text=Hello%20EDUREXA!%20We%20would%20like%20to%20request%20a%20private%20custom%204-hour%20sandbox%20loaded%20with%20our%20school%20data."
            target="_blank"
            rel="noreferrer"
            className="shrink-0"
          >
            <Button className="bg-[#f26522] hover:bg-[#d95314] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-sm gap-2">
              <Phone className="size-4" />
              <span>WhatsApp +256 758 611 414</span>
            </Button>
          </a>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 EDUREXA. Smart Multi-Tenant School Management Ecosystem.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#0b2256]">Home</Link>
            <Link href="/documentation" className="hover:text-[#0b2256]">Documentation</Link>
            <a href="https://wa.me/256758611414" target="_blank" rel="noreferrer" className="text-[#f26522] font-semibold hover:underline">
              WhatsApp Support: +256 758 611 414
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
