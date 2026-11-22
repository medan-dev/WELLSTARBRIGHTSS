"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  X,
  ExternalLink,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StandardFrontSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StandardFrontSiteModal({ isOpen, onClose }: StandardFrontSiteModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "facilities" | "admissions">("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in font-sans">
      <div className="bg-white text-slate-900 w-full max-w-5xl h-[92vh] flex flex-col rounded-none border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Top Bar */}
        <div className="h-14 px-4 sm:px-6 bg-[#0b2256] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 bg-[#f26522] grid place-items-center rounded-none text-white font-bold text-xs">
              <Globe className="size-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight">STANDARD SCHOOL FRONT SITE VIEW</div>
              <div className="text-[10px] text-slate-300">Live public website view for prospective parents & students</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/front-site"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-none transition-colors"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Open Full Page</span>
            </Link>
            <button
              onClick={onClose}
              className="size-8 grid place-items-center text-white/80 hover:text-white hover:bg-white/10 rounded-none transition-colors"
              title="Close Front Site View"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* School Navbar Emulation */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-[#0b2256]">DEMO INTERNATIONAL ACADEMY</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
              UNEB CENTER #U0482
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("academics")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                activeTab === "academics"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Academics
            </button>
            <button
              onClick={() => setActiveTab("facilities")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                activeTab === "facilities"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Facilities
            </button>
            <button
              onClick={() => setActiveTab("admissions")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                activeTab === "admissions"
                  ? "bg-[#0b2256] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Admissions
            </button>
          </div>
        </div>

        {/* Scrollable Front Site Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-white">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Hero Banner */}
              <div className="relative border border-slate-200 bg-slate-900 text-white p-6 sm:p-10 overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-4">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#f26522] text-white px-2.5 py-1">
                    Academic Year 2026 Admissions Open
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    Nurturing Tomorrow's Leaders Through Holistic Excellence & Character
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    A premier mixed day and boarding secondary institution equipped with state-of-the-art STEM laboratories, modern computer centers, and a dedicated teaching faculty preparing students for top university pathways.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={() => setActiveTab("admissions")}
                      className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-none text-xs font-bold h-9 px-4 gap-1.5"
                    >
                      <span>Apply For Admission</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                    <Button
                      onClick={() => setActiveTab("academics")}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 rounded-none text-xs font-semibold h-9 px-4"
                    >
                      Explore Curriculum
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fast Stats Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">UCE & UACE Pass Rate</div>
                  <div className="text-2xl font-black text-[#0b2256]">98.6%</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Division 1 & 2 Average</div>
                </div>
                <div className="border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Classroom Ratio</div>
                  <div className="text-2xl font-black text-[#0b2256]">1 : 28</div>
                  <div className="text-[10px] text-slate-500">Teacher-Student Attention</div>
                </div>
                <div className="border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Boarding & Day</div>
                  <div className="text-2xl font-black text-[#0b2256]">24 / 7</div>
                  <div className="text-[10px] text-slate-500">Secure Campus & Medical Desk</div>
                </div>
                <div className="border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Clubs & Sports</div>
                  <div className="text-2xl font-black text-[#0b2256]">14+</div>
                  <div className="text-[10px] text-slate-500">Football, Music, Robotics</div>
                </div>
              </div>

              {/* Institution Pillars */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-base text-slate-900">Why Families Choose Our Academy</h3>
                  <p className="text-xs text-slate-500">Designed to meet international standards while adhering to the Uganda National Curriculum.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="border border-slate-200 p-5 space-y-2">
                    <div className="size-8 bg-blue-100 text-blue-800 grid place-items-center">
                      <BookOpen className="size-4" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Competence-Based Curriculum</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hands-on scientific inquiry, ICT literacy, and collaborative project assessment ensuring every child masters practical problem-solving.
                    </p>
                  </div>

                  <div className="border border-slate-200 p-5 space-y-2">
                    <div className="size-8 bg-amber-100 text-amber-800 grid place-items-center">
                      <ShieldCheck className="size-4" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Discipline & Pastoral Care</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Resident matrons, patrons, and guidance counselors provide 24/7 mentorship, fostering respectful character and spiritual wellbeing.
                    </p>
                  </div>

                  <div className="border border-slate-200 p-5 space-y-2">
                    <div className="size-8 bg-emerald-100 text-emerald-800 grid place-items-center">
                      <GraduationCap className="size-4" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Direct University Pathways</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Proven track record of graduates earning government and merit scholarships to top universities in Medicine, Engineering, Law, and Business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMICS */}
          {activeTab === "academics" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Academic Programs & Subject Offerings</h2>
                <p className="text-xs text-slate-500">Structured progression from Lower Secondary foundational inquiry through Advanced Level national candidate preparation.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 p-5 space-y-3 bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0b2256]">Lower Secondary (Senior 1 – Senior 2)</h3>
                    <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5">Foundational</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Broad-spectrum exposure to sciences, languages, mathematics, and creative arts under the new competence curriculum.
                  </p>
                  <div className="text-xs font-semibold text-slate-700">Core Subjects:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Mathematics", "English", "Physics", "Chemistry", "Biology", "ICT", "Geography", "History", "Kiswahili", "Physical Education"].map((s) => (
                      <span key={s} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 p-5 space-y-3 bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0b2256]">Senior 3 – Senior 4 (UNEB UCE Candidates)</h3>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5">UNEB UCE</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Intensive examination preparation, laboratory practical drills, and tailored elective streams for outstanding national distinction.
                  </p>
                  <div className="text-xs font-semibold text-slate-700">Elective Tracks:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Pure Sciences", "Commerce & Accounts", "Computer Studies", "Fine Art", "Literature in English", "Agriculture", "Entrepreneurship"].map((s) => (
                      <span key={s} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 p-5 space-y-3 bg-slate-50/40 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0b2256]">Advanced Level (Senior 5 – Senior 6)</h3>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5">UNEB UACE</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Specialized 3-principal combinations designed for targeted university degree admissions across Science and Arts streams.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white border border-slate-200 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Science Combinations:</div>
                      <div className="text-xs text-slate-600">PCM/ICT, BCM/Sub-Maths, PEM/ICT, PCB/Sub-Maths</div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Arts Combinations:</div>
                      <div className="text-xs text-slate-600">HEG/Sub-Maths, LEG/ICT, DEG/ICT, HED/Sub-Maths</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FACILITIES */}
          {activeTab === "facilities" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Campus Infrastructure & Learning Environments</h2>
                <p className="text-xs text-slate-500">Dedicated physical resources designed to maximize academic focus and student life.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-slate-100 relative">
                    <Image src="/gallery/stem-lab.png" alt="Science Lab" fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">Modern STEM Science Laboratories</h4>
                    <p className="text-[11px] text-slate-500">Fully equipped Physics, Chemistry, and Biology laboratories for hands-on experiments.</p>
                  </div>
                </div>

                <div className="border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-slate-100 relative">
                    <Image src="/gallery/computer-lab.png" alt="Computer Lab" fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">High-Speed Computer & ICT Center</h4>
                    <p className="text-[11px] text-slate-500">60+ workstations with broadband internet for programming, research, and computer studies.</p>
                  </div>
                </div>

                <div className="border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-slate-100 relative">
                    <Image src="/gallery/library-study.png" alt="Library" fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">Extensive Resource Library</h4>
                    <p className="text-[11px] text-slate-500">Quiet study hall holding over 5,000 curriculum textbooks, journals, and digital references.</p>
                  </div>
                </div>

                <div className="border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-slate-100 relative">
                    <Image src="/gallery/sports-field.png" alt="Sports Field" fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">Athletics & Sports Complex</h4>
                    <p className="text-[11px] text-slate-500">Regulation football pitch, basketball court, volleyball arena, and track facilities.</p>
                  </div>
                </div>

                <div className="border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-slate-100 relative">
                    <Image src="/gallery/choir-music.png" alt="Choir & Arts" fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">Music, Dance & Drama Hall</h4>
                    <p className="text-[11px] text-slate-500">Creative arts theater supporting school choir, instrument mastery, and annual cultural festivals.</p>
                  </div>
                </div>

                <div className="border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-slate-100 relative">
                    <Image src="/gallery/graduation-day.png" alt="Graduation" fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">Secure Boarding Hostels</h4>
                    <p className="text-[11px] text-slate-500">Spacious separate boys and girls dormitories with clean borehole water and resident nurses.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMISSIONS */}
          {activeTab === "admissions" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Admissions Procedure & Requirements</h2>
                <p className="text-xs text-slate-500">We welcome inquiries and applications for S.1, S.2, S.3, and S.5 academic placements.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border border-slate-200 p-5 space-y-2 bg-slate-50/50">
                  <div className="size-6 bg-[#0b2256] text-white text-xs font-bold grid place-items-center">1</div>
                  <h4 className="font-bold text-xs text-slate-900">Application Submission</h4>
                  <p className="text-xs text-slate-600">
                    Complete the online application form or obtain admission papers directly from our campus admissions desk.
                  </p>
                </div>

                <div className="border border-slate-200 p-5 space-y-2 bg-slate-50/50">
                  <div className="size-6 bg-[#0b2256] text-white text-xs font-bold grid place-items-center">2</div>
                  <h4 className="font-bold text-xs text-slate-900">Result Verification</h4>
                  <p className="text-xs text-slate-600">
                    Submit authentic PLE result slip (for S.1) or UNEB UCE result slip (for S.5) along with recommendation letters.
                  </p>
                </div>

                <div className="border border-slate-200 p-5 space-y-2 bg-slate-50/50">
                  <div className="size-6 bg-[#0b2256] text-white text-xs font-bold grid place-items-center">3</div>
                  <h4 className="font-bold text-xs text-slate-900">Family Interview</h4>
                  <p className="text-xs text-slate-600">
                    Attend a guided campus walk and informal family discussion before the official admission letter and fee package are issued.
                  </p>
                </div>
              </div>

              {/* Direct Contact Bar */}
              <div className="border border-slate-200 bg-slate-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-900">Need Immediate Admissions Assistance?</div>
                  <div className="text-xs text-slate-500">Our Admissions Desk is reachable directly on WhatsApp or telephone.</div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="tel:+256758611414"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <Phone className="size-3.5 text-blue-600" />
                    <span>+256 758 611 414</span>
                  </a>
                  <a
                    href="https://wa.me/256758611414?text=Hello%20Admissions%20Office%2C%20I%20would%20like%20to%20inquire%20about%20student%20placement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                  >
                    <Mail className="size-3.5" />
                    <span>WhatsApp Admissions</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>EDUREXA Multi-Tenant Front Site Architecture</div>
          <Button onClick={onClose} size="sm" variant="outline" className="rounded-none text-xs h-8">
            Back to Login Form
          </Button>
        </div>
      </div>
    </div>
  );
}
