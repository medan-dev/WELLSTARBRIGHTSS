"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import edurexaLogo from "@/assets/edurexa-logo.png";
import edurexaMark from "@/assets/edurexa-mark.png";
import { Navbar } from "@/components/site/Navbar";
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
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BillingPeriod = "term" | "year";
type ModuleCategory = "academic" | "finance" | "logistics" | "communication";

export default function EdurexaMarketingHome() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("term");
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
      {/* 1. EDUREXA SCHOOLHIVE-STYLE HEADER (Top Bar + Main Nav + Mobile Drawer)   */}
      {/* ========================================================================= */}
      <Navbar />

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Executive High-Impact Enterprise Presentation)            */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b2256] tracking-tight leading-[1.12]">
              <span className="text-[#f26522]">EDUREXA</span> a Powerful Tool To Represent Your School
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
              EDUREXA is a modern, enterprise-grade platform engineered to streamline administrative workflows, eliminate cashier fee leakage, automate competency assessments, and unify multi-campus operations across your entire institution.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/demo">
              <Button className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg text-sm font-bold px-7 h-12 shadow-sm gap-2">
                <span>Launch Live System Demo</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <a href="#features">
              <Button
                variant="outline"
                className="border-slate-300 bg-white hover:bg-slate-50 text-[#0b2256] rounded-lg text-sm font-semibold px-6 h-12 gap-2 shadow-2xs"
              >
                <span>Explore Features</span>
                <ChevronRight className="size-4 text-[#0b2256]" />
              </Button>
            </a>
          </div>

          <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>200+ Institution Capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Up to 20 Campuses per Group</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Offline POS Cashier Desks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Free 4-Hour Live Demo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 1: CORE ADVANCED CAPABILITIES / FEATURES (SCHOOLHIVE 3-CARD)   */}
      {/* ========================================================================= */}
      <section id="features" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Card 1 */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="size-12 rounded-lg bg-blue-50 text-[#0b2256] flex items-center justify-center font-bold">
                <BarChart3 className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Advanced Statistics & Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                EDUREXA offers advanced statistics and predictive analytics, enabling school directors to track performance, monitor attendance, and manage multi-campus finances for informed executive decision-making.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="size-12 rounded-lg bg-orange-50 text-[#f26522] flex items-center justify-center font-bold">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Powerful Multi-Campus Admin</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                With a centralized executive console, EDUREXA enables efficient management of student enrollment, branch campuses (up to 20 branches per group), teaching staff, and bursary finances through an intuitive interface.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="size-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <HardDrive className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Security Updates & Continuous WAL</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                EDUREXA ensures sensitive institutional and student data is protected with regular security updates, bank-grade encryption, Point-in-Time Recovery (&lt; 1s RPO), and cryptographic SHA-256 backup snapshots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 2: ABOUT EDUREXA & 4 PRODUCT SHOWCASE CARDS (SCHOOLHIVE PATTERN)*/}
      {/* ========================================================================= */}
      <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              About EDUREXA
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>EDUREXA</strong> means a collaborative, centralized platform designed to streamline and enhance school management. It brings together students, teachers, bursars, and administrators, making communication, analytics, and daily operations more efficient and effective across all your branch campuses.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            {/* 1. School Admin Dashboard */}
            <div className="flex-1 min-w-[220px] bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="size-10 rounded-lg bg-blue-50 text-[#0b2256] flex items-center justify-center">
                <MonitorCheck className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">School Admin Dashboard</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete overview & analytics, multi-campus switcher, staff roles, and institutional governance.
              </p>
            </div>

            {/* 2. Teacher Portal */}
            <div className="flex-1 min-w-[220px] bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="size-10 rounded-lg bg-orange-50 text-[#f26522] flex items-center justify-center">
                <BookOpen className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Teacher & Gradebook Engine</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lessons, UNEB competency assessments, period attendance, and automatic report card generation.
              </p>
            </div>

            {/* 3. Digital Library & Logistics */}
            <div className="flex-1 min-w-[220px] bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="size-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Library className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Digital Library & Logistics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Book tracking, dormitory bed allocations, school bus routes, and biometric dining hall tokens.
              </p>
            </div>

            {/* 4. Accounts & Bursary Dashboard */}
            <div className="flex-1 min-w-[220px] bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Receipt className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Accounts & Fee Dashboard</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Offline POS thermal receipting, bank statement reconciliation, URA tax tables, and arrears tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 3: TRANSFORMING EDUCATION ACROSS UGANDA (FACTS BANNER)         */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#0b2256] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">OUR ACHIEVEMENT</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Transforming Education Management Across Uganda & East Africa
            </h3>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex-1 min-w-[200px] p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">200+</div>
              <div className="text-xs text-slate-300 mt-1">Schools Architecture Capacity</div>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">25,000+</div>
              <div className="text-xs text-slate-300 mt-1">Students Capacity Supported</div>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">1,200+</div>
              <div className="text-xs text-slate-300 mt-1">Teachers & Staff Active</div>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">20 Max</div>
              <div className="text-xs text-slate-300 mt-1">Campuses per School Group</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LIVE 4-HOUR FREE DEMO SANDBOX (COMPLETE EDUREXA ECOSYSTEM TEST-DRIVE)   */}
      {/* ========================================================================= */}
      <section id="demo" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
                Experience EDUREXA With a Free 4-Hour Live Interactive Demo
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Test-drive every capability of our system for a full 4 hours before onboarding. Explore multi-campus governance, cashier desks, report cards, and parent channels with zero commitment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/demo">
                <Button className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg text-xs font-bold h-10 px-5 gap-1.5 shadow-sm">
                  <span>Enter Live Demo Gateway</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>

              <a href="https://wa.me/256758611414" target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold h-10 px-4 gap-1.5">
                  <span>Talk to Solutions Engineer</span>
                  <Phone className="size-3.5 text-[#f26522]" />
                </Button>
              </a>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-stretch">
            <div className="flex-1 space-y-6">
              <div className="space-y-1.5">
                <div className="text-xs uppercase font-mono tracking-wider text-[#f26522] font-bold">
                  100% FREE HANDS-ON DEMO &bull; 4 HOURS UNRESTRICTED ACCESS &bull; NO SETUP REQUIRED
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Full Institutional Simulation Before Onboarding
                </h3>
                <p className="text-xs text-slate-500">
                  Every onboarded school receives its own custom branded instance, verified workflows, and personalized student databases.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[130px] p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-xl font-bold text-[#0b2256] font-mono">4 Hours</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Free Live Sandbox</div>
                </div>
                <div className="flex-1 min-w-[130px] p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-xl font-bold text-slate-900 font-mono">100%</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">All Modules Unlocked</div>
                </div>
                <div className="flex-1 min-w-[130px] p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-xl font-bold text-emerald-700 font-mono">UGX 0</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Zero Commitment</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Comprehensive access across academic, administrative, and bursary workflows.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Test offline POS cashier desks with thermal receipt printing and bank reconciliations.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Simulate UNEB competency division calculations and automated WhatsApp fee reminders.</span>
                </div>
              </div>
            </div>

            <div className="lg:w-[380px] bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-2xs shrink-0 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  REQUEST PRIVATE DEMO SANDBOX
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  Experience Your Institution on EDUREXA
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Our systems engineering team deploys an isolated demo sandbox customized with your curriculum, campus count, and student brackets for an uninterrupted 4-hour evaluation.
                </p>

                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Free 4-Hour Dedicated Sandbox</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Zero Setup Fee & Bull; No Obligation</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Direct WhatsApp Technical Engineer</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <a href="#demo-form" className="w-full block">
                  <Button className="w-full bg-[#f26522] hover:bg-[#d95314] text-white text-xs font-bold rounded-lg h-10 shadow-sm">
                    Book Boardroom Demonstration
                  </Button>
                </a>
                <a
                  href="https://wa.me/256758611414"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block"
                >
                  <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg h-10">
                    Chat on WhatsApp (+256 758 611 414)
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 5: SCALABLE PRICING (EXACT SCHOOLHIVE MODEL WITH TOGGLE)       */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              Scalable Pricing for Every School's Unique Journey
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Discover flexible, transparent pricing designed to grow with your institution. Whether you're a single primary school or a 20-campus academic complex, EDUREXA adapts to your specific student population and budget.
            </p>
          </div>

          {/* Toggle Switch (Term vs Year) */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn("text-xs font-semibold", billingPeriod === "term" ? "text-[#0b2256]" : "text-slate-400")}>
              Per Term
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "term" ? "year" : "term")}
              className="relative w-12 h-6 rounded-full bg-slate-300 p-0.5 transition-colors"
            >
              <div
                className={cn(
                  "size-5 rounded-full bg-white shadow-md transition-transform",
                  billingPeriod === "year" ? "translate-x-6 bg-[#f26522]" : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-xs font-semibold", billingPeriod === "year" ? "text-[#0b2256]" : "text-slate-400")}>
              Per Year (Save 20%)
            </span>
          </div>

          {/* 3 Pricing Cards */}
          <div className="flex flex-col md:flex-row gap-6 text-left">
            {/* Tier 1: 1–500 Students */}
            <div className="flex-1 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    1–500 STUDENTS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">Standard Plan</h3>
                  <p className="text-xs text-slate-500">Core essentials for growing primary & secondary schools.</p>
                </div>

                <div className="space-y-1 pt-4">
                  <div className="text-3xl font-extrabold text-[#0b2256]">
                    {billingPeriod === "term" ? "$4" : "$10"}
                    <span className="text-xs text-slate-500 font-normal ml-1">/ student</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Unlimited teachers & admin accounts</div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4 mt-4">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Student Information System (SIS) & Reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Class & Timetable Management Tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>UNEB & Competency Gradebook</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Email & WhatsApp Support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <a href="#demo-form">
                  <Button variant="outline" className="w-full text-xs font-bold rounded-lg border-slate-300 h-10 hover:bg-slate-50">
                    Get Started
                  </Button>
                </a>
              </div>
            </div>

            {/* Tier 2: 501–1,500 Students (Popular) */}
            <div className="flex-1 flex flex-col justify-between bg-white border-2 border-[#f26522] rounded-xl p-6 sm:p-8 space-y-6 shadow-md relative">
              <div>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f26522] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  MOST POPULAR
                </span>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#f26522] bg-orange-50 px-2 py-0.5 rounded">
                    501–1,500 STUDENTS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">Professional Plan</h3>
                  <p className="text-xs text-slate-500">Complete suite with offline POS and parent engagement.</p>
                </div>

                <div className="space-y-1 pt-4">
                  <div className="text-3xl font-extrabold text-[#0b2256]">
                    {billingPeriod === "term" ? "$3.20" : "$8.20"}
                    <span className="text-xs text-slate-500 font-normal ml-1">/ student</span>
                  </div>
                  <div className="text-[11px] text-slate-400">All features from smaller tier included</div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4 mt-4">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Offline POS Cashier Desks & Thermal Receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Dedicated Parent Access & WhatsApp Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Sibling Family Account Consolidation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Hostel & School Bus Transport Logistics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>24/7 Priority Phone & WhatsApp Support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <a href="#demo-form">
                  <Button className="w-full text-xs font-bold rounded-lg bg-[#f26522] hover:bg-[#d95314] text-white h-10 shadow-sm">
                    Choose Professional
                  </Button>
                </a>
              </div>
            </div>

            {/* Tier 3: 1,500+ Students or Multi-Campus Enterprise */}
            <div className="flex-1 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    MULTI-CAMPUS CONGLOMERATE
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">Enterprise Plan</h3>
                  <p className="text-xs text-slate-500">For multi-campus school groups, dioceses, and universities.</p>
                </div>

                <div className="space-y-1 pt-4">
                  <div className="text-3xl font-extrabold text-[#0b2256]">
                    {billingPeriod === "term" ? "$2.40" : "$7.00"}
                    <span className="text-xs text-slate-500 font-normal ml-1">/ student</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Maximum cost efficiency at scale</div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4 mt-4">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Hard Limit: Up to 20 Campuses per Organization</span>
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
                    <span>Continuous WAL PITR (&lt; 1s RPO) + SHA-256 Backups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Dedicated Account Manager & Engineering SLA</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <a href="#demo-form">
                  <Button variant="outline" className="w-full text-xs font-bold rounded-lg border-slate-300 h-10 hover:bg-slate-50">
                    Choose Enterprise
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION 7: WHAT OUR SCHOOLS SAY (TESTIMONIALS FROM SCHOOLHIVE)         */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              What Our Schools Say
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hear from real educators and administrators who are using our platform to transform how they manage classes, students, and communication in their institutions.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Review 1 */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "Using this system has completely transformed the way we run our school. From managing multi-campus attendance to generating end-of-term report cards, everything is now organized and efficient."
                </p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="font-bold text-xs text-slate-900">Mr. Michael Afonso</div>
                <div className="text-[11px] text-slate-500">Headteacher, Green Valley High School</div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "The support team is fantastic and the interface is very easy for both teachers and parents. We've saved hours of manual work thanks to the automated fee receipts and WhatsApp notifications."
                </p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="font-bold text-xs text-slate-900">Ms. Sarah Mishin</div>
                <div className="text-[11px] text-slate-500">ICT Coordinator, Sunrise Primary School</div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "EDUREXA has revolutionized our administrative processes. The comprehensive fee reporting and real-time multi-campus analytics have given our board unprecedented visibility into financial operations."
                </p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="font-bold text-xs text-slate-900">Dr. Ronald Mukasa</div>
                <div className="text-[11px] text-slate-500">Director, Victoria Nile Educational Complex</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. SECTION 6: CTA BANNER (TRUSTED BY 200+ STUDENTS, TEACHERS & ADMINS)   */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#0b2256] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Trusted by Over 200+ Schools, Teachers, and Administrators
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our school management platform is helping institutions streamline student records, simplify communication, automate exams, and eliminate fee leakage — all from one centralized system.
              </p>
            </div>
            <a href="#demo-form">
              <Button className="bg-[#f26522] hover:bg-[#d95314] text-white font-bold rounded-lg px-6 h-12 text-xs sm:text-sm shadow-md shrink-0">
                Join Now / Book Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. INSTITUTIONAL REVENUE LEAKAGE CALCULATOR                              */}
      {/* ========================================================================= */}
      <section id="roi-calculator" className="py-16 bg-slate-50 border-b border-slate-200">
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
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-2">
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

              <div className="flex-1 space-y-2">
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
      {/* 11B. DOCUMENTATION SECTION                                                */}
      {/* ========================================================================= */}
      <section id="documentation" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              Documentation & Guides
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Step-by-step manuals, system architectures, and operational procedures designed for headteachers, teachers, and bursary staff.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="size-11 rounded-lg bg-blue-50 text-[#0b2256] flex items-center justify-center font-bold">
                  <BookOpen className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Administrator & Setup Manual</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Learn how to configure multi-campus hierarchies, assign teacher roles, import legacy student records, and set up academic terms.
                </p>
              </div>
              <Link href="/documentation/onboarding" className="text-xs font-bold text-[#f26522] hover:underline flex items-center gap-1 pt-2">
                <span>View Setup Guide</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="size-11 rounded-lg bg-orange-50 text-[#f26522] flex items-center justify-center font-bold">
                  <FileSpreadsheet className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">UNEB & Academic Assessment</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Comprehensive documentation on competency rubric scoring, automatic aggregate computations, and bulk PDF report card printing.
                </p>
              </div>
              <Link href="/documentation/academics" className="text-xs font-bold text-[#f26522] hover:underline flex items-center gap-1 pt-2">
                <span>View Grading Specs</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="size-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Receipt className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Bursary & POS Cashier Desk</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Guide to running thermal slip cashier desks, reconciling bank deposits with SchoolPay/Centenary slips, and WhatsApp notifications.
                </p>
              </div>
              <Link href="/documentation/finance" className="text-xs font-bold text-[#f26522] hover:underline flex items-center gap-1 pt-2">
                <span>View Bursary Specs</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link href="/documentation">
              <Button className="bg-[#0b2256] hover:bg-[#081a42] text-white rounded-xl text-xs font-bold px-6 h-11 gap-2 shadow-sm">
                <span>Browse Complete Documentation Hub</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11C. HELP & SUPPORT SECTION                                               */}
      {/* ========================================================================= */}
      <section id="support" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
              Help & Support
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We are dedicated to supporting your school with responsive, round-the-clock enterprise assistance across Uganda and East Africa.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="size-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Direct WhatsApp Help Desk</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instant live chat assistance for school administrators, bursars, and ICT coordinators during business and exam hours.
                </p>
              </div>
              <a
                href="https://wa.me/256758611414"
                target="_blank"
                rel="noreferrer"
                className="pt-2 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
              >
                <span>Chat +256 758 611 414</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="size-11 rounded-lg bg-blue-50 text-[#0b2256] flex items-center justify-center">
                  <Phone className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Telephone Technical Hotline</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Call our systems engineer directly for immediate emergency recovery, database backups, or server queries.
                </p>
              </div>
              <a
                href="tel:+256758611414"
                className="pt-2 text-xs font-bold text-[#0b2256] hover:underline flex items-center gap-1.5"
              >
                <span>Call +256 758 611 414</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="size-11 rounded-lg bg-orange-50 text-[#f26522] flex items-center justify-center">
                  <Mail className="size-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Official Email Support</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send requests for feature enhancements, institutional quotations, or custom software integration directly to our engineers.
                </p>
              </div>
              <a
                href="mailto:sales@edurexa.com"
                className="pt-2 text-xs font-bold text-[#f26522] hover:underline flex items-center gap-1.5"
              >
                <span>sales@edurexa.com</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. EXECUTIVE DEMO BOOKING FORM                                           */}
      {/* ========================================================================= */}
      <section id="demo-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2256] tracking-tight">
            Schedule Your Free 4-Hour Executive Demonstration
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Experience the multi-campus hierarchy, offline cashier POS registers, and instant financial reports live with our enterprise team.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          {bookingSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="size-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Demo Request Received!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{bookingData.contactPerson}</strong>. Our enterprise team will contact you on WhatsApp ({bookingData.phone}) within 2 hours to activate your free 4-hour demonstration.
              </p>
              <a
                href={`https://wa.me/256758611414?text=Hello%20EDUREXA,%20I%20just%20submitted%20a%20demo%20request%20for%20${encodeURIComponent(
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">School / Group Name *</Label>
                  <Input
                    placeholder="e.g. St. Lawrence Educational Group"
                    value={bookingData.schoolName}
                    onChange={(e) => setBookingData({ ...bookingData, schoolName: e.target.value })}
                    required
                    className="h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
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

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">WhatsApp / Direct Phone *</Label>
                  <Input
                    placeholder="+256 758 611 414"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    required
                    className="h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
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
                Confirm Free 4-Hour Demo Request
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. CLEAN WHITE FOOTER (Logo with NO Background Container)                */}
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
            <Link href="/" className="hover:text-[#0b2256] transition-colors">
              Home
            </Link>
            <a href="#features" className="hover:text-[#0b2256] transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-[#0b2256] transition-colors">
              Pricing
            </a>
            <Link href="/demo" className="hover:text-[#0b2256] transition-colors">
              Demo
            </Link>
            <Link href="/documentation" className="hover:text-[#0b2256] transition-colors">
              Documentation
            </Link>
            <a href="#support" className="hover:text-[#0b2256] transition-colors">
              Help & Support
            </a>
            <a
              href="https://wa.me/256758611414"
              target="_blank"
              rel="noreferrer"
              className="text-[#f26522] font-semibold hover:underline"
            >
              WhatsApp: +256 758 611 414
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
