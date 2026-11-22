"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sliders,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSchoolBrand } from "@/context/SchoolBrandContext";
import { SchoolAutomationWizard } from "@/components/wizard/SchoolAutomationWizard";

interface NavLink {
  href: string;
  label: string;
}

export function SchoolNavbar() {
  const pathname = usePathname();
  const { brand } = useSchoolBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const schoolNavLinks: NavLink[] = [
    { href: "/front-site", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/academics", label: "Academics & UNEB" },
    { href: "/admissions", label: "Admissions" },
    { href: "/gallery", label: "Campus Life & Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. INSTITUTIONAL TOP ANNOUNCEMENT & UTILITY BAR                           */}
      {/* ========================================================================= */}
      <div className="bg-[#0b2256] text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left: Accreditation & Location */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] tracking-wider uppercase font-extrabold bg-[#f26522] text-white px-2 py-0.5 rounded-none">
              UNEB Center #{brand.unebCenterNumber}
            </span>
            <span className="text-slate-300 text-[11px] hidden md:inline">
              {brand.location}
            </span>
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-amber-300 font-medium text-[11px] hidden sm:inline">
              Admissions Open for 2026 Academic Year
            </span>
          </div>

          {/* Right: Direct Hotlines & Portal Gateway */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <a
              href={`tel:${brand.phone}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="size-3 text-[#f26522]" />
              <span className="font-semibold">{brand.phone}</span>
            </a>

            <span className="text-white/20 hidden sm:inline">|</span>

            {/* Customization Wizard Launcher */}
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Launch System Customization Wizard"
            >
              <Sliders className="size-3 text-amber-400" />
              <span>Customize Institution</span>
            </button>

            <span className="text-white/20 hidden sm:inline">|</span>

            {/* Portals Quick Access Dropdown / Link */}
            <Link
              href="/demo"
              className="font-bold text-[#f26522] hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Portals Login</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN INSTITUTIONAL HEADER                                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* School Brand / Crest & Typography */}
          <Link href="/front-site" className="flex items-center gap-3.5 group">
            <div className="size-12 rounded-none bg-[#0b2256] text-white font-black text-base grid place-items-center shrink-0 border border-slate-300 shadow-xs overflow-hidden">
              {brand.badgeUrl ? (
                <img
                  src={brand.badgeUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="font-serif tracking-widest">{brand.badgeInitials || "SC"}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-serif font-black text-base sm:text-lg text-[#0b2256] tracking-tight uppercase leading-tight truncate">
                {brand.name}
              </div>
              <div className="text-[11px] text-slate-500 font-medium italic tracking-wide truncate max-w-md">
                &ldquo;{brand.motto}&rdquo;
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700">
            {schoolNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-none transition-colors ${
                    isActive
                      ? "text-[#0b2256] font-bold border-b-2 border-[#0b2256]"
                      : "text-slate-700 hover:text-[#0b2256] hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link href="/admissions">
              <Button
                size="sm"
                className="hidden sm:inline-flex h-9 px-4 bg-[#0b2256] hover:bg-[#081a42] text-white text-xs font-bold rounded-none shadow-none gap-1.5"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>

            <Link href="/demo">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 border-slate-300 text-slate-800 text-xs font-semibold rounded-none hover:bg-slate-100"
              >
                Portals
              </Button>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-fade-in">
            <div className="space-y-1">
              {schoolNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0b2256] rounded-none transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link href="/admissions">
                <Button className="w-full h-9 bg-[#0b2256] hover:bg-[#081a42] text-white text-xs font-bold rounded-none shadow-none">
                  Apply Online
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" className="w-full h-9 border-slate-300 text-xs font-bold rounded-none">
                  Portal Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* System Automation Wizard Modal */}
      <SchoolAutomationWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );
}
