"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  Menu, X, Sun, Moon, ChevronDown, 
  GraduationCap, BookOpen, ShieldCheck, ArrowRight, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
] as const;

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const isDark = !dark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("ns_theme", isDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white active:scale-95 border border-white/20 backdrop-blur-md shadow-xs flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="size-4 text-amber-300 animate-spin-once" /> : <Moon className="size-4 text-white" />}
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const portalDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setPortalMenuOpen(false);
  }, [pathname]);

  // Click outside to close portal dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (portalDropdownRef.current && !portalDropdownRef.current.contains(e.target as Node)) {
        setPortalMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Completely Transparent Header - No Background, No Box, Seamlessly Blends with Hero */}
      <header className="absolute top-0 inset-x-0 z-50 py-4 lg:py-6 bg-transparent border-0 shadow-none">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <nav className="flex items-center justify-between bg-transparent border-0 shadow-none">
            {/* Prominent Stylish Logo */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative size-11 sm:size-12 group-hover:scale-105 transition-transform duration-300">
                <Image src={logo} alt="Wellstar Bright Logo" className="object-contain w-full h-full" priority />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white drop-shadow-md group-hover:text-amber-300 transition-colors">
                  Wellstar Bright
                </span>
                <span className="text-[11px] text-amber-300/90 font-bold -mt-0.5 tracking-widest uppercase drop-shadow-xs">
                  Secondary School • Mukono
                </span>
              </div>
            </Link>

            {/* Right side navigation & CTAs */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-12">
              {/* Desktop Nav Links — Increased Font Size & Stylish Hover Underlines (No Background) */}
              <ul className="flex items-center gap-7 xl:gap-9 bg-transparent border-0 shadow-none">
                {links.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          "relative text-[15px] xl:text-base font-bold tracking-tight transition-all duration-200 py-1.5 inline-block drop-shadow-sm",
                          active 
                            ? "text-amber-400 font-extrabold after:content-[''] after:absolute after:-bottom-1 after:inset-x-0 after:h-[2.5px] after:bg-gradient-to-r after:from-amber-400 after:to-orange-500 after:rounded-full after:shadow-sm" 
                            : "text-white/90 hover:text-white after:content-[''] after:absolute after:-bottom-1 after:inset-x-0 after:h-[2px] after:bg-white/60 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200",
                        )}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Right CTAs & Portal Switcher */}
              <div className="flex items-center gap-3.5">
                <ThemeToggle />

                {/* Portal Access Dropdown */}
                <div className="relative" ref={portalDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition-all active:scale-95 shadow-sm hover:border-white/40"
                  >
                    <GraduationCap className="size-4 text-amber-300" />
                    Portals
                    <ChevronDown className={cn("size-3.5 text-white/80 transition-transform duration-200", portalMenuOpen && "rotate-180")} />
                  </button>

                  {portalMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 p-2 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 shadow-elegant animate-scale-in z-50 space-y-1.5 text-white">
                      <div className="px-3 py-1.5 text-[11px] font-extrabold text-white/50 uppercase tracking-wider">
                        Select School Portal
                      </div>
                      <Link
                        href="/student"
                        className="flex items-center gap-3 p-3 rounded-xl text-xs font-semibold text-white hover:bg-blue-600/30 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          <GraduationCap className="size-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Student Portal</div>
                          <div className="text-[11px] text-white/70 font-normal">Results, homework & timetable</div>
                        </div>
                      </Link>

                      <Link
                        href="/teacher"
                        className="flex items-center gap-3 p-3 rounded-xl text-xs font-semibold text-white hover:bg-orange-600/30 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-400/30">
                          <BookOpen className="size-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Teacher Portal</div>
                          <div className="text-[11px] text-white/70 font-normal">Attendance & marks grading</div>
                        </div>
                      </Link>

                      <Link
                        href="/admin"
                        className="flex items-center gap-3 p-3 rounded-xl text-xs font-semibold text-white hover:bg-white/15 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/10 text-amber-300 border border-white/20">
                          <ShieldCheck className="size-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Admin Console</div>
                          <div className="text-[11px] text-white/70 font-normal">Full control & notice studio</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                <Button asChild size="default" className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-extrabold px-6 h-10 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-0 text-sm">
                  <Link href="/apply">Apply Now</Link>
                </Button>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <ThemeToggle />
              <button
                className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition-smooth"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
              >
                <Menu className="size-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Backdrop for mobile */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-[320px] bg-slate-950/95 backdrop-blur-2xl border-r border-white/15 flex flex-col lg:hidden text-white",
          "shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image src={logo} alt="Wellstar Bright Logo" className="w-9 h-9 object-contain" />
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Wellstar Bright
            </span>
          </Link>
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-smooth text-white/70 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
          <div className="text-[11px] font-extrabold text-white/50 uppercase tracking-wider px-3">
            Main Navigation
          </div>
          <ul className="flex flex-col gap-1.5">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-2xl text-base font-bold transition-all",
                      active ? "text-amber-400 bg-white/15 font-extrabold border border-white/15" : "text-white/80 hover:bg-white/10",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="text-[11px] font-extrabold text-white/50 uppercase tracking-wider px-3">
              School Portals
            </div>
            <Link
              href="/student"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold bg-blue-500/20 text-blue-200 border border-blue-400/25"
            >
              <GraduationCap className="size-5 text-blue-300" /> Student Portal
            </Link>
            <Link
              href="/teacher"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold bg-orange-500/20 text-orange-200 border border-orange-400/25"
            >
              <BookOpen className="size-5 text-orange-300" /> Teacher Portal
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold bg-white/10 text-white border border-white/15"
            >
              <ShieldCheck className="size-5 text-amber-300" /> Admin Portal
            </Link>
          </div>
        </nav>

        {/* Drawer footer CTA */}
        <div className="p-5 border-t border-white/10">
          <Button asChild className="w-full h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-extrabold rounded-2xl shadow-md border-0 text-sm">
            <Link href="/apply" onClick={() => setOpen(false)}>Apply for Admission</Link>
          </Button>
        </div>
      </aside>
    </>
  );
}
