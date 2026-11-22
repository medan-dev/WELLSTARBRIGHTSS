"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Trophy,
  Users,
  Calendar,
  Microscope,
  Palette,
  Globe2,
  Code2,
  Music,
  Dumbbell,
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Award,
  Building,
  HeartHandshake,
  HelpCircle,
  Sparkles,
  ChevronDown,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useSchoolBrand } from "@/context/SchoolBrandContext";
import { SchoolAutomationWizard } from "@/components/wizard/SchoolAutomationWizard";

// Campus Fallback Images
import heroImg from "@/assets/hero-campus.jpg";
import aboutImg from "@/assets/about-students.jpg";

function useCounter(target: number, duration = 1500, start = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return n;
}

function StatCard({
  value,
  label,
  suffix = "",
  icon: Icon,
}: {
  value: number;
  label: string;
  suffix?: string;
  icon?: any;
}) {
  const [visible, setVisible] = useState(false);
  const n = useCounter(value, 1600, visible);
  return (
    <div
      ref={(el) => {
        if (!el || visible) return;
        const io = new IntersectionObserver(
          ([e]) => e.isIntersecting && setVisible(true),
          { threshold: 0.4 }
        );
        io.observe(el);
      }}
      className="relative p-6 sm:p-7 rounded-none bg-card border border-border/80 shadow-sm hover-lift transition-all group text-center flex flex-col items-center justify-center space-y-2.5"
    >
      {Icon && (
        <div className="size-11 rounded-none bg-primary/10 text-primary grid place-items-center mb-1 group-hover:scale-105 transition-transform">
          <Icon className="size-5" />
        </div>
      )}
      <div className="font-display text-3xl sm:text-4xl font-black text-foreground tracking-tight">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function StandardCustomizableFrontSite() {
  const { brand } = useSchoolBrand();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const programs = [
    {
      icon: Microscope,
      title: "STEM & Sciences",
      desc: "Hands-on biological, physical, and chemistry laboratories with inquiry-led experiments and practical projects.",
      href: "/academics",
    },
    {
      icon: Palette,
      title: "Arts & Design",
      desc: "Studios for fine art, creative craftsmanship, technical drawing, ceramics, and multimedia visual communication.",
      href: "/academics",
    },
    {
      icon: Code2,
      title: "Computer Studies & ICT",
      desc: "Modern computer laboratories covering programming fundamentals, digital literacy, and modern software skills.",
      href: "/academics",
    },
    {
      icon: Globe2,
      title: "Languages & Humanities",
      desc: "Global perspectives across English literature, history, geography, economics, and civic leadership.",
      href: "/academics",
    },
    {
      icon: Music,
      title: "Music, Dance & Drama",
      desc: "Acclaimed school choir, traditional African and classical instruments, and national drama performances.",
      href: "/gallery",
    },
    {
      icon: Dumbbell,
      title: "Sports & Athletics",
      desc: "Track events, football, basketball, netball, and holistic wellness programmes designed for every student.",
      href: "/gallery",
    },
  ];

  const stages = [
    {
      name: "Lower Secondary (S.1–S.2)",
      desc: "Comprehensive foundation under the Competence-Based Curriculum (CBC) with practical science and computing.",
      tag: "Form 1 – Form 2",
    },
    {
      name: "Upper Secondary (S.3–S.4)",
      desc: "Specialized candidate mentorship for Uganda Certificate of Education (UCE) national examination distinction.",
      tag: "Form 3 – Form 4 • UNEB UCE",
    },
    {
      name: "Advanced Level (S.5–S.6)",
      desc: "Rigorous Science & Arts combinations preparing learners for top university degree programmes.",
      tag: "Senior 5 – Senior 6 • UNEB UACE",
    },
  ];

  const galleryPreview = [
    { src: "/gallery/stem-lab.png", title: "Modern Science Laboratories" },
    { src: "/gallery/computer-lab.png", title: "ICT & Computing Tech Hub" },
    { src: "/gallery/library-study.png", title: "Main Academic Library" },
    { src: "/gallery/sports-field.png", title: "Athletic & Sports Grounds" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#f26522] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR WITH SYSTEM WIZARD LAUNCHER                             */}
      {/* ========================================================================= */}
      <div className="bg-[#0b2256] text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[11px] bg-[#f26522] text-white px-2 py-0.5 font-bold">
              STANDALONE SCHOOL FRONT SITE
            </span>
            <span className="text-slate-300 text-xs">
              Center #{brand.unebCenterNumber} • {brand.location}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Automation Wizard Launcher */}
            <Button
              type="button"
              size="sm"
              onClick={() => setWizardOpen(true)}
              className="h-7 rounded-none text-[11px] bg-white text-[#0b2256] hover:bg-slate-100 font-bold gap-1 px-2.5 shadow-none"
            >
              <Sliders className="size-3 text-[#f26522]" />
              <span>Customize School Wizard</span>
            </Button>

            <a
              href={`tel:${brand.phone}`}
              className="hidden md:flex items-center gap-1 text-slate-200 hover:text-white"
            >
              <Phone className="size-3 text-[#f26522]" />
              <span>{brand.phone}</span>
            </a>

            <Link
              href="/demo"
              className="font-bold text-[#f26522] hover:underline flex items-center gap-1 pl-2 border-l border-white/20"
            >
              <span>Portal Login</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCHOOL NAVBAR                                                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo & School Name */}
          <Link href="/front-site" className="flex items-center gap-3">
            <div className="size-10 bg-[#0b2256] text-white font-black text-sm grid place-items-center rounded-none overflow-hidden border border-slate-300">
              {brand.badgeUrl ? (
                <img
                  src={brand.badgeUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                brand.badgeInitials || "DA"
              )}
            </div>
            <div>
              <div className="font-black text-base text-[#0b2256] tracking-tight uppercase leading-tight">
                {brand.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-tight">
                {brand.motto}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700">
            <Link
              href="/front-site"
              className="px-3.5 py-2 text-[#0b2256] font-bold border-b-2 border-[#0b2256]"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-3.5 py-2 hover:text-[#0b2256] transition-colors"
            >
              About
            </Link>
            <Link
              href="/academics"
              className="px-3.5 py-2 hover:text-[#0b2256] transition-colors"
            >
              Academics
            </Link>
            <Link
              href="/admissions"
              className="px-3.5 py-2 hover:text-[#0b2256] transition-colors"
            >
              Admissions
            </Link>
            <Link
              href="/gallery"
              className="px-3.5 py-2 hover:text-[#0b2256] transition-colors"
            >
              Photos & Campus Tour
            </Link>
            <Link
              href="/contact"
              className="px-3.5 py-2 hover:text-[#0b2256] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Direct Login Button */}
          <div className="flex items-center gap-2">
            <Link href="/demo">
              <Button
                size="sm"
                className="h-9 px-4 bg-[#0b2256] hover:bg-[#081a42] text-white text-xs font-bold rounded-none shadow-none"
              >
                Access Workstation
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (WITH CAMPUS PHOTOS & BADGE)                              */}
      {/* ========================================================================= */}
      <section className="relative bg-slate-900 text-white min-h-[580px] flex items-center overflow-hidden">
        {/* Real Campus Hero Image Background */}
        <div className="absolute inset-0">
          <Image
            src={heroImg}
            alt="School Campus"
            fill
            className="object-cover opacity-35 filter brightness-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2256]/95 via-[#0b2256]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
              <Sparkles className="size-3.5 text-[#f26522]" />
              <span>National Examination Center #{brand.unebCenterNumber} • {brand.level}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {brand.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              &ldquo;{brand.motto}&rdquo; — Nurturing academic rigor, holistic integrity, and transformative character through cutting-edge science labs, competence-based curriculum, and vibrant student life.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/admissions">
                <Button className="h-11 px-6 bg-[#f26522] hover:bg-[#d95316] text-white font-bold text-xs rounded-none shadow-none gap-2">
                  <span>Enrol for 2026 Academic Year</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button
                  variant="outline"
                  className="h-11 px-6 bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold text-xs rounded-none"
                >
                  Explore Campus Tour & Photos
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => setWizardOpen(true)}
                className="h-11 px-4 bg-white text-[#0b2256] hover:bg-slate-100 font-bold text-xs rounded-none border-none gap-1.5"
              >
                <Sliders className="size-3.5 text-[#f26522]" />
                <span>Customization Wizard</span>
              </Button>
            </div>
          </div>

          {/* Quick Info Badge Card on Right */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-none space-y-4 text-xs text-white">
            <div className="flex items-center gap-3 border-b border-white/15 pb-3">
              <div className="size-12 bg-white/20 grid place-items-center font-black text-sm">
                {brand.badgeInitials || "DA"}
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight">{brand.name}</div>
                <div className="text-[11px] text-slate-300 font-mono">UNEB Center #{brand.unebCenterNumber}</div>
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Curriculum:</span>
                <span className="font-semibold text-right">Uganda CBC / UNEB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Class Range:</span>
                <span className="font-semibold">Senior 1 to Senior 6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Enrollment Status:</span>
                <span className="font-bold text-emerald-400">Open for Admissions</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Admissions Desk:</span>
                <span className="font-semibold">{brand.phone}</span>
              </div>
            </div>

            <Link href="/demo" className="block pt-2">
              <Button className="w-full h-9 bg-white text-[#0b2256] hover:bg-slate-100 font-bold text-xs rounded-none shadow-none">
                Open Administrative Workstation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INSTITUTIONAL METRICS                                                  */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard value={1240} label="Enrolled Students" suffix="+" icon={Users} />
            <StatCard value={68} label="Expert Teaching Faculty" suffix=" Staff" icon={Award} />
            <StatCard value={99} label="UNEB Pass Distinction" suffix=".4%" icon={Trophy} />
            <StatCard value={100} label="Digital Campus Audit" suffix="%" icon={ShieldCheck} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ACADEMIC CURRICULUM & STAGES                                           */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f26522]">
            ACADEMIC EXCELLENCE & UNEB STANDARDS
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0b2256] tracking-tight">
            Curriculum Structure at {brand.name}
          </h2>
          <p className="text-sm text-slate-600">
            A comprehensive, competence-driven academic framework aligned with the Ministry of Education and UNEB guidelines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stages.map((st, i) => (
            <div
              key={i}
              className="p-6 border border-slate-200 bg-white rounded-none shadow-xs hover:border-[#0b2256] transition-colors space-y-3"
            >
              <div className="text-[10px] font-mono font-bold text-[#f26522] tracking-wider uppercase">
                {st.tag}
              </div>
              <h3 className="font-bold text-lg text-slate-900">{st.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              <Link
                href="/academics"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2256] hover:underline pt-2"
              >
                <span>Curriculum Details</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CAMPUS PHOTO TOUR & FACILITIES                                         */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[#f26522]">
                LEARNING ENVIRONMENT & FACILITIES
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Explore the {brand.name} Campus
              </h2>
            </div>
            <Link href="/gallery">
              <Button
                variant="outline"
                className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold rounded-none"
              >
                <span>View Full Photo Gallery</span>
                <ArrowRight className="size-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryPreview.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 overflow-hidden bg-slate-800 border border-white/10"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-xs font-bold text-white tracking-tight">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HEAD OF SCHOOL MESSAGE                                                 */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 border border-slate-200 bg-slate-50/50">
          <div className="lg:col-span-4">
            <div className="aspect-square bg-slate-200 relative overflow-hidden border border-slate-300">
              <Image
                src={aboutImg}
                alt={brand.directorName}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#f26522]">
              LEADERSHIP WELCOME
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2256] tracking-tight">
              A Message from the {brand.directorTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              &ldquo;{brand.directorBio}&rdquo;
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              At {brand.name}, our responsibility extends beyond delivering exceptional national examination grades. We build men and women of sound discipline, scientific aptitude, and moral leadership ready to shape society.
            </p>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-slate-900">{brand.directorName}</div>
                <div className="text-xs text-slate-500">{brand.directorTitle} • {brand.name}</div>
              </div>
              <div className="font-serif italic text-sm text-slate-500 border-b border-slate-400">
                Official Signature
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-[#0b2256] text-white py-12 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-white/20 grid place-items-center font-bold text-xs">
                {brand.badgeInitials || "DA"}
              </div>
              <div className="font-bold text-sm tracking-tight">{brand.name}</div>
            </div>
            <p className="text-slate-300 max-w-sm">
              &ldquo;{brand.motto}&rdquo; — {brand.level}. Examination Center #{brand.unebCenterNumber}.
            </p>
            <div className="text-slate-400">
              {brand.location}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider">Quick Navigation</div>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/front-site" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About the School</Link></li>
              <li><Link href="/academics" className="hover:text-white">Academics & UNEB</Link></li>
              <li><Link href="/admissions" className="hover:text-white">Admissions & Fees</Link></li>
              <li><Link href="/gallery" className="hover:text-white">Photos & Campus Tour</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Administration</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider">School Administration</div>
            <div className="space-y-1 text-slate-300">
              <div>Phone: {brand.phone}</div>
              <div>Email: {brand.email}</div>
              <div>WhatsApp: {brand.whatsapp}</div>
            </div>
            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => setWizardOpen(true)}
                className="h-8 rounded-none text-xs bg-white text-[#0b2256] hover:bg-slate-100 font-bold"
              >
                <Sliders className="size-3 mr-1 text-[#f26522]" />
                Customize School
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 {brand.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demo" className="text-slate-300 hover:text-white">Administrative Portal</Link>
            <span>•</span>
            <Link href="/teacher" className="text-slate-300 hover:text-white">Teacher Gradebook</Link>
            <span>•</span>
            <Link href="/student" className="text-slate-300 hover:text-white">Student Portal</Link>
          </div>
        </div>
      </footer>

      {/* System Automation Wizard Modal */}
      <SchoolAutomationWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
}
