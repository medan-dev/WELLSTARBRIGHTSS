"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StandardFrontSitePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "facilities" | "admissions">("overview");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#f26522] selection:text-white">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-[#0b2256] text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] bg-[#f26522] text-white px-2 py-0.5 font-bold">
              STANDARD SCHOOL FRONT SITE
            </span>
            <span className="hidden sm:inline text-slate-300">
              National Examination Center #U0482 • Mukono District
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:+256758611414" className="flex items-center gap-1.5 text-slate-200 hover:text-white">
              <Phone className="size-3 text-[#f26522]" />
              <span>+256 758 611 414</span>
            </a>
            <span className="text-white/20">•</span>
            <a href="mailto:admissions@yourschool.com" className="flex items-center gap-1.5 text-slate-200 hover:text-white">
              <Mail className="size-3 text-[#f26522]" />
              <span>admissions@yourschool.com</span>
            </a>
            <span className="text-white/20">•</span>
            <Link href="/demo" className="font-bold text-[#f26522] hover:underline flex items-center gap-1">
              <span>Portal Login</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN SCHOOL NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-[#0b2256] text-white font-black text-lg grid place-items-center">
              DA
            </div>
            <div>
              <div className="font-black text-base text-[#0b2256] tracking-tight">DEMO INTERNATIONAL ACADEMY</div>
              <div className="text-[10px] text-slate-500 font-medium">Competence-Based & UNEB Certified Institution</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-2 transition-colors ${
                activeTab === "overview"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("academics")}
              className={`px-3.5 py-2 transition-colors ${
                activeTab === "academics"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Academics & UNEB
            </button>
            <button
              onClick={() => setActiveTab("facilities")}
              className={`px-3.5 py-2 transition-colors ${
                activeTab === "facilities"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Facilities & Labs
            </button>
            <button
              onClick={() => setActiveTab("admissions")}
              className={`px-3.5 py-2 transition-colors ${
                activeTab === "admissions"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Admissions
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/demo">
              <Button size="sm" className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-none text-xs font-bold h-9 px-4 gap-1.5 shadow-sm">
                <span>Access Student / Staff Portal</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SHOWCASE */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-xs font-semibold">
              <Sparkles className="size-3.5 text-[#f26522]" />
              <span>Standard Multi-Tenant Front Site Model</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12]">
              Academic Excellence, Practical Innovation & Moral Character
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every school on the EDUREXA network operates its own automated front site. Prospective parents, students, and education officers inspect academic curricula, campus facilities, and admissions requirements in real time.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={() => setActiveTab("admissions")}
                className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-none text-xs font-bold h-11 px-6 gap-2"
              >
                <span>Apply For 2026 Admissions</span>
                <ArrowRight className="size-4" />
              </Button>
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-none text-xs font-semibold h-11 px-6"
                >
                  Return to Demo Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative border border-white/20 p-2 bg-white/5">
            <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
              <Image src="/gallery/hero-campus.jpg" alt="Academy Campus" fill className="object-cover" priority />
            </div>
            <div className="p-3 text-[11px] text-slate-300 flex items-center justify-between border-t border-white/10 mt-2">
              <span>Main Academic Wing & STEM Quadrangle</span>
              <span className="font-mono text-emerald-400 font-bold">● Active Campus</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTENT SECTIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-slate-200 p-5 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">UNEB National Pass Rate</div>
                <div className="text-3xl font-black text-[#0b2256]">98.6%</div>
                <div className="text-xs text-emerald-600 font-semibold">Division 1 & 2 Average</div>
              </div>
              <div className="border border-slate-200 p-5 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Class Ratio</div>
                <div className="text-3xl font-black text-[#0b2256]">1 : 28</div>
                <div className="text-xs text-slate-500">Teacher-Student Ratio</div>
              </div>
              <div className="border border-slate-200 p-5 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Curriculum</div>
                <div className="text-3xl font-black text-[#0b2256]">UNEB</div>
                <div className="text-xs text-slate-500">UCE & UACE Certified</div>
              </div>
              <div className="border border-slate-200 p-5 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Campus Setup</div>
                <div className="text-3xl font-black text-[#0b2256]">24 / 7</div>
                <div className="text-xs text-slate-500">Boarding & Day Scholars</div>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Academic & Institutional Pillars</h2>
                <p className="text-xs text-slate-500">Providing the standard foundation expected by Uganda secondary school inspectors and parents.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="border border-slate-200 p-6 space-y-3">
                  <div className="size-10 bg-blue-100 text-blue-900 grid place-items-center">
                    <BookOpen className="size-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Competency Curriculum</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Continuous student evaluation based on practical demonstration of skills, project portfolios, and critical thinking.
                  </p>
                </div>

                <div className="border border-slate-200 p-6 space-y-3">
                  <div className="size-10 bg-amber-100 text-amber-900 grid place-items-center">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Character & Wellbeing</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    24/7 dedicated matrons, patrons, and nurse stations ensuring student health, safety, and moral integrity.
                  </p>
                </div>

                <div className="border border-slate-200 p-6 space-y-3">
                  <div className="size-10 bg-emerald-100 text-emerald-900 grid place-items-center">
                    <GraduationCap className="size-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Higher Education Gateway</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Over 85% of our A-Level candidates gain direct government and international merit admissions to top faculties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ACADEMICS */}
        {activeTab === "academics" && (
          <div className="space-y-8">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">Academic Curriculum & Examinations</h2>
              <p className="text-xs text-slate-500">Complete curriculum paths from Senior 1 foundational inquiry to Senior 6 university prep.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-200 p-6 space-y-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0b2256]">Lower Secondary (Senior 1 – Senior 2)</h3>
                  <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-1">Foundational</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focuses on foundational sciences, mathematics, computer literacy, and communication skills under the new Ugandan national curriculum.
                </p>
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-800">Core Disciplines:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Mathematics", "English", "Physics", "Chemistry", "Biology", "ICT", "Geography", "History", "Kiswahili", "Physical Education"].map((s) => (
                      <span key={s} className="text-xs bg-white border border-slate-200 px-2.5 py-1 text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 p-6 space-y-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0b2256]">Upper Secondary (Senior 3 – Senior 4)</h3>
                  <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-1">UNEB UCE</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specialized elective combinations and rigorous national exam simulations for the Uganda Certificate of Education (UCE).
                </p>
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-800">Elective Subjects:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Pure Sciences", "Commerce & Accounts", "Computer Studies", "Fine Art", "Literature in English", "Agriculture", "Entrepreneurship"].map((s) => (
                      <span key={s} className="text-xs bg-white border border-slate-200 px-2.5 py-1 text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FACILITIES */}
        {activeTab === "facilities" && (
          <div className="space-y-8">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">Campus Facilities & Infrastructure</h2>
              <p className="text-xs text-slate-500">Modern learning and living environments equipped for excellence.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-slate-200 overflow-hidden">
                <div className="h-44 bg-slate-100 relative">
                  <Image src="/gallery/stem-lab.png" alt="Science Lab" fill className="object-cover" />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900">STEM Science Laboratories</h3>
                  <p className="text-xs text-slate-600">Fully equipped Physics, Chemistry, and Biology laboratories.</p>
                </div>
              </div>

              <div className="border border-slate-200 overflow-hidden">
                <div className="h-44 bg-slate-100 relative">
                  <Image src="/gallery/computer-lab.png" alt="Computer Lab" fill className="object-cover" />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900">Computer Studies Lab</h3>
                  <p className="text-xs text-slate-600">Over 60 networked workstations with digital coding and research platforms.</p>
                </div>
              </div>

              <div className="border border-slate-200 overflow-hidden">
                <div className="h-44 bg-slate-100 relative">
                  <Image src="/gallery/library-study.png" alt="Library" fill className="object-cover" />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900">Resource Library</h3>
                  <p className="text-xs text-slate-600">Holding over 5,000 national curriculum textbooks, revision past papers, and journals.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ADMISSIONS */}
        {activeTab === "admissions" && (
          <div className="space-y-8">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">Admissions & Enrollment Process</h2>
              <p className="text-xs text-slate-500">Simple 3-step verification and registration for prospective candidates.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="border border-slate-200 p-6 space-y-3 bg-slate-50">
                <div className="size-8 bg-[#0b2256] text-white font-bold text-sm grid place-items-center">1</div>
                <h3 className="font-bold text-sm text-slate-900">Application Entry</h3>
                <p className="text-xs text-slate-600">
                  Complete online enrollment or pick up admission papers at the campus admissions desk.
                </p>
              </div>

              <div className="border border-slate-200 p-6 space-y-3 bg-slate-50">
                <div className="size-8 bg-[#0b2256] text-white font-bold text-sm grid place-items-center">2</div>
                <h3 className="font-bold text-sm text-slate-900">UNEB Results Submission</h3>
                <p className="text-xs text-slate-600">
                  Submit genuine PLE result slips (for S.1) or UCE result slips (for S.5) for verification.
                </p>
              </div>

              <div className="border border-slate-200 p-6 space-y-3 bg-slate-50">
                <div className="size-8 bg-[#0b2256] text-white font-bold text-sm grid place-items-center">3</div>
                <h3 className="font-bold text-sm text-slate-900">Admission Letter & Banking</h3>
                <p className="text-xs text-slate-600">
                  Receive the official school admission package and pay initial school fees through banking slips or mobile money.
                </p>
              </div>
            </div>

            <div className="border border-slate-200 bg-[#0b2256] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Connect With Our Admissions Desk</h3>
                <p className="text-xs text-slate-300">Inquiries regarding vacancies, tuition fee structures, and campus tours are answered immediately.</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+256758611414"
                  className="px-4 py-2.5 bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Call +256 758 611 414
                </a>
                <a
                  href="https://wa.me/256758611414"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#f26522] hover:bg-[#d95314] text-white text-xs font-bold transition-colors"
                >
                  WhatsApp Admissions
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            DEMO INTERNATIONAL ACADEMY • A Model Institution on the EDUREXA Platform
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-slate-700 hover:text-black font-semibold">
              Return to Portal Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
