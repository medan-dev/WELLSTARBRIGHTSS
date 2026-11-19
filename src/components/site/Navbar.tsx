"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Lock,
  Layers,
  FileSpreadsheet,
  Receipt,
  Users,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);

  const solutionsRef = useRef<HTMLDivElement>(null);
  const portalsRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSolutionsDropdownOpen(false);
    setPortalsDropdownOpen(false);
  }, [pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) {
        setSolutionsDropdownOpen(false);
      }
      if (portalsRef.current && !portalsRef.current.contains(e.target as Node)) {
        setPortalsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const mainNavLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#demo", label: "Demo" },
    { href: "/#documentation", label: "Documentation" },
    { href: "/#support", label: "Help & Support" },
  ];

  const solutionModules = [
    {
      title: "Academic & UNEB Engine",
      desc: "Automatic division calculation, report card generation & grading",
      href: "/#modules",
      icon: BookOpen,
      iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Fee Collection & Anti-Leakage",
      desc: "Automated student ledgers, cashier reconciliations & receipting",
      href: "/#modules",
      icon: Receipt,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Multi-Campus Fleet Ops",
      desc: "Centralized super-admin dashboard for school groups & chains",
      href: "/#modules",
      icon: Layers,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      title: "Parent & Student Portals",
      desc: "Live homework submission, exam results, and digital meal cards",
      href: "/#modules",
      icon: Users,
      iconColor: "text-orange-600 bg-orange-50 border-orange-200",
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY / ANNOUNCEMENT BAR (SchoolHive Style)                      */}
      {/* ========================================================================= */}
      <div className="bg-[#0b2256] text-white text-xs py-2 px-4 border-b border-[#081a42]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <a
              href="tel:+256758611414"
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="size-3 text-[#f26522]" />
              <span className="font-semibold">+256 758 611 414</span>
            </a>
            <a
              href="mailto:sales@edurexa.com"
              className="hidden sm:flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Mail className="size-3 text-[#f26522]" />
              <span>sales@edurexa.com</span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-[11px]">
              <MapPin className="size-3 text-slate-400" />
              <span>Kampala, Uganda</span>
            </span>
          </div>

          {/* Right: Super Admin */}
          <div className="flex items-center gap-3 text-[11px]">
            <Link
              href="/super-admin"
              target="_blank"
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white font-semibold transition-colors"
            >
              <Lock className="size-3 text-amber-400" />
              <span>Super Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER (Sticky, Pure Light Theme, Borderless EDUREXA Logo)       */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_2px_10px_rgba(11,34,86,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with NO border container, 100% borderless & transparent */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <Image
              src={edurexaHorizontal}
              alt="EDUREXA Logo"
              className="h-10 sm:h-11 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links (Exact 6 Links Requested) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold text-slate-700">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-[#f26522]",
                pathname === "/" ? "text-[#f26522]" : "text-slate-700"
              )}
            >
              Home
            </Link>

            <a href="/#features" className="transition-colors hover:text-[#f26522]">
              Features
            </a>

            <a href="/#pricing" className="transition-colors hover:text-[#f26522]">
              Pricing
            </a>

            <a href="/#demo" className="transition-colors hover:text-[#f26522]">
              Demo
            </a>

            <a href="/#documentation" className="transition-colors hover:text-[#f26522]">
              Documentation
            </a>

            <a href="/#support" className="transition-colors hover:text-[#f26522]">
              Help & Support
            </a>
          </nav>

          {/* Desktop Right CTAs: Portals & Schedule Demo */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Portals Access Menu */}
            <div className="relative" ref={portalsRef}>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setPortalsDropdownOpen(!portalsDropdownOpen)}
                className="text-xs font-semibold rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-9.5 px-3.5 gap-1.5 shadow-xs"
              >
                <GraduationCap className="size-4 text-[#0b2256]" />
                <span>Portals Login</span>
                <ChevronDown
                  className={cn(
                    "size-3 text-slate-400 transition-transform duration-200",
                    portalsDropdownOpen && "rotate-180"
                  )}
                />
              </Button>

              {portalsDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 z-50 animate-in fade-in-0 zoom-in-95 duration-150 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Direct Portal Access
                  </div>
                  <Link
                    href="/student"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                      <GraduationCap className="size-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#0b2256]">
                        Student Portal
                      </div>
                      <div className="text-[10px] text-slate-500">Results, cards & timetable</div>
                    </div>
                  </Link>

                  <Link
                    href="/teacher"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-orange-50 text-[#f26522] border border-orange-200">
                      <BookOpen className="size-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#0b2256]">
                        Teacher Portal
                      </div>
                      <div className="text-[10px] text-slate-500">Marks grading & attendance</div>
                    </div>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#0b2256]">
                        School Admin
                      </div>
                      <div className="text-[10px] text-slate-500">Fees, students & finance</div>
                    </div>
                  </Link>

                  <div className="pt-1 border-t border-slate-100">
                    <Link
                      href="/super-admin"
                      target="_blank"
                      onClick={() => setPortalsDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-[#0b2256]/10 text-[#0b2256] border border-[#0b2256]/20">
                        <Lock className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0b2256] flex items-center gap-1">
                          <span>Super Admin</span>
                          <ExternalLink className="size-3 opacity-60" />
                        </div>
                        <div className="text-[10px] text-slate-500">Multi-tenant headquarters</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Try Out Demo Button */}
            <a href="https://wa.me/256758611414" target="_blank" rel="noreferrer">
              <Button className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg text-xs font-bold px-4 h-9.5 shadow-sm transition-colors gap-1.5">
                <span>Try Out Demo</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </a>
          </div>

          {/* Mobile Right Action + Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <a href="https://wa.me/256758611414" target="_blank" rel="noreferrer">
              <Button
                size="sm"
                className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg text-xs font-bold px-3 h-8.5 shadow-sm"
              >
                Demo
              </Button>
            </a>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE OFFCANVAS DRAWER (Clean Pure Light Theme, Zero Dark Theme)      */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src={edurexaHorizontal}
                  alt="EDUREXA Logo"
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Primary Links */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Navigation
                </div>
                {mainNavLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0b2256] transition-colors"
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Portals Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  School Portals
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/student"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-[calc(50%-0.25rem)] p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors flex flex-col gap-1.5"
                  >
                    <GraduationCap className="size-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Student</span>
                    <span className="text-[10px] text-slate-500">Results & timetable</span>
                  </Link>

                  <Link
                    href="/teacher"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-[calc(50%-0.25rem)] p-3 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition-colors flex flex-col gap-1.5"
                  >
                    <BookOpen className="size-4 text-[#f26522]" />
                    <span className="text-xs font-bold text-slate-900">Teacher</span>
                    <span className="text-[10px] text-slate-500">Marks & grading</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-[calc(50%-0.25rem)] p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors flex flex-col gap-1.5"
                  >
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Admin</span>
                    <span className="text-[10px] text-slate-500">Fees & records</span>
                  </Link>

                  <Link
                    href="/super-admin"
                    target="_blank"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-[calc(50%-0.25rem)] p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors flex flex-col gap-1.5"
                  >
                    <Lock className="size-4 text-[#0b2256]" />
                    <span className="text-xs font-bold text-[#0b2256]">Super Admin</span>
                    <span className="text-[10px] text-slate-500">Platform fleet</span>
                  </Link>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Headquarters
                </div>
                <div className="px-3 space-y-2">
                  <a href="tel:+256758611414" className="flex items-center gap-2 hover:text-[#f26522]">
                    <Phone className="size-3.5 text-[#f26522]" />
                    <span>+256 758 611 414</span>
                  </a>
                  <a href="mailto:sales@edurexa.com" className="flex items-center gap-2 hover:text-[#f26522]">
                    <Mail className="size-3.5 text-[#f26522]" />
                    <span>sales@edurexa.com</span>
                  </a>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="size-3.5 text-slate-400" />
                    <span>Kampala, Uganda</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="p-4 border-t border-slate-200 space-y-2">
              <a
                href="https://wa.me/256758611414"
                target="_blank"
                rel="noreferrer"
                className="w-full block"
              >
                <Button className="w-full bg-[#f26522] hover:bg-[#d95314] text-white rounded-xl text-sm font-bold h-11 gap-2 shadow-sm">
                  <span>Schedule Executive Demo</span>
                  <ArrowRight className="size-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
