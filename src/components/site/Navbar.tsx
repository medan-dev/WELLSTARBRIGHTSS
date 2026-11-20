"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  // STRICTLY THE EXACT 6 LINKS REQUESTED BY USER:
  // [Home] [Features] [Pricing] [Demo] [Documentation] [Help & Support]
  const mainNavLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#demo", label: "Demo" },
    { href: "/documentation", label: "Documentation" },
    { href: "/#support", label: "Help & Support" },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY / ANNOUNCEMENT BAR                                         */}
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

          {/* Right: Direct Sales WhatsApp */}
          <div className="flex items-center gap-3 text-[11px]">
            <a
              href="https://wa.me/256758611414"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-semibold transition-colors"
            >
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>WhatsApp: +256 758 611 414</span>
            </a>
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

            <Link
              href="/documentation"
              className={cn(
                "transition-colors hover:text-[#f26522]",
                pathname?.startsWith("/documentation") ? "text-[#f26522]" : "text-slate-700"
              )}
            >
              Documentation
            </Link>

            <a href="/#support" className="transition-colors hover:text-[#f26522]">
              Help & Support
            </a>
          </nav>

          {/* Desktop Right CTA: Try Out Demo */}
          <div className="hidden lg:flex items-center gap-3">
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
