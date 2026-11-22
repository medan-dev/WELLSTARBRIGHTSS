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
  Sliders,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { siteContent as defaultSiteContent } from "@/components/admin/data";
import { getSiteContent } from "../actions";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import heroImg from "@/assets/hero-campus.jpg";
import aboutImg from "@/assets/about-students.jpg";
import { useSchoolBrand } from "@/context/SchoolBrandContext";
import { SchoolAutomationWizard } from "@/components/wizard/SchoolAutomationWizard";

function useCounterLocal(target: number, duration = 1400, start = false) {
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
  const n = useCounterLocal(value, 1500, visible);
  return (
    <div
      ref={(el) => {
        if (!el || visible) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), {
          threshold: 0.3,
        });
        io.observe(el);
      }}
      className="p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm hover-lift transition-all text-center flex flex-col items-center justify-center space-y-3"
    >
      {Icon && (
        <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-1 shadow-xs">
          <Icon className="size-6" />
        </div>
      )}
      <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground font-semibold uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function StandardOriginalFrontSite() {
  const { brand } = useSchoolBrand();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [content, setContent] = useState(defaultSiteContent);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [paused, setPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqFilter, setFaqFilter] = useState<string>("All");

  const programs = [
    {
      icon: Microscope,
      title: "STEM & Natural Sciences",
      desc: "Fully equipped chemistry, physics, and biology laboratories emphasizing empirical inquiry, student experiments, and practical national exam mastery.",
      href: "/academics",
    },
    {
      icon: Code2,
      title: "ICT & Computing Tech Hub",
      desc: "High-speed networked computer labs delivering digital literacy, algorithm design, software productivity, and modern computing curriculum.",
      href: "/academics",
    },
    {
      icon: Palette,
      title: "Fine Art & Vocational Design",
      desc: "Dedicated creative ateliers fostering technical drawing, ceramics, graphic representation, and entrepreneurship projects.",
      href: "/academics",
    },
    {
      icon: Globe2,
      title: "Humanities & Social Sciences",
      desc: "Broad international perspective spanning literature in English, history, geography, divinity, and civic governance.",
      href: "/academics",
    },
    {
      icon: Music,
      title: "Music, Dance & Drama (MDD)",
      desc: "Renowned choral performance, classical and indigenous instruments, and stage theatre that instill public confidence and cultural pride.",
      href: "/gallery",
    },
    {
      icon: Dumbbell,
      title: "Athletics & Physical Education",
      desc: "Expansive sports pitch, basketball court, track athletics, and inter-house leagues promoting physical endurance, teamwork, and health.",
      href: "/gallery",
    },
  ];

  const parentTestimonials = [
    {
      id: 1,
      name: "Dr. Ronald Mukasa",
      role: "Parent of S.4 Candidate",
      avatar: "RM",
      rating: 5,
      content: `${brand.name} has been a tremendous blessing to our family. The balance between academic discipline and deep moral character is exactly what secondary learners need. My son's performance in national trial exams has been exceptional.`,
      highlight: "Exemplary Academic Progress",
    },
    {
      id: 2,
      name: "Mrs. Sarah Namubiru",
      role: "Alumna & Software Engineer",
      avatar: "SN",
      rating: 5,
      content: `The computer studies and science laboratories at ${brand.name} gave me the foundational confidence to pursue computer science at university. The teachers genuinely mentor each student as an individual.`,
      highlight: "Strong STEM Foundation",
    },
    {
      id: 3,
      name: "Eng. Samuel Kizza",
      role: "Parent of S.6 Scholar",
      avatar: "SK",
      rating: 5,
      content: `The boarding environment is safe, well-supervised, and disciplined. As a parent working in Kampala, I have total peace of mind knowing the school administration upholds high welfare and nutrition standards.`,
      highlight: "Safe & Disciplined Boarding",
    },
    {
      id: 4,
      name: "Mrs. Gloria Nabirye",
      role: "Parent of S.1 Student",
      avatar: "GN",
      rating: 5,
      content: `The transition from primary school to secondary can be difficult, but ${brand.name}'s admissions and pastoral care team made our daughter feel welcomed from day one. Her marks and confidence have blossomed.`,
      highlight: "Nurturing Pastoral Care",
    },
  ];

  const institutionalFaqs = [
    {
      category: "Academics",
      question: `What curriculum and national examination standards are followed at ${brand.name}?`,
      answer: `${brand.name} operates under the official Uganda Ministry of Education and Sports curriculum. In Lower Secondary (S.1–S.2), we deliver the Competence-Based Curriculum (CBC) with practical projects. In Upper Secondary (S.3–S.4), learners prepare for the Uganda Certificate of Education (UCE), followed by Advanced Level (S.5–S.6) Uganda Advanced Certificate of Education (UACE) Science and Arts combinations.`,
    },
    {
      category: "Admissions",
      question: "What are the entry requirements for S.1 and S.5 intakes?",
      answer: "For Senior One (S.1), applicants present their official Primary Leaving Examination (PLE) result slip and primary school leaving certificate. For Senior Five (S.5), admission is based on the Uganda Certificate of Education (UCE) result slip matching chosen subject combinations. A welcoming family interview is conducted prior to issuing the formal admission letter.",
    },
    {
      category: "Boarding",
      question: `What are the boarding facilities, safety measures, and student healthcare provisions like?`,
      answer: `Our boarding section features clean, spacious, single-gender dormitories situated within a fully secured campus perimeter monitored 24/7. The campus has clean borehole water, a dedicated resident nurse operating an on-site sickbay, and nutritious, balanced hot meals served three times daily in our dining hall.`,
    },
    {
      category: "Fees",
      question: "How are school fees structured, and are flexible payment terms or bursaries available?",
      answer: `${brand.name} maintains moderate, transparent, and all-inclusive fee structures covering tuition, boarding, laboratory access, and educational materials. Flexible installment schedules are arranged with the Bursar's office, and merit-based bursaries are awarded to top performers in national examinations.`,
    },
  ];

  useEffect(() => {
    getSiteContent().then((data: any) => {
      if (data) setContent(data);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIdx = Math.max(0, parentTestimonials.length - cardsToShow);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActiveReviewIdx((prev) => (prev >= maxIdx ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(t);
  }, [paused, maxIdx]);

  return (
    <SiteLayout>
      {/* ========================================================================= */}
      {/* 1. CINEMATIC INSTITUTIONAL HERO                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#07132e] text-white min-h-[580px] lg:min-h-[640px] flex items-center pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Real Campus Photography Background with Editorial Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImg}
            alt="School Campus Grounds"
            className="size-full object-cover filter brightness-[0.78] contrast-105"
            placeholder="blur"
            priority
          />
          {/* Subtle directional vignette: deep navy on the left for contrast, fading naturally across image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07132e] via-[#07132e]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07132e] via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Statement */}
            <div className="lg:col-span-8 space-y-6">
              {/* Institution Center Kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>UNEB National Examination Center #{brand.unebCenterNumber} • S.1 — S.6 Day & Boarding</span>
              </div>

              {/* Dignified, Human Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
                Nurturing Intellectual Distinction & Moral Purpose.
              </h1>

              {/* Mission Prose */}
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed">
                At <span className="font-semibold text-white">{brand.name}</span>, we combine rigorous national curriculum standards with disciplined Christian values, practical innovation in modern science laboratories, and dedicated teacher mentorship to prepare Uganda&apos;s next generation of leaders.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#f26522] hover:bg-[#d95316] text-white font-bold h-12 px-7 rounded-none text-sm shadow-md gap-2"
                >
                  <Link href="/admissions">
                    <span>Apply for 2026 Intake</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold h-12 px-6 rounded-none text-sm backdrop-blur-md"
                >
                  <Link href="/about">
                    <span>About Our Heritage</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-slate-200 hover:text-white hover:bg-white/10 h-12 px-5 rounded-none text-sm font-medium"
                >
                  <Link href="/contact">
                    <span>Campus Tour & Map</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Hero Summary Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-none text-xs text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                <div className="size-12 bg-[#0b2256] border border-amber-400 grid place-items-center font-serif font-black text-sm text-white shrink-0">
                  {brand.badgeInitials || "SC"}
                </div>
                <div>
                  <div className="font-serif font-bold text-sm tracking-tight uppercase">{brand.name}</div>
                  <div className="text-[11px] text-amber-300 font-mono">Center #{brand.unebCenterNumber}</div>
                </div>
              </div>

              <div className="space-y-2.5 text-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Curriculum:</span>
                  <span className="font-semibold text-right">Uganda CBC / UNEB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Class Range:</span>
                  <span className="font-semibold">Senior 1 to Senior 6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Admissions Status:</span>
                  <span className="font-bold text-emerald-400">2026 Intake Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Campus Location:</span>
                  <span className="font-semibold truncate max-w-[180px] text-right">{brand.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15">
                <Link href="/demo" className="block">
                  <Button className="w-full h-10 bg-white text-[#0b2256] hover:bg-slate-100 font-bold text-xs rounded-none shadow-none">
                    Administrative & Workstation Portals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>

      {/* ========================================================================= */}
      {/* 2. INSTITUTIONAL PORTAL ACCESS STRIP                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Student Portal Card */}
          <Link
            href="/student"
            className="p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-sm hover-lift transition-all group flex items-start gap-4"
          >
            <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 grid place-items-center group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-foreground group-hover:text-blue-600 transition-colors">
                  Student & Parent Portal
                </h3>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Review terminal exam grades, class timetables, digital homework, and dining pass status.
              </p>
            </div>
          </Link>

          {/* Teacher Portal Card */}
          <Link
            href="/teacher"
            className="p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-sm hover-lift transition-all group flex items-start gap-4"
          >
            <div className="size-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#f26522] grid place-items-center group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-foreground group-hover:text-[#f26522] transition-colors">
                  Academic Staff Gradebook
                </h3>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-[#f26522] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Record classroom attendance, enter CBC competency evaluations, and compute terminal UNEB aggregates.
              </p>
            </div>
          </Link>

          {/* Admin Console Card */}
          <Link
            href="/admin"
            className="p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-sm hover-lift transition-all group flex items-start gap-4"
          >
            <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0b2256] dark:text-slate-200 grid place-items-center group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-foreground group-hover:text-[#0b2256] transition-colors">
                  Administrative Command
                </h3>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-[#0b2256] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Institutional governance, fee accounting ledgers, admissions roster, and public website updates.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROVEN EXCELLENCE METRICS                                              */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50 dark:bg-secondary/20 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <p className="text-xs font-bold tracking-widest uppercase text-[#f26522]">
              INSTITUTIONAL PERFORMANCE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A Track Record of Academic Distinction
            </h2>
            <p className="text-sm text-muted-foreground">
              Verified outcomes highlighting our commitment to quality education, graduate teachers, and student advancement.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            <StatCard value={1240} label="Enrolled Scholars" suffix="+" icon={Users} />
            <StatCard value={68} label="Teaching Faculty" suffix=" Staff" icon={Award} />
            <StatCard value={99} label="UNEB First Division Rate" suffix=".4%" icon={Building} />
            <StatCard value={100} label="University Progression" suffix="%" icon={Trophy} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT OUR HERITAGE & WHOLE-CHILD PHILOSOPHY                             */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Photo & Campus Badge */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
              <Image
                src={aboutImg}
                alt="Students studying collaboratively"
                className="w-full h-auto object-cover"
                placeholder="blur"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-card p-4 rounded-xl shadow-lg border border-border hidden sm:flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center">
                <Trophy className="size-6 text-[#f26522]" />
              </div>
              <div className="text-left">
                <div className="font-serif font-bold text-sm text-foreground">Top Division 1 Rank</div>
                <div className="text-xs text-muted-foreground font-mono">UNEB Center #{brand.unebCenterNumber}</div>
              </div>
            </div>
          </div>

          {/* About Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest uppercase text-[#f26522]">
                ABOUT THE INSTITUTION
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                An environment structured for <span className="text-[#0b2256] dark:text-blue-400">academic rigor</span> & character.
              </h2>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              Founded on the pillars of academic excellence and sound moral discipline, {brand.name} provides learners with an intellectually stimulating, respectful, and safe boarding environment. We guide each young person to discover their unique strengths and develop a resilient moral compass.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              {[
                { icon: BookOpen, title: "Competence-Based & UNEB Syllabi" },
                { icon: Microscope, title: "Specialized Science & Physics Labs" },
                { icon: Users, title: "Experienced Graduate Educators" },
                { icon: HeartHandshake, title: "Holistic Moral & Spiritual Growth" },
              ].map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/50 border border-border/60">
                  <div className="size-8 rounded-lg bg-[#0b2256] text-white grid place-items-center shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-foreground">{title}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link href="/about">
                <Button className="h-10 px-5 bg-[#0b2256] hover:bg-[#081a42] text-white font-semibold text-xs rounded-none shadow-none gap-2">
                  <span>Read Institutional Story</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" className="h-10 px-4 text-xs font-semibold rounded-none border-border">
                  View Campus Facilities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CURRICULUM PATHWAYS & DEPARTMENTS                                       */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50 dark:bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest uppercase text-[#f26522]">
                ACADEMIC DEPARTMENTS
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Comprehensive Curricula for Every Discipline
              </h2>
            </div>
            <Link href="/academics">
              <Button variant="outline" className="rounded-none border-border hover:bg-card text-xs font-bold gap-1.5">
                <span>Detailed Syllabus Guide</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(({ icon: Icon, title, desc, href }) => (
              <div
                key={title}
                className="p-7 rounded-2xl bg-card border border-border shadow-sm hover-lift transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center shadow-xs">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{desc}</p>
                </div>
                <Link
                  href={href}
                  className="pt-3 border-t border-border/60 inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2256] dark:text-blue-400 hover:underline uppercase tracking-wider"
                >
                  <span>Department Overview</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HEAD OF SCHOOL / LEADERSHIP STATEMENT                                   */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-card to-secondary/30 border border-border shadow-sm grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="aspect-square relative rounded-xl overflow-hidden border border-border shadow-sm">
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
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0b2256] dark:text-white tracking-tight">
              A Message from the {brand.directorTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
              &ldquo;{brand.directorBio}&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              At {brand.name}, our responsibility extends beyond delivering exceptional national examination grades. We build men and women of sound discipline, scientific aptitude, and moral leadership ready to shape society with honor and excellence.
            </p>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <div className="font-serif font-bold text-sm text-foreground">{brand.directorName}</div>
                <div className="text-xs text-muted-foreground">{brand.directorTitle} • {brand.name}</div>
              </div>
              <div className="font-serif italic text-sm text-slate-500 border-b border-slate-400">
                Official Signature
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PARENT & ALUMNI PERSPECTIVES                                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50 dark:bg-secondary/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <p className="text-xs font-bold tracking-widest uppercase text-[#f26522]">
              COMMUNITY TESTIMONIALS
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              What Parents & Alumni Say About Us
            </h2>
            <p className="text-sm text-muted-foreground">
              Authentic perspectives from families who have entrusted their children&apos;s education to our faculty.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {parentTestimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4 hover-lift transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wide">
                    {t.highlight}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center gap-3">
                  <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-xs grid place-items-center">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-foreground truncate">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ADMISSIONS ROADMAP & FREQUENT INQUIRIES                                 */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: 4-Step Admissions Roadmap */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest uppercase text-[#f26522]">
                ENROLLMENT PROCEDURE
              </p>
              <h2 className="font-serif text-3xl font-extrabold text-foreground tracking-tight">
                Simple, Transparent 4-Step Entry Roadmap
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { step: "01", title: "Submit Online Application", desc: "Complete our quick admissions form with learner particulars and chosen stream." },
                { step: "02", title: "Academic Credential Review", desc: "Provide PLE result slips for S.1 or UCE result slips for S.5 entry." },
                { step: "03", title: "Family Interview & Campus Tour", desc: "A cordial meeting with the Director of Admissions and tour of facilities." },
                { step: "04", title: "Official Offer & Welcome", desc: "Receive the formal admission package and join our scholar community." },
              ].map((s) => (
                <div key={s.step} className="p-4 rounded-xl bg-card border border-border flex items-start gap-3.5">
                  <div className="size-8 rounded-lg bg-[#0b2256] text-white font-mono font-bold text-xs grid place-items-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{s.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/admissions">
                <Button className="w-full h-11 bg-[#0b2256] hover:bg-[#081a42] text-white font-bold text-xs rounded-none shadow-none gap-2">
                  <span>Begin Online Application Now</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Key Admissions FAQs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest uppercase text-[#f26522]">
                PARENT INQUIRIES
              </p>
              <h2 className="font-serif text-3xl font-extrabold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3.5">
              {institutionalFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border bg-card rounded-xl overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left gap-4 font-serif font-bold text-foreground text-sm sm:text-base hover:text-[#0b2256] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#0b2256]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Assistance Card */}
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Speak Directly with our Admissions Desk
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  Have specific questions about vacancies, fee installment plans, or bursaries?
                </div>
              </div>
              <a
                href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-none transition-colors shrink-0 flex items-center gap-2 shadow-xs"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* System Automation Wizard Modal */}
      <SchoolAutomationWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </SiteLayout>
  );
}
