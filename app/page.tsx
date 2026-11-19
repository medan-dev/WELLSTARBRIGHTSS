"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import edurexaLogo from "@/assets/edurexa-logo.png";
import edurexaMark from "@/assets/edurexa-mark.png";
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
  Bed,
  Bus,
  Library,
  UserPlus,
  Clock,
  Printer,
  Smartphone,
  ShieldAlert,
  FolderSync,
  HelpCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DemoRole = "director" | "finance" | "academic" | "student" | "observability";
type ModuleCategory = "academic" | "finance" | "logistics" | "communication";

export default function EdurexaMarketingHome() {
  const [activeTab, setActiveTab] = useState<DemoRole>("director");
  const [activeModuleCat, setActiveModuleCat] = useState<ModuleCategory>("academic");
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#f26522] selection:text-white antialiased">
      {/* ========================================================================= */}
      {/* 1. TOP ECOSYSTEM NOTIFICATION BANNER                                      */}
      {/* ========================================================================= */}
      <div className="bg-[#0b2256] text-white py-2.5 px-4 text-center text-xs font-medium border-b border-[#081a42]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <Sparkles className="size-3.5" />
            Live Client Proof of Concept:
          </span>
          <span className="text-slate-200">
            See how <strong>Wellstar Bright Educational Group</strong> manages 4,950+ students across 2 campuses on EDUREXA.
          </span>
          <Link
            href="/wellstar"
            className="inline-flex items-center gap-1 text-white underline hover:text-amber-300 font-bold ml-1 transition-colors"
          >
            Explore Wellstar Portal <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER (Clean White Navbar, Logo Sits Naturally With No Box)      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo - Sits directly on white background with NO surrounding box */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={edurexaHorizontal}
              alt="EDUREXA - Empowering Schools. Simplifying Education."
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#modules-suite" className="hover:text-[#0b2256] transition-colors">
              Modules & Capabilities
            </a>
            <a href="#visual-demo" className="hover:text-[#0b2256] transition-colors">
              Visual Tour
            </a>
            <a href="#wellstar-showcase" className="hover:text-[#0b2256] transition-colors flex items-center gap-1.5">
              <span>Onboarded School</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                Wellstar #1
              </span>
            </a>
            <a href="#pricing" className="hover:text-[#0b2256] transition-colors">
              Pricing Plans
            </a>
            <a href="#comparison" className="hover:text-[#0b2256] transition-colors">
              Why EDUREXA
            </a>
            <a href="#roi-calculator" className="hover:text-[#0b2256] transition-colors">
              Fee Calculator
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/super-admin" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex text-xs font-semibold rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-9"
              >
                <Lock className="size-3.5 mr-1.5 text-slate-500" />
                Super Admin
              </Button>
            </Link>

            <a href="#demo-form">
              <Button className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg text-xs font-bold px-4 h-9 shadow-sm transition-colors">
                Book Executive Demo
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Bright, Clean, High-Contrast Enterprise Light Theme)     */}
      {/* ========================================================================= */}
      <section className="relative pt-14 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center relative z-10">
          <Badge className="bg-orange-50 text-[#f26522] border border-orange-200/80 text-xs font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mx-auto shadow-2xs">
            <Sparkles className="size-3.5 text-[#f26522]" />
            <span>Empowering Schools. Simplifying Education.</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0b2256] tracking-tight max-w-4xl mx-auto leading-[1.12]">
            The Complete Digital Operating System for Modern Schools.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            <strong>EDUREXA</strong> is an intelligent, cloud-powered, multi-tenant school operating system designed to centralize administration, eliminate cashier financial leakage, and connect leaders, teachers, students, and parents across all your campuses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a href="#demo-form" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg text-sm font-bold px-7 h-12 shadow-sm gap-2 transition-all">
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
                className="w-full sm:w-auto border-slate-300 bg-white hover:bg-slate-50 text-[#0b2256] rounded-lg text-sm font-semibold px-6 h-12 gap-2 shadow-2xs"
              >
                <Phone className="size-4 text-emerald-600" />
                <span>Sales Hotline: +256 701 116 781</span>
              </Button>
            </a>

            <Link href="#wellstar-showcase" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-slate-700 hover:text-[#0b2256] hover:bg-slate-100 rounded-lg text-sm font-semibold px-5 h-12 gap-2"
              >
                <Building2 className="size-4 text-[#0b2256]" />
                <span>See Wellstar Case Study</span>
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200">
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b2256]">200</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">School Tenancy Capacity</div>
            </div>
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b2256]">20 Max</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Campuses per School</div>
            </div>
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b2256]">Unlimited</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Students & Parents</div>
            </div>
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">&lt; 1s</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Continuous WAL RPO</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COMPREHENSIVE SCHOOL MODULES SUITE (INSPIRED BY SCHOOLHIVE & UPGRADED)   */}
      {/* ========================================================================= */}
      <section id="modules-suite" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-blue-50 text-[#0b2256] border border-blue-200 text-xs font-semibold px-3 py-1">
            EVERYTHING MODERN SCHOOLS NEED
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
            Complete Institutional Operations Suite
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            From student registration and sibling billing to UNEB exams, dormitories, buses, and financial ledgers.
          </p>
        </div>

        {/* Module Category Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {[
            { id: "academic", label: "Academics & SIS", icon: BookOpen },
            { id: "finance", label: "Fees & Cashier POS", icon: Receipt },
            { id: "logistics", label: "Hostels, Buses & Meals", icon: Bed },
            { id: "communication", label: "WhatsApp, SMS & Portals", icon: Smartphone },
          ].map((cat) => {
            const Icon = cat.icon;
            const active = activeModuleCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveModuleCat(cat.id as ModuleCategory)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                  active
                    ? "bg-[#0b2256] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                )}
              >
                <Icon className="size-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeModuleCat === "academic" && (
            <>
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-blue-50 text-[#0b2256] grid place-items-center">
                  <UserPlus className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Student Information System (SIS)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Comprehensive student profiles tracking Learner Identification Numbers (LIN), UNEB index numbers, health/medical notes, and emergency guardian contacts.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-indigo-50 text-indigo-700 grid place-items-center">
                  <Users className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Sibling Linkage & Family Accounts</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Link multiple brothers and sisters under one single parent/guardian account for consolidated fee statements and unified attendance monitoring.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-purple-50 text-purple-700 grid place-items-center">
                  <GraduationCap className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">UNEB & New Lower Secondary Curriculum</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Native grading for both Competence-Based activities of integration (Score 1-3) and traditional O-Level/A-Level UNEB schedules with auto-generated report cards.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center">
                  <Clock className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Class Timetabling & Teacher Routines</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatic conflict-free scheduling for subject periods, lab sessions, and teacher workload allocations across multiple campus streams.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-cyan-50 text-cyan-700 grid place-items-center">
                  <UserCheck className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Digital Daily & Period Attendance</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  One-tap morning roll-call, period attendance, and boarding evening check-ins. Absentee alerts are automatically queued for parents.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-amber-50 text-[#f26522] grid place-items-center">
                  <Library className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Library Catalog & Book Tracking</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Barcode/ISBN cataloging, book checkout logs, overdue book fines, and reading curriculum tracking for secondary school libraries.
                </p>
              </div>
            </>
          )}

          {activeModuleCat === "finance" && (
            <>
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center">
                  <Printer className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Offline-First Cashier POS Registers</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receipt cash, cheque, and bank deposits instantly at the school bursary even during internet blackouts. Automatic thermal slip printing with tamper-proof serials.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-blue-50 text-[#0b2256] grid place-items-center">
                  <Building2 className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Bank Statement Reconciliations</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Auto-match bank deposits from Centenary Bank, Stanbic, DFCU, and Equity Bank against student fee accounts to eliminate unverified payment claims.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-orange-50 text-[#f26522] grid place-items-center">
                  <DollarSign className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Automated Uganda Tax & Statutory Filing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatic deduction of URA PAYE monthly tax tables, NSSF 15% (10% employer + 5% employee), and Withholding Tax (6% WHT) on school supply vouchers.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-amber-50 text-amber-700 grid place-items-center">
                  <BarChart3 className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Multi-Tier Fee Structure Management</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Configure custom fee packages for day vs boarding students, science functional fees, development levies, uniform sets, and remedial clinics.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-red-50 text-red-600 grid place-items-center">
                  <ShieldAlert className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Fee Arrears & Deficit Protection</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Visual aging reports showing 30, 60, and 90-day outstanding arrears per class. Generate automated fee reminder letters with single-click batch printing.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-indigo-50 text-indigo-700 grid place-items-center">
                  <Receipt className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Double-Entry Financial Ledgers</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Audited chart of accounts tracking school operational expenditures, teacher salary advances, supplier invoices, and capital campus development projects.
                </p>
              </div>
            </>
          )}

          {activeModuleCat === "logistics" && (
            <>
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-blue-50 text-[#0b2256] grid place-items-center">
                  <Bed className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Hostel & Dormitory Bed Allocations</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track dormitory house occupancy, bed and cubicle allocations, matron and boarding master logs, and sickbay medical permissions.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-amber-50 text-amber-700 grid place-items-center">
                  <Bus className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Transport Logistics & Bus Routes</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage school vans and buses, assign pickup stages and routes, track driver credentials, and record vehicle maintenance inspections.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center">
                  <CheckCircle2 className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Dining Hall Biometric Meal Tracking</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verify student meal entitlement tokens during breakfast, lunch, and supper to prevent unauthorized food consumption and cut kitchen waste.
                </p>
              </div>
            </>
          )}

          {activeModuleCat === "communication" && (
            <>
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center">
                  <Smartphone className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">WhatsApp & SMS Notification Gateway</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instant mobile notifications sent directly to parents for fee payment confirmations, emergency announcements, and end-of-term marks releases.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-blue-50 text-[#0b2256] grid place-items-center">
                  <Laptop className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Dedicated Parent & Guardian Portal</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parents can log in from any phone or computer to review their child's real-time attendance, fee balance, and download stamped digital report cards.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="size-10 rounded-lg bg-orange-50 text-[#f26522] grid place-items-center">
                  <ShieldCheck className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Digital Exam Clearance Gate Passes</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated generation of QR-coded exam permits once fee thresholds are satisfied, eliminating manual paperwork queues on opening day.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VISUAL PRODUCT STUDIO (INTERACTIVE UI PREVIEW IN LIGHT THEME)          */}
      {/* ========================================================================= */}
      <section id="visual-demo" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-blue-100 text-[#0b2256] border border-blue-200 text-xs font-semibold px-3 py-1">
              VISUAL PRODUCT TOUR
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              Engineered for Every Role in Your School
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
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
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                    active
                      ? "bg-[#0b2256] text-white shadow-sm"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Visual Preview Frame in Crisp Light Canvas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* 1. Director & Multi-Campus View */}
            {activeTab === "director" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#f26522] uppercase tracking-wider font-bold">
                      ROLE: SCHOOL DIRECTOR & BOARD
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      Multi-Campus Executive Command Center
                    </h3>
                    <p className="text-xs text-slate-500">
                      Switch between up to 20 branches with consolidated revenue, staff payroll, and real-time student headcount.
                    </p>
                  </div>
                  <Link href="/admin/dashboard" target="_blank">
                    <Button size="sm" className="bg-[#0b2256] hover:bg-[#071638] text-white text-xs rounded-lg h-8 gap-1.5">
                      <span>Live Admin Demo</span>
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Viewing Tenant:</span>
                      <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                        Wellstar Bright Educational Group
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Active Campus:</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
                        Mukono Main (Branch 01)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1 shadow-2xs">
                      <div className="text-[11px] text-slate-500 font-medium">Term 1 Consolidated Fees</div>
                      <div className="text-2xl font-bold text-slate-900 font-mono">UGX 1.84B</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">99.4% Collection Efficiency</div>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1 shadow-2xs">
                      <div className="text-[11px] text-slate-500 font-medium">Active Enrolled Students</div>
                      <div className="text-2xl font-bold text-slate-900 font-mono">4,950</div>
                      <div className="text-[10px] text-slate-500">Across Mukono & Jinja</div>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1 shadow-2xs">
                      <div className="text-[11px] text-slate-500 font-medium">Authorized Campuses</div>
                      <div className="text-2xl font-bold text-[#0b2256] font-mono">2 of 20</div>
                      <div className="text-[10px] text-[#f26522] font-semibold">18 Expansion Slots Available</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Bursar & Finance View */}
            {activeTab === "finance" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-700 uppercase tracking-wider font-bold">
                      ROLE: BURSAR & CASHIER
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      Offline-First POS Cashier & Double-Entry Accounting
                    </h3>
                    <p className="text-xs text-slate-500">
                      Instant fee receipting, automatic thermal printing, bank reconciliations, and statutory tax calculations (URA PAYE, NSSF, WHT).
                    </p>
                  </div>
                  <Link href="/finance/bursar" target="_blank">
                    <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs rounded-lg h-8 gap-1.5">
                      <span>Live Bursar Demo</span>
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">Direct Student Fee Receipting</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          Offline Sync Ready
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Student: Ronald Mutebi (S.4 Red)</span>
                          <span className="text-slate-900 font-mono font-semibold">WBS/2026/0412</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Tuition & Boarding Fee:</span>
                          <span className="text-slate-900 font-mono font-bold">UGX 1,200,000</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Payment Method:</span>
                          <span className="text-emerald-700 font-semibold">Centenary Bank Slip #8910</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">Automated Tax & Statutory Filing</span>
                        <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                          Uganda Tax Law Ready
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>URA PAYE Withholding:</span>
                          <span className="text-slate-900 font-mono font-semibold">Tiered Schedule Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span>NSSF Contribution (15%):</span>
                          <span className="text-slate-900 font-mono font-semibold">10% Employer + 5% Staff</span>
                        </div>
                        <div className="flex justify-between">
                          <span>WHT on Supplies (6%):</span>
                          <span className="text-slate-900 font-mono font-semibold">Automated Ledger Entry</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Academic & Teacher View */}
            {activeTab === "academic" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#0b2256] uppercase tracking-wider font-bold">
                      ROLE: HEADTEACHER & TEACHING STAFF
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      Continuous Assessment & UNEB Report Cards
                    </h3>
                    <p className="text-xs text-slate-500">
                      Grading for both the new Lower Secondary Competence-Based Curriculum and traditional UNEB grading schedules.
                    </p>
                  </div>
                  <Link href="/teacher" target="_blank">
                    <Button size="sm" className="bg-[#0b2256] hover:bg-[#071638] text-white text-xs rounded-lg h-8 gap-1.5">
                      <span>Teacher Demo</span>
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="text-xs text-slate-600 font-medium">Class: Senior 4 Blue &bull; Subject: Mathematics</div>
                  <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Mid-Term (30%)</th>
                          <th className="py-2.5 px-3">Projects (20%)</th>
                          <th className="py-2.5 px-3">End of Term (50%)</th>
                          <th className="py-2.5 px-3">Aggregated Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        <tr>
                          <td className="py-2.5 px-3 font-sans text-slate-900 font-semibold">Amina Nakato</td>
                          <td className="py-2.5 px-3 text-slate-700">28/30</td>
                          <td className="py-2.5 px-3 text-slate-700">19/20</td>
                          <td className="py-2.5 px-3 text-slate-700">46/50</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">D1 (93%)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-sans text-slate-900 font-semibold">David Mukasa</td>
                          <td className="py-2.5 px-3 text-slate-700">24/30</td>
                          <td className="py-2.5 px-3 text-slate-700">17/20</td>
                          <td className="py-2.5 px-3 text-slate-700">42/50</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">D2 (83%)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Student & Parent View */}
            {activeTab === "student" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#f26522] uppercase tracking-wider font-bold">
                      ROLE: STUDENT & PARENT PORTAL
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      Digital Gate Pass, Real-Time Marks & Biometric Meal Tracking
                    </h3>
                    <p className="text-xs text-slate-500">
                      Parents can check tuition balances, download stamped termly reports, and track daily dining hall attendance.
                    </p>
                  </div>
                  <Link href="/student" target="_blank">
                    <Button size="sm" className="bg-[#f26522] hover:bg-[#d95314] text-white text-xs rounded-lg h-8 gap-1.5">
                      <span>Student Portal Demo</span>
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white border border-slate-200 p-4 rounded-lg text-center space-y-1 shadow-2xs">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Fee Clearance Status</div>
                    <div className="text-emerald-700 font-bold text-base flex items-center justify-center gap-1.5 mt-1">
                      <CheckCircle2 className="size-4" /> Cleared for Exams
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">Pass #WBS-2026-T1-CLEARED</div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-lg text-center space-y-1 shadow-2xs">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Latest Attendance</div>
                    <div className="text-slate-900 font-bold text-base mt-1">100% Present</div>
                    <div className="text-[11px] text-emerald-700 font-medium">64 of 64 Days Recorded</div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-lg text-center space-y-1 shadow-2xs">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Dining Hall Meals</div>
                    <div className="text-[#0b2256] font-bold text-base mt-1">Active Plan</div>
                    <div className="text-[11px] text-slate-400 font-mono">Breakfast, Lunch & Supper</div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Super Admin & Security View */}
            {activeTab === "observability" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-purple-700 uppercase tracking-wider font-bold">
                      ROLE: EDUREXA SUPER ADMIN
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      Cluster Reliability, Disaster Recovery & Multi-Tenant Provisioning
                    </h3>
                    <p className="text-xs text-slate-500">
                      Continuous WAL Point-in-Time Recovery, emergency branch lockdown, and zero-downtime campus migration.
                    </p>
                  </div>
                  <Link href="/super-admin" target="_blank">
                    <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-white text-xs rounded-lg h-8 gap-1.5">
                      <span>Console (PIN: 9900)</span>
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1 shadow-2xs">
                    <div className="text-[10px] text-slate-500 font-medium">PostgreSQL Serverless Latency</div>
                    <div className="text-xl font-bold text-emerald-700 font-mono">~38ms</div>
                    <div className="text-[10px] text-slate-400">Neon Multi-Region Read Replicas</div>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1 shadow-2xs">
                    <div className="text-[10px] text-slate-500 font-medium">Disaster Recovery (PITR)</div>
                    <div className="text-xl font-bold text-slate-900 font-mono">&lt; 1 Second</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Continuous WAL Streaming Active</div>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1 shadow-2xs">
                    <div className="text-[10px] text-slate-500 font-medium">Integrity Checksums</div>
                    <div className="text-xl font-bold text-slate-900 font-mono">SHA-256</div>
                    <div className="text-[10px] text-slate-400">Cryptographically Signed Exports</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SPOTLIGHT ONBOARDED SCHOOL #1: WELLSTAR BRIGHT EDUCATIONAL GROUP        */}
      {/* ========================================================================= */}
      <section id="wellstar-showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1">
              LIVE PRODUCTION ONBOARDED SCHOOL #1
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              See How Wellstar Bright Educational Group Runs on EDUREXA
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Wellstar Bright Senior School is our live flagship tenant, proving that EDUREXA unifies multi-campus administration, eliminates cash leakage, and delivers instant reports to thousands of parents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/wellstar" target="_blank">
              <Button className="bg-[#0b2256] hover:bg-[#071638] text-white rounded-lg text-xs font-bold h-10 px-4 gap-1.5 shadow-sm">
                <span>Visit Wellstar Public Portal</span>
                <ExternalLink className="size-3.5 text-slate-300" />
              </Button>
            </Link>

            <Link href="/admin/dashboard" target="_blank">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold h-10 px-4 gap-1.5">
                <span>Explore School Admin Portal</span>
                <ArrowRight className="size-3.5 text-[#0b2256]" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Flagship Case Study Card in Crisp White */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <div className="text-xs uppercase font-mono tracking-wider text-[#f26522] font-bold">
                TENANT ID: WEG-2026 &bull; MUKONO & JINJA, UGANDA
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Wellstar Bright Educational Group
              </h3>
              <p className="text-xs text-slate-500">
                Headquartered in Mukono with secondary campuses serving O-Level & A-Level day and boarding students.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xl font-bold text-slate-900 font-mono">4,950+</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Enrolled Students</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xl font-bold text-slate-900 font-mono">2 Campuses</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Mukono & Jinja</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xl font-bold text-emerald-700 font-mono">99.4%</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Fee Collection Rate</div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Integrated double-entry chart of accounts reconciling banking slips with cash receipts.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Biometric meal entitlement tokens preventing unauthorized dining hall consumption.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Direct parent WhatsApp billing alerts keeping guardians updated on fees instantly.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              TRY THE LIVE WELLSTAR SANDBOX
            </div>

            <div className="space-y-2">
              <Link
                href="/wellstar"
                className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors text-xs shadow-2xs"
              >
                <span className="font-semibold text-slate-900">1. Public School Website & Admissions</span>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>

              <Link
                href="/student"
                className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors text-xs shadow-2xs"
              >
                <span className="font-semibold text-slate-900">2. Student & Parent Clearance Portal</span>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/dashboard"
                className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors text-xs shadow-2xs"
              >
                <span className="font-semibold text-slate-900">3. Headteacher & Admin Management</span>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>

              <Link
                href="/teacher"
                className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors text-xs shadow-2xs"
              >
                <span className="font-semibold text-slate-900">4. Teacher Marks & Academic Entry</span>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal pt-1">
              Want to onboard your school group with the same technology? Request an executive demo below.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TRANSPARENT PRICING PLANS (MODELED AFTER SCHOOLHIVE TIERING)            */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge className="bg-orange-50 text-[#f26522] border border-orange-200 text-xs font-semibold px-3 py-1">
              TRANSPARENT & SCALABLE TIERS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              Predictable Pricing Built for School Growth
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Choose the package tailored to your student population and campus network size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1: Standard Campus */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">STARTER</span>
                <h3 className="text-xl font-bold text-slate-900">Standard Campus</h3>
                <p className="text-xs text-slate-500">Perfect for single-campus schools modernizing paper registers.</p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#0b2256]">UGX 850,000</div>
                <div className="text-xs text-slate-500">per term &bull; up to 600 students</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>1 Single Campus Partition</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Student Information System (SIS) & LIN</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Daily & Period Roll Call Attendance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>UNEB & Competency Report Cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Core Fee Billing & Receipting</span>
                </li>
              </ul>

              <a href="#demo-form">
                <Button variant="outline" className="w-full text-xs font-bold rounded-lg border-slate-300 h-10 hover:bg-slate-50">
                  Select Starter Plan
                </Button>
              </a>
            </div>

            {/* Tier 2: Professional School (Featured) */}
            <div className="bg-white border-2 border-[#f26522] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f26522] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                MOST POPULAR
              </span>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f26522]">GROWTH</span>
                <h3 className="text-xl font-bold text-slate-900">Professional School</h3>
                <p className="text-xs text-slate-500">Comprehensive suite with offline POS and parent engagement.</p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#0b2256]">UGX 1,750,000</div>
                <div className="text-xs text-slate-500">per term &bull; up to 2,500 students &bull; 1–3 campuses</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Up to 3 Campus Branches</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Offline POS Cashier Desks & Thermal Receipts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Parent Portal & WhatsApp Fee Receipts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Sibling Family Account Consolidation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Hostel & Bus Transport Route Logistics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Biometric Dining Hall Meal Tokens</span>
                </li>
              </ul>

              <a href="#demo-form">
                <Button className="w-full text-xs font-bold rounded-lg bg-[#f26522] hover:bg-[#d95314] text-white h-10 shadow-sm">
                  Get Started with Professional
                </Button>
              </a>
            </div>

            {/* Tier 3: Enterprise Conglomerate */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CONGLOMERATE</span>
                <h3 className="text-xl font-bold text-slate-900">Enterprise Multi-Campus</h3>
                <p className="text-xs text-slate-500">For multi-campus groups, diocesan networks, and institutional chains.</p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#0b2256]">Custom Quote</div>
                <div className="text-xs text-slate-500">up to 20 campuses &bull; unlimited students</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Hard Limit: 20 Campuses per Organization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Consolidated Executive Multi-Campus Hierarchy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Automated URA PAYE, NSSF 15%, WHT 6% Tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Continuous WAL Point-in-Time Recovery (&lt; 1s RPO)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Cryptographic SHA-256 Signed Backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Onsite Implementation Engineer & 24/7 SLA</span>
                </li>
              </ul>

              <a href="#demo-form">
                <Button variant="outline" className="w-full text-xs font-bold rounded-lg border-slate-300 h-10 hover:bg-slate-50">
                  Request Boardroom Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. COMPARISON MATRIX: WHY EDUREXA VS TRADITIONAL STANDALONE SIS            */}
      {/* ========================================================================= */}
      <section id="comparison" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-blue-50 text-[#0b2256] border border-blue-200 text-xs font-semibold px-3 py-1">
            STRATEGIC ADVANTAGE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
            Why Modern Institutions Choose EDUREXA
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Compare how traditional single-school desktop packages stack up against EDUREXA's enterprise cloud ecosystem.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3.5 px-6">Capability & Architecture</th>
                  <th className="py-3.5 px-6 text-slate-500">Traditional Single SIS / Excel</th>
                  <th className="py-3.5 px-6 text-[#0b2256] font-bold bg-blue-50/50">EDUREXA Smart SaaS Ecosystem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">Multi-Campus Hierarchy</td>
                  <td className="py-3.5 px-6 text-slate-500">Single school only; isolated databases per site</td>
                  <td className="py-3.5 px-6 text-emerald-700 font-semibold bg-blue-50/20">
                    Up to 20 branches per school group with 1-click executive switching
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">Cashier Leakage Protection</td>
                  <td className="py-3.5 px-6 text-slate-500">Manual carbon-copy receipts vulnerable to fraud</td>
                  <td className="py-3.5 px-6 text-emerald-700 font-semibold bg-blue-50/20">
                    Offline POS registers with cryptographic receipt serials and thermal printing
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">Uganda Statutory Taxes</td>
                  <td className="py-3.5 px-6 text-slate-500">Manual monthly Excel calculations</td>
                  <td className="py-3.5 px-6 text-emerald-700 font-semibold bg-blue-50/20">
                    Built-in URA PAYE tables, NSSF 15%, and WHT 6% statutory deductions
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">Disaster Recovery & Uptime</td>
                  <td className="py-3.5 px-6 text-slate-500">Occasional manual flash drive backups</td>
                  <td className="py-3.5 px-6 text-emerald-700 font-semibold bg-blue-50/20">
                    Continuous WAL Point-in-Time Recovery (RPO &lt; 1s) + SHA-256 snapshots
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">Parent Engagement</td>
                  <td className="py-3.5 px-6 text-slate-500">Paper report cards sent via students</td>
                  <td className="py-3.5 px-6 text-emerald-700 font-semibold bg-blue-50/20">
                    Instant WhatsApp payment receipts, attendance alerts, and digital student portal
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. INSTITUTIONAL REVENUE LEAKAGE CALCULATOR                               */}
      {/* ========================================================================= */}
      <section id="roi-calculator" className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b2256]">
              Calculate Your Institutional Fee Recovery
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              See how much revenue leakage EDUREXA prevents with double-entry ledgers and offline POS registers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Number of Campuses:</span>
                  <span className="text-[#f26522] font-mono">{campusesCount} Campuses</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={campusesCount}
                  onChange={(e) => setCampusesCount(Number(e.target.value))}
                  className="w-full accent-[#f26522] h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Total Students (All Campuses):</span>
                  <span className="text-[#f26522] font-mono">{studentsCount.toLocaleString()} Students</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={25000}
                  step={500}
                  value={studentsCount}
                  onChange={(e) => setStudentsCount(Number(e.target.value))}
                  className="w-full accent-[#f26522] h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider text-[#0b2256]">
                  ESTIMATED REVENUE LEAKAGE PREVENTED ANNUALLY
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0b2256] mt-1 font-mono">
                  UGX {estimatedSavings.toLocaleString()} Million+
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Calculated based on eliminating manual receipting fraud and uncollected fee arrears.
                </div>
              </div>
              <a href="#demo-form">
                <Button className="bg-[#f26522] hover:bg-[#d95314] text-white font-bold rounded-lg px-5 h-10 text-xs shadow-2xs">
                  Protect Your School's Revenue
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. EXECUTIVE DEMO BOOKING FORM                                           */}
      {/* ========================================================================= */}
      <section id="demo-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1">
            ONBOARDING & DEMOS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
            Schedule an Executive Boardroom Demonstration
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Experience the multi-campus hierarchy, offline cashier POS registers, and instant financial reports live.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          {bookingSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="size-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 grid place-items-center mx-auto">
                <Check className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Demo Request Received!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{bookingData.contactPerson}</strong>. Our enterprise team will contact you on WhatsApp ({bookingData.phone}) within 2 hours to confirm your demonstration.
              </p>
              <a
                href={`https://wa.me/256701116781?text=Hello%20EDUREXA,%20I%20just%20submitted%20a%20demo%20request%20for%20${encodeURIComponent(
                  bookingData.schoolName
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg h-10 px-5 mt-2 text-xs">
                  Chat With Enterprise Team on WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">School / Group Name *</Label>
                  <Input
                    placeholder="e.g. St. Lawrence Educational Group"
                    value={bookingData.schoolName}
                    onChange={(e) => setBookingData({ ...bookingData, schoolName: e.target.value })}
                    required
                    className="h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Your Full Name & Title *</Label>
                  <Input
                    placeholder="e.g. Dr. Ronald Mukasa (Director)"
                    value={bookingData.contactPerson}
                    onChange={(e) => setBookingData({ ...bookingData, contactPerson: e.target.value })}
                    required
                    className="h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">WhatsApp / Direct Phone *</Label>
                  <Input
                    placeholder="+256 701 116 781"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    required
                    className="h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Official Email *</Label>
                  <Input
                    type="email"
                    placeholder="director@school.sc.ug"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    required
                    className="h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Campuses to Onboard (Up to 20) *</Label>
                <select
                  value={bookingData.campuses}
                  onChange={(e) => setBookingData({ ...bookingData, campuses: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-1 focus:ring-[#0b2256]"
                >
                  <option value="1">1 Single Campus</option>
                  <option value="2-5">2 to 5 Campuses (Most Common)</option>
                  <option value="6-10">6 to 10 Campuses</option>
                  <option value="11-20">11 to 20 Campuses (Enterprise Conglomerate Tier)</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg h-11 text-xs font-bold shadow-2xs transition-colors"
              >
                Confirm Executive Demo Request
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER (Clean White Background, No Sticker Box for Logo)              */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            {/* Logo with NO box, transparent background */}
            <Image src={edurexaHorizontal} alt="EDUREXA Logo" className="h-8 w-auto object-contain" />
            <div className="border-l border-slate-200 pl-3">
              <span className="font-bold text-[#0b2256] text-sm">EDUREXA</span>
              <p className="text-[11px] text-slate-500">The Complete Digital Ecosystem for Modern Schools.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link href="/super-admin" className="hover:text-[#0b2256] transition-colors">
              Super Admin Console
            </Link>
            <Link href="/wellstar" className="hover:text-[#0b2256] transition-colors">
              Wellstar Flagship School
            </Link>
            <a
              href="https://wa.me/256701116781"
              target="_blank"
              rel="noreferrer"
              className="text-[#f26522] font-semibold hover:underline"
            >
              WhatsApp Sales: +256 701 116 781
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
