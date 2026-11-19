"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function EdurexaMarketingPage() {
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

  // Estimated annual leakage prevented calculation
  const estimatedSavings = Math.round((studentsCount * 1800000 * 0.045) / 1000000); // 4.5% leakage recovery in Millions UGX

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="EDUREXA Logo" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-black text-2xl tracking-tight text-white flex items-center gap-2">
                <span>EDUREXA</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Ecosystem
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart School Management Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/admin" target="_blank">
              <Button variant="ghost" className="text-sm font-semibold text-slate-300 hover:text-white">
                Client Portal
              </Button>
            </Link>

            <Link href="/super-admin" target="_blank">
              <Button variant="outline" className="hidden sm:flex text-sm font-semibold rounded-2xl border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200">
                SaaS Console
              </Button>
            </Link>

            <a href="#demo-form">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold px-5 h-11 shadow-lg shadow-blue-600/30">
                Book Executive Demo
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2">
            <Sparkles className="size-4" />
            Empowering Schools. Simplifying Education.
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            The Complete Digital Ecosystem for Modern Schools.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            <strong>EDUREXA</strong> is an intelligent, cloud-powered, multi-tenant school operating system designed to centralize operations, eliminate financial leakage, and connect administrators, teachers, students, and parents across all your campuses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="#demo-form" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-base font-bold px-8 h-14 shadow-xl shadow-blue-600/30 gap-2">
                <span>Schedule a Boardroom Demo</span>
                <ArrowRight className="size-5" />
              </Button>
            </a>

            <a
              href="https://wa.me/256701116781?text=Hello%20EDUREXA%20Team,%20I%20would%20like%20to%20learn%20more%20about%20the%20multi-campus%20school%20management%20platform."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-2xl text-base font-bold px-6 h-14 gap-2">
                <Phone className="size-5 text-emerald-400" />
                <span>Talk to Sales: +256 701 116 781</span>
              </Button>
            </a>
          </div>

          {/* Social Proof / Flagship Client Proof Point */}
          <div className="pt-10 border-t border-slate-800/80 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">
              FLAGSHIP ONBOARDED INSTITUTION
            </p>
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black grid place-items-center">
                  WB
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Wellstar Bright Educational Group</div>
                  <div className="text-xs text-slate-400">4,950+ Students &bull; Mukono Main & Jinja Branch</div>
                </div>
              </div>
              <Link href="/admin/dashboard" target="_blank">
                <Button size="sm" variant="outline" className="text-xs font-bold rounded-xl border-slate-600 text-slate-300">
                  <span>View Live Tenant</span>
                  <ArrowRight className="size-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Brand Values Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="outline" className="text-blue-400 border-blue-500/30 text-xs font-bold px-3 py-1">
            BUILT FOR SCALE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Six Pillars of the EDUREXA Ecosystem
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Engineered specifically for leading schools, colleges, and multi-campus conglomerates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Innovation */}
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-3xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 grid place-items-center font-bold">
              <Sparkles className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Innovation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cloud-native architecture supporting automated fee schedules, smart biometric meal cards, and automated term billing without manual spreadsheet chaos.
            </p>
          </div>

          {/* 2. Excellence */}
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-3xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-400 grid place-items-center font-bold">
              <Award className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Excellence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Double-entry chart of accounts, automated statutory tax filing (URA PAYE, NSSF 15%, WHT 6%), and audited income statements ready for school board reviews.
            </p>
          </div>

          {/* 3. Efficiency */}
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-3xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-400 grid place-items-center font-bold">
              <Layers className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Efficiency</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Multi-campus management supporting up to 20 branch campuses per school group with one-click executive switching and consolidated financial rollups.
            </p>
          </div>

          {/* 4. Connectivity */}
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-3xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-cyan-500/10 text-cyan-400 grid place-items-center font-bold">
              <Globe className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Connectivity</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect directors, bursars, headteachers, students, and parents seamlessly with automated WhatsApp alerts and instant payment receipting.
            </p>
          </div>

          {/* 5. Intelligence */}
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-3xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-400 grid place-items-center font-bold">
              <BarChart3 className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Intelligence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Predictive fee arrears analytics, automated deficit alerts, and enrollment trends to protect institutional cash flow before term start.
            </p>
          </div>

          {/* 6. Reliability */}
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-3xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center font-bold">
              <HardDrive className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Reliability</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bank-grade continuous WAL Point-in-Time Recovery (RPO &lt; 1s), zero-loss offline POS cash registers, and immutable SHA-256 backup snapshots.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="py-16 bg-slate-800/40 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Calculate Your Institutional Fee Recovery
            </h3>
            <p className="text-sm text-slate-400">
              See how much revenue leakage EDUREXA prevents with double-entry ledgers and offline POS registers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-300">
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
                <div className="flex justify-between text-sm font-bold text-slate-300">
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
                <div className="text-xs uppercase font-bold tracking-wider text-blue-400">ESTIMATED REVENUE LEAKAGE PREVENTED ANNUALLY</div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  UGX {estimatedSavings.toLocaleString()} Million+
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Based on eliminating unrecorded cash receipts and uncollected fee arrears.</div>
              </div>
              <a href="#demo-form">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl px-6 h-12">
                  Protect Your Revenue
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Demo Booking Form */}
      <section id="demo-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1">
            ENTERPRISE CONTRACTS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Schedule an Executive Boardroom Demo
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto">
            Experience the multi-campus hierarchy, offline cashier POS registers, and instant financial reports live.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {bookingSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 grid place-items-center mx-auto">
                <Check className="size-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Demo Request Received!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you, <strong>{bookingData.contactPerson}</strong>. Our enterprise team will contact you on WhatsApp ({bookingData.phone}) within 2 hours to confirm your demonstration.
              </p>
              <a
                href={`https://wa.me/256701116781?text=Hello%20EDUREXA,%20I%20just%20submitted%20a%20demo%20request%20for%20${encodeURIComponent(
                  bookingData.schoolName
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl h-12 px-6 mt-2">
                  Chat With Enterprise Team on WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-200">School / Conglomerate Name *</Label>
                  <Input
                    placeholder="e.g. St. Lawrence Educational Conglomerate"
                    value={bookingData.schoolName}
                    onChange={(e) => setBookingData({ ...bookingData, schoolName: e.target.value })}
                    required
                    className="h-12 rounded-2xl bg-slate-900 border-slate-700 text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-200">Your Full Name & Title *</Label>
                  <Input
                    placeholder="e.g. Dr. Ronald Mukasa (Director / Principal)"
                    value={bookingData.contactPerson}
                    onChange={(e) => setBookingData({ ...bookingData, contactPerson: e.target.value })}
                    required
                    className="h-12 rounded-2xl bg-slate-900 border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-200">WhatsApp / Direct Phone *</Label>
                  <Input
                    placeholder="+256 701 116 781"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    required
                    className="h-12 rounded-2xl bg-slate-900 border-slate-700 text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-200">Official Email *</Label>
                  <Input
                    type="email"
                    placeholder="director@school.sc.ug"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    required
                    className="h-12 rounded-2xl bg-slate-900 border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-200">Number of Campuses to Onboard *</Label>
                <select
                  value={bookingData.campuses}
                  onChange={(e) => setBookingData({ ...bookingData, campuses: e.target.value })}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 Single Campus</option>
                  <option value="2-5">2 to 5 Campuses (Most Common)</option>
                  <option value="6-10">6 to 10 Campuses</option>
                  <option value="11-20">11 to 20 Campuses (Enterprise Conglomerate Tier)</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-14 text-base font-bold shadow-lg shadow-blue-600/30"
              >
                Confirm Executive Demo Request
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="EDUREXA Logo" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-bold text-white text-base">EDUREXA</span>
              <p className="text-xs text-slate-500">The Complete Digital Ecosystem for Modern Schools.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/super-admin" className="hover:text-white">
              Super Admin Console
            </Link>
            <Link href="/admin/dashboard" className="hover:text-white">
              Wellstar Flagship School
            </Link>
            <a href="https://wa.me/256701116781" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">
              WhatsApp Sales: +256 701 116 781
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
