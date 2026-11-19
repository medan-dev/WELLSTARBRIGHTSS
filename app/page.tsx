"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import edurexaLogo from "@/assets/edurexa-logo.png";
import edurexaMark from "@/assets/edurexa-mark.png";
import heroImg from "@/assets/hero-campus.jpg";
import aboutImg from "@/assets/about-students.jpg";
import {
  Building2,
  ShieldCheck,
  Layers,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  HardDrive,
  BarChart3,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Award,
  BookOpen,
  Server,
  Database,
  Sliders,
  DollarSign,
  Laptop,
  GraduationCap,
  TrendingUp,
  Receipt,
  UserCheck,
  ExternalLink,
  ChevronDown,
  MonitorCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DemoRole = "director" | "finance" | "academic" | "student" | "observability";

export default function EdurexaMarketingHome() {
  const [activeTab, setActiveTab] = useState<DemoRole>("director");
  const [campusesCount, setCampusesCount] = useState<number>(3);
  const [studentsCount, setStudentsCount] = useState<number>(2500);
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState({
    schoolName: "",
    contactPerson: "",
    phone: "",
    email: "",
    campuses: "2-5",
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  // Estimated annual leakage prevented calculation in Millions UGX
  const estimatedSavings = Math.round((studentsCount * 1800000 * 0.045) / 1000000);

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP ECOSYSTEM NOTIFICATION BANNER                                      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-blue-900/60 border-b border-blue-500/20 py-2.5 px-4 text-center text-xs font-medium text-blue-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="size-3.5 text-amber-400" />
            Live Client Proof of Concept:
          </span>
          <span>
            See how <strong>Wellstar Bright Educational Group</strong> operates 4,950+ students across 2 campuses on EDUREXA.
          </span>
          <Link
            href="/wellstar"
            className="inline-flex items-center gap-1 text-white underline hover:text-amber-300 font-bold ml-1"
          >
            Explore Wellstar Portal <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER                                                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#070d19]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with clean white presentation card */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-slate-200">
              <Image
                src={edurexaHorizontal}
                alt="EDUREXA"
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#visual-demo" className="hover:text-white transition-colors">
              Visual Product Demo
            </a>
            <a href="#wellstar-showcase" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Onboarded School</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Live #1
              </span>
            </a>
            <a href="#six-pillars" className="hover:text-white transition-colors">
              Ecosystem Pillars
            </a>
            <a href="#roi-calculator" className="hover:text-white transition-colors">
              Fee Recovery Calculator
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/super-admin" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex text-xs font-semibold rounded-xl border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 h-9"
              >
                <Lock className="size-3.5 mr-1 text-slate-400" />
                Super Admin
              </Button>
            </Link>

            <a href="#demo-form">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold px-4 h-9 shadow-md shadow-blue-600/30">
                Book Executive Demo
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mx-auto">
            <Sparkles className="size-4 text-amber-400" />
            <span>Empowering Schools. Simplifying Education.</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.12]">
            The Complete Digital Ecosystem for Modern Schools.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            <strong>EDUREXA</strong> is an intelligent, cloud-powered, multi-tenant school operating system designed to centralize administration, eliminate financial leakage, and connect leaders, teachers, students, and parents across all your campuses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a href="#demo-form" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold px-7 h-12 shadow-lg shadow-blue-600/30 gap-2">
                <span>Schedule a Boardroom Demo</span>
                <ArrowRight className="size-4" />
              </Button>
            </a>

            <a
              href="https://wa.me/256701116781?text=Hello%20EDUREXA%20Team,%20I%20would%20like%20to%20schedule%20an%20executive%20demonstration%20for%20our%20institution."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold px-6 h-12 gap-2"
              >
                <Phone className="size-4 text-emerald-400" />
                <span>Sales Hotline: +256 701 116 781</span>
              </Button>
            </a>

            <Link href="#wellstar-showcase" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-slate-300 hover:text-white rounded-xl text-sm font-semibold px-5 h-12 gap-2"
              >
                <Building2 className="size-4 text-blue-400" />
                <span>See Wellstar Case Study</span>
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">200</div>
              <div className="text-xs text-slate-400 mt-0.5">School Tenancy Capacity</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">20 Max</div>
              <div className="text-xs text-slate-400 mt-0.5">Campuses per School</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Unlimited</div>
              <div className="text-xs text-slate-400 mt-0.5">Students & Parents</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt; 1s</div>
              <div className="text-xs text-slate-400 mt-0.5">Continuous WAL RPO</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE VISUAL PRODUCT DEMO STUDIO (INTERACTIVE UI SHOWCASE)               */}
      {/* ========================================================================= */}
      <section id="visual-demo" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold px-3 py-1">
            VISUAL PRODUCT TOUR
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Every Role in Your School
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Click through each operational perspective to preview how EDUREXA simplifies school governance.
          </p>
        </div>

        {/* Perspective Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {[
            { id: "director", label: "Executive & Multi-Campus", icon: Building2 },
            { id: "finance", label: "Bursary & POS Cashier", icon: Receipt },
            { id: "academic", label: "Teacher & Gradebook", icon: BookOpen },
            { id: "student", label: "Student & Parent Life", icon: GraduationCap },
            { id: "observability", label: "Super Admin & Security", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DemoRole)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Preview Frame */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* 1. Director & Multi-Campus View */}
          {activeTab === "director" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
                    ROLE: SCHOOL DIRECTOR & BOARD
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Multi-Campus Executive Command Center
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch between up to 20 branches with consolidated revenue, staff payroll, and real-time student headcount.
                  </p>
                </div>
                <Link href="/admin/dashboard" target="_blank">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl h-8 gap-1.5">
                    <span>Live Admin Demo</span>
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Realistic Simulated UI Component */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Viewing Tenant:</span>
                    <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                      Wellstar Bright Educational Group
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Active Campus:</span>
                    <span className="font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      Mukono Main (Branch 01)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Term 1 Consolidated Fees</div>
                    <div className="text-2xl font-bold text-white font-mono">UGX 1.84B</div>
                    <div className="text-[10px] text-emerald-400">99.4% Collection Efficiency</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Active Enrolled Students</div>
                    <div className="text-2xl font-bold text-white font-mono">4,950</div>
                    <div className="text-[10px] text-slate-400">Across Mukono & Jinja</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Authorized Campuses</div>
                    <div className="text-2xl font-bold text-white font-mono">2 of 20</div>
                    <div className="text-[10px] text-blue-400">18 Expansion Slots Available</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Bursar & Finance View */}
          {activeTab === "finance" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    ROLE: BURSAR & CASHIER
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Offline-First POS Cashier & Double-Entry Accounting
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instant fee receipting, automatic thermal printing, bank reconciliations, and statutory tax calculations (URA PAYE, NSSF, WHT).
                  </p>
                </div>
                <Link href="/finance/bursar" target="_blank">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl h-8 gap-1.5">
                    <span>Live Bursar Demo</span>
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Direct Student Fee Receipting</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        Offline Sync Ready
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Student: Ronald Mutebi (S.4 Red)</span>
                        <span className="text-white font-mono">WBS/2026/0412</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Tuition & Boarding Fee:</span>
                        <span className="text-white font-mono">UGX 1,200,000</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Payment Method:</span>
                        <span className="text-emerald-400 font-semibold">Centenary Bank Slip #8910</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Automated Tax & Statutory Filing</span>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                        Uganda Tax Law Ready
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>URA PAYE Withholding:</span>
                        <span className="text-white font-mono">Tiered Schedule Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NSSF Contribution (15%):</span>
                        <span className="text-white font-mono">10% Employer + 5% Staff</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WHT on Supplies (6%):</span>
                        <span className="text-white font-mono">Automated Ledger Entry</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Academic & Teacher View */}
          {activeTab === "academic" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                    ROLE: HEADTEACHER & TEACHING STAFF
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Continuous Assessment & UNEB Report Cards
                  </h3>
                  <p className="text-xs text-slate-400">
                    Grading for both the new Lower Secondary Competence-Based Curriculum and traditional UNEB grading schedules.
                  </p>
                </div>
                <Link href="/teacher" target="_blank">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl h-8 gap-1.5">
                    <span>Teacher Demo</span>
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="text-xs text-slate-400 font-medium">Class: Senior 4 Blue &bull; Subject: Mathematics</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                        <th className="py-2 px-3">Student Name</th>
                        <th className="py-2 px-3">Mid-Term (30%)</th>
                        <th className="py-2 px-3">Projects (20%)</th>
                        <th className="py-2 px-3">End of Term (50%)</th>
                        <th className="py-2 px-3">Aggregated Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-white font-medium">Amina Nakato</td>
                        <td className="py-2.5 px-3">28/30</td>
                        <td className="py-2.5 px-3">19/20</td>
                        <td className="py-2.5 px-3">46/50</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">D1 (93%)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-white font-medium">David Mukasa</td>
                        <td className="py-2.5 px-3">24/30</td>
                        <td className="py-2.5 px-3">17/20</td>
                        <td className="py-2.5 px-3">42/50</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">D2 (83%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. Student & Parent View */}
          {activeTab === "student" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    ROLE: STUDENT & PARENT PORTAL
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Digital Gate Pass, Real-Time Marks & Biometric Meal Tracking
                  </h3>
                  <p className="text-xs text-slate-400">
                    Parents can check tuition balances, download stamped termly reports, and track daily dining hall attendance.
                  </p>
                </div>
                <Link href="/student" target="_blank">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-xl h-8 gap-1.5">
                    <span>Student Portal Demo</span>
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fee Clearance Status</div>
                  <div className="text-emerald-400 font-bold text-base flex items-center justify-center gap-1.5 mt-1">
                    <CheckCircle2 className="size-4" /> Cleared for Exams
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Pass #WBS-2026-T1-CLEARED</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Latest Attendance</div>
                  <div className="text-white font-bold text-base mt-1">100% Present</div>
                  <div className="text-[11px] text-emerald-400">64 of 64 Days Recorded</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Dining Hall Meals</div>
                  <div className="text-cyan-400 font-bold text-base mt-1">Active Plan</div>
                  <div className="text-[11px] text-slate-500 font-mono">Breakfast, Lunch & Supper</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Super Admin & Security View */}
          {activeTab === "observability" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                    ROLE: EDUREXA SUPER ADMIN
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Cluster Reliability, Disaster Recovery & Multi-Tenant Provisioning
                  </h3>
                  <p className="text-xs text-slate-400">
                    Continuous WAL Point-in-Time Recovery, emergency branch lockdown, and zero-downtime campus migration.
                  </p>
                </div>
                <Link href="/super-admin" target="_blank">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-xl h-8 gap-1.5">
                    <span>Console (PIN: 9900)</span>
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-400 font-medium">PostgreSQL Serverless Latency</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono">~38ms</div>
                  <div className="text-[10px] text-slate-500">Neon Multi-Region Read Replicas</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-400 font-medium">Disaster Recovery (PITR)</div>
                  <div className="text-xl font-bold text-white font-mono">&lt; 1 Second</div>
                  <div className="text-[10px] text-emerald-400">Continuous WAL Streaming Active</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-400 font-medium">Integrity Checksums</div>
                  <div className="text-xl font-bold text-white font-mono">SHA-256</div>
                  <div className="text-[10px] text-slate-500">Cryptographically Signed Exports</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SPOTLIGHT ONBOARDED SCHOOL #1: WELLSTAR BRIGHT EDUCATIONAL GROUP        */}
      {/* ========================================================================= */}
      <section id="wellstar-showcase" className="py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1">
                LIVE PRODUCTION ONBOARDED SCHOOL #1
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                See How Wellstar Bright Educational Group Runs on EDUREXA
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Wellstar Bright Senior School is our live flagship tenant, proving that EDUREXA unifies multi-campus administration, eliminates cash leakage, and delivers instant reports to thousands of parents.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/wellstar" target="_blank">
                <Button className="bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold h-10 px-4 gap-1.5 shadow-sm">
                  <span>Visit Wellstar Public Portal</span>
                  <ExternalLink className="size-3.5 text-slate-700" />
                </Button>
              </Link>

              <Link href="/admin/dashboard" target="_blank">
                <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 rounded-xl text-xs font-semibold h-10 px-4 gap-1.5">
                  <span>Explore School Admin Portal</span>
                  <ArrowRight className="size-3.5 text-blue-400" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Flagship Case Study Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="text-xs uppercase font-mono tracking-wider text-blue-400 font-bold">
                  TENANT ID: WEG-2026 &bull; UGANDA
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Wellstar Bright Educational Group
                </h3>
                <p className="text-xs text-slate-400">
                  Headquartered in Mukono with secondary campuses serving both O-Level & A-Level day and boarding students.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-xl font-bold text-white font-mono">4,950+</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Enrolled Students</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-xl font-bold text-white font-mono">2 Campuses</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Mukono & Jinja</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-xl font-bold text-emerald-400 font-mono">99.4%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Fee Collection Rate</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>Integrated double-entry chart of accounts reconciling banking slips with cash receipts.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>Biometric meal entitlement tokens preventing unauthorized dining hall consumption.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>Direct parent WhatsApp billing alerts keeping guardians updated on fees instantly.</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Jump Box */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                TRY THE LIVE WELLSTAR SANDBOX
              </div>

              <div className="space-y-2">
                <Link
                  href="/wellstar"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 transition-colors text-xs"
                >
                  <span className="font-semibold text-white">1. Public School Website & Admissions</span>
                  <ChevronRight className="size-4 text-slate-400" />
                </Link>

                <Link
                  href="/student"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 transition-colors text-xs"
                >
                  <span className="font-semibold text-white">2. Student & Parent Clearance Portal</span>
                  <ChevronRight className="size-4 text-slate-400" />
                </Link>

                <Link
                  href="/admin/dashboard"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 transition-colors text-xs"
                >
                  <span className="font-semibold text-white">3. Headteacher & Admin Management</span>
                  <ChevronRight className="size-4 text-slate-400" />
                </Link>

                <Link
                  href="/teacher"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 transition-colors text-xs"
                >
                  <span className="font-semibold text-white">4. Teacher Marks & Academic Entry</span>
                  <ChevronRight className="size-4 text-slate-400" />
                </Link>
              </div>

              <p className="text-[11px] text-slate-500 leading-normal">
                Want to onboard your school group with the same technology? Request an executive demo below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SIX CORE BRAND VALUES (PILLARS)                                        */}
      {/* ========================================================================= */}
      <section id="six-pillars" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold px-3 py-1">
            CORE FOUNDATION
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Six Pillars of the EDUREXA Ecosystem
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Engineered specifically for leading schools, colleges, and multi-campus conglomerates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Innovation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-11 rounded-xl bg-blue-500/10 text-blue-400 grid place-items-center font-bold">
              <Sparkles className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">Innovation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cloud-native architecture supporting automated fee schedules, smart biometric meal cards, and automated term billing without manual spreadsheet chaos.
            </p>
          </div>

          {/* 2. Excellence */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-11 rounded-xl bg-indigo-500/10 text-indigo-400 grid place-items-center font-bold">
              <Award className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">Excellence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Double-entry chart of accounts, automated statutory tax filing (URA PAYE, NSSF 15%, WHT 6%), and audited income statements ready for school board reviews.
            </p>
          </div>

          {/* 3. Efficiency */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-400 grid place-items-center font-bold">
              <Layers className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">Efficiency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-campus management supporting up to 20 branch campuses per school group with one-click executive switching and consolidated financial rollups.
            </p>
          </div>

          {/* 4. Connectivity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-11 rounded-xl bg-cyan-500/10 text-cyan-400 grid place-items-center font-bold">
              <Globe className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">Connectivity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect directors, bursars, headteachers, students, and parents seamlessly with automated WhatsApp alerts and instant payment receipting.
            </p>
          </div>

          {/* 5. Intelligence */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-11 rounded-xl bg-purple-500/10 text-purple-400 grid place-items-center font-bold">
              <BarChart3 className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Predictive fee arrears analytics, automated deficit alerts, and enrollment trends to protect institutional cash flow before term start.
            </p>
          </div>

          {/* 6. Reliability */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-11 rounded-xl bg-teal-500/10 text-teal-400 grid place-items-center font-bold">
              <HardDrive className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">Reliability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bank-grade continuous WAL Point-in-Time Recovery (RPO &lt; 1s), zero-loss offline POS cash registers, and immutable SHA-256 backup snapshots.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INSTITUTIONAL REVENUE LEAKAGE CALCULATOR                               */}
      {/* ========================================================================= */}
      <section id="roi-calculator" className="py-16 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Calculate Your Institutional Fee Recovery
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              See how much revenue leakage EDUREXA prevents with double-entry ledgers and offline POS registers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Number of Campuses:</span>
                  <span className="text-blue-400 font-mono">{campusesCount} Campuses</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={campusesCount}
                  onChange={(e) => setCampusesCount(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Total Students (All Campuses):</span>
                  <span className="text-blue-400 font-mono">{studentsCount.toLocaleString()} Students</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={25000}
                  step={500}
                  value={studentsCount}
                  onChange={(e) => setStudentsCount(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider text-blue-400">
                  ESTIMATED REVENUE LEAKAGE PREVENTED ANNUALLY
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  UGX {estimatedSavings.toLocaleString()} Million+
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Calculated based on eliminating manual receipting fraud and uncollected fee arrears.
                </div>
              </div>
              <a href="#demo-form">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-5 h-11 text-xs">
                  Protect Your School's Revenue
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. EXECUTIVE DEMO BOOKING FORM                                            */}
      {/* ========================================================================= */}
      <section id="demo-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1">
            ONBOARDING & DEMOS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Schedule an Executive Boardroom Demonstration
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Experience the multi-campus hierarchy, offline cashier POS registers, and instant financial reports live.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {bookingSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 grid place-items-center mx-auto">
                <Check className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-white">Demo Request Received!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Thank you, <strong>{bookingData.contactPerson}</strong>. Our enterprise team will contact you on WhatsApp ({bookingData.phone}) within 2 hours to confirm your demonstration.
              </p>
              <a
                href={`https://wa.me/256701116781?text=Hello%20EDUREXA,%20I%20just%20submitted%20a%20demo%20request%20for%20${encodeURIComponent(
                  bookingData.schoolName
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-11 px-5 mt-2 text-xs">
                  Chat With Enterprise Team on WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-200">School / Group Name *</Label>
                  <Input
                    placeholder="e.g. St. Lawrence Educational Group"
                    value={bookingData.schoolName}
                    onChange={(e) => setBookingData({ ...bookingData, schoolName: e.target.value })}
                    required
                    className="h-10 rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-200">Your Full Name & Title *</Label>
                  <Input
                    placeholder="e.g. Dr. Ronald Mukasa (Director)"
                    value={bookingData.contactPerson}
                    onChange={(e) => setBookingData({ ...bookingData, contactPerson: e.target.value })}
                    required
                    className="h-10 rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-200">WhatsApp / Direct Phone *</Label>
                  <Input
                    placeholder="+256 701 116 781"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    required
                    className="h-10 rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-200">Official Email *</Label>
                  <Input
                    type="email"
                    placeholder="director@school.sc.ug"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    required
                    className="h-10 rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-200">Campuses to Onboard (Up to 20) *</Label>
                <select
                  value={bookingData.campuses}
                  onChange={(e) => setBookingData({ ...bookingData, campuses: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="1">1 Single Campus</option>
                  <option value="2-5">2 to 5 Campuses (Most Common)</option>
                  <option value="6-10">6 to 10 Campuses</option>
                  <option value="11-20">11 to 20 Campuses (Enterprise Conglomerate Tier)</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 text-xs font-bold shadow-md shadow-blue-600/30"
              >
                Confirm Executive Demo Request
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl px-2.5 py-1 shadow-sm">
              <Image src={edurexaHorizontal} alt="EDUREXA Logo" className="h-7 w-auto object-contain" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">EDUREXA</span>
              <p className="text-[11px] text-slate-400">The Complete Digital Ecosystem for Modern Schools.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/super-admin" className="hover:text-white transition-colors">
              Super Admin Console
            </Link>
            <Link href="/wellstar" className="hover:text-white transition-colors">
              Wellstar Flagship School
            </Link>
            <a
              href="https://wa.me/256701116781"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 font-semibold hover:underline"
            >
              WhatsApp Sales: +256 701 116 781
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
