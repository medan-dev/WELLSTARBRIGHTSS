"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, BookOpen, Trophy, Users, Calendar,
  Microscope, Palette, Globe2, Code2, Music, Dumbbell, Quote, 
  Star, ChevronLeft, ChevronRight, GraduationCap, ShieldCheck, 
  CheckCircle2, Compass, Award, Building, HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { siteContent as defaultSiteContent } from "@/components/admin/data";
import { getSiteContent } from "./actions";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import heroImg from "@/assets/hero-campus.jpg";
import aboutImg from "@/assets/about-students.jpg";

const socialReviews = [
  {
    id: 1,
    platform: "google",
    name: "Dr. Ronald Mukasa",
    role: "Parent of S.4 Student",
    avatar: "RM",
    rating: 5,
    date: "1 week ago",
    content: "Wellstar Bright has been a blessing to our family. The focus on both academic excellence and strong moral character is exactly what secondary students in Mukono need. Highly recommend it!"
  },
  {
    id: 2,
    platform: "facebook",
    name: "Sarah Namubiru",
    role: "Alumni (Class of 2022)",
    avatar: "SN",
    rating: 5,
    date: "3 days ago",
    content: "So proud of my alma mater! The science labs and computer studies gave me the best head start for my software engineering degree at Makerere. Best mixed secondary school!"
  },
  {
    id: 3,
    platform: "twitter",
    name: "Nsubuga Derrick",
    role: "Local Leader",
    avatar: "ND",
    rating: 5,
    date: "Yesterday",
    content: "Congratulations to Wellstar Bright choir for winning the National Music & Drama school finals once again! The talent at this school is unmatched. 🌟🏆 #WellstarBright #Mukono"
  },
  {
    id: 4,
    platform: "whatsapp",
    name: "Mrs. Nabirye Gloria",
    role: "Parent of S.1 Student",
    avatar: "NG",
    rating: 5,
    date: "Just now",
    content: "Good evening teacher, I just wanted to thank you for the student portal updates. Being able to see my daughter's marks and attendance instantly helps me support her from home."
  },
  {
    id: 5,
    platform: "google",
    name: "Eng. Samuel Kizza",
    role: "Parent of S.6 Candidate",
    avatar: "SK",
    rating: 5,
    date: "2 weeks ago",
    content: "Excellent teachers and dedicated administration under Nshuti Medan. The school facilities are modern and expanding. A top-tier secondary school in Kabembe!"
  },
  {
    id: 6,
    platform: "facebook",
    name: "Apio Brenda",
    role: "Parent & Business Owner",
    avatar: "AB",
    rating: 5,
    date: "5 days ago",
    content: "The discipline at Wellstar Bright is outstanding. My son has grown so much in terms of self-responsibility and moral character. The SDA values are very visible."
  }
];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="size-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="size-5 fill-[#1877F2] shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" className="size-4.5 fill-foreground shrink-0 dark:fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className="size-5 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.006c6.56 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      );
    default:
      return null;
  }
};

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

function StatCard({ value, label, suffix = "", icon: Icon }: { value: number; label: string; suffix?: string; icon?: any }) {
  const [visible, setVisible] = useState(false);
  const n = useCounter(value, 1600, visible);
  return (
    <div
      ref={(el) => {
        if (!el || visible) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.4 });
        io.observe(el);
      }}
      className="relative p-7 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-card hover-lift transition-all group text-center flex flex-col items-center justify-center space-y-3"
    >
      {Icon && (
        <div className="size-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-1 group-hover:scale-105 transition-transform">
          <Icon className="size-6" />
        </div>
      )}
      <div className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
        {n.toLocaleString()}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground font-semibold uppercase tracking-wider">{label}</div>
    </div>
  );
}

const programs = [
  { icon: Microscope, title: "STEM & Sciences", desc: "Hands-on biological, physical, and chemistry laboratories with inquiry-led experiments and practical projects.", href: "/academics" },
  { icon: Palette, title: "Arts & Design", desc: "Studios for fine art, creative craftsmanship, technical drawing, ceramics, and multimedia visual communication.", href: "/academics" },
  { icon: Code2, title: "Computer Studies & ICT", desc: "Modern computer laboratories covering programming fundamentals, digital literacy, and modern software skills.", href: "/academics" },
  { icon: Globe2, title: "Languages & Humanities", desc: "Global perspectives across English literature, history, geography, economics, and civic leadership.", href: "/academics" },
  { icon: Music, title: "Music, Dance & Drama", desc: "Acclaimed school choir, traditional African and classical instruments, and national drama performances.", href: "/academics" },
  { icon: Dumbbell, title: "Sports & Athletics", desc: "Track events, football, basketball, netball, and holistic wellness programmes designed for every student.", href: "/academics" },
];

function HeroTextAnimation() {
  const [charIndex, setCharIndex] = useState(0);
  const text1 = "Where curious minds ";
  const text2 = "become ";
  const text3 = "tomorrow's leaders.";
  const fullText = text1 + text2 + text3;
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setZoomed(true), 50);
    const interval = setInterval(() => {
      setCharIndex((prev) => {
        if (prev < fullText.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 35);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const currentText = fullText.substring(0, charIndex);
  const isDone = charIndex === fullText.length;

  return (
    <div
      className={`transition-all duration-[1200ms] ease-out ${
        zoomed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.12] m-0">
        {currentText.substring(0, text1.length)}
        {currentText.length > text1.length && (
          <>
            {currentText.substring(text1.length, text1.length + text2.length)}
            <span
              className={`transition-colors duration-700 ease-in-out ${
                isDone 
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 font-extrabold" 
                  : "text-white"
              }`}
            >
              {currentText.substring(text1.length + text2.length)}
            </span>
          </>
        )}
        <span className={`inline-block ml-1.5 w-2 h-[0.8em] bg-amber-400 align-middle transition-opacity duration-300 ${isDone ? 'animate-pulse opacity-50' : 'opacity-100'}`} />
      </h1>
      <p className={`mt-6 text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl font-normal leading-relaxed transition-all duration-700 ${isDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        A modern secondary school combining academic excellence with moral character, practical innovation, and individual mentorship from Senior 1 to Senior 6.
      </p>
    </div>
  );
}

export default function HomePage() {
  const [content, setContent] = useState(defaultSiteContent);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    getSiteContent().then((data) => {
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

  const maxIdx = Math.max(0, socialReviews.length - cardsToShow);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActiveReviewIdx((prev) => (prev >= maxIdx ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(t);
  }, [paused, maxIdx]);

  const prevReview = () => {
    setPaused(true);
    setActiveReviewIdx((prev) => (prev === 0 ? maxIdx : prev - 1));
  };

  const nextReview = () => {
    setPaused(true);
    setActiveReviewIdx((prev) => (prev >= maxIdx ? 0 : prev + 1));
  };

  const statIcons = [Users, Award, Building, Trophy];

  return (
    <SiteLayout>
      {/* CINEMATIC HERO WITH INCREASED HEIGHT & BALANCED SPACING */}
      <section className="relative overflow-hidden bg-slate-950 min-h-[560px] md:min-h-[640px] flex items-center pt-36 pb-24 md:pt-42 md:pb-28">
        {/* Background Image & Blocker Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src={heroImg} 
            alt="Wellstar Bright Campus" 
            className="size-full object-cover scale-105" 
            placeholder="blur" 
            priority 
          />
          {/* Side-fading scrim: dark on the left for text contrast, fading to transparent on the right for image visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          {/* Enhanced Ambient Glowing Mesh & Warm Sunlight Flare */}
          <div className="absolute -top-32 -left-32 size-[600px] bg-blue-500/35 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-0 right-1/4 size-[400px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          <div className="absolute top-1/3 -right-32 size-[500px] bg-amber-400/25 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="max-w-3xl space-y-6">
            <HeroTextAnimation />

            <div className="pt-2 flex flex-row flex-wrap items-center justify-start gap-3 sm:gap-4 animate-fade-up delay-200">
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold border-0 shadow-md hover-lift-sm h-12 px-7 sm:px-8 rounded-xl text-sm sm:text-base">
                <Link href="/apply" className="flex items-center gap-2">
                  Apply <ArrowRight className="size-4" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 px-6 sm:px-7 rounded-xl text-sm sm:text-base backdrop-blur-md">
                <Link href="/about">
                  Discover
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>

      {/* QUICK PORTAL ACCESS STRIP */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 -mt-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Student Card */}
          <Link 
            href="/student"
            className="p-7 rounded-3xl bg-card border border-border/80 shadow-card hover-lift transition-all group flex items-start gap-4"
          >
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-blue-600 transition-colors">
                  Student Portal
                </h3>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Check exam scores, class timetable, homework, and merit boards.
              </p>
            </div>
          </Link>

          {/* Teacher Card */}
          <Link 
            href="/teacher"
            className="p-7 rounded-3xl bg-card border border-border/80 shadow-card hover-lift transition-all group flex items-start gap-4"
          >
            <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-orange-600 transition-colors">
                  Teacher Portal
                </h3>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Record attendance, enter exam marks, and assign class homework.
              </p>
            </div>
          </Link>

          {/* Admin Card */}
          <Link 
            href="/admin"
            className="p-7 rounded-3xl bg-card border border-border/80 shadow-card hover-lift transition-all group flex items-start gap-4"
          >
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Admin Console
                </h3>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Manage student records, notice studio, admissions, and website.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative overflow-hidden bg-secondary/20 py-20 md:py-24">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary">
              By The Numbers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              A Track Record of Proven Excellence
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {content.stats.map((s, i) => (
              <AnimatedSection key={i} delay={i * 100} animation="scale-in">
                <StatCard {...s} icon={statIcons[i % statIcons.length]} />
              </AnimatedSection>
            ))}
          </div>
        </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>

      {/* ABOUT BLOCK */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-12 md:py-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <AnimatedSection animation="slide-right">
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border">
              <Image
                src={aboutImg}
                alt="Students collaborating in classroom"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                placeholder="blur"
              />
            </div>
            
            {/* Floating Recognition Card */}
            <div className="absolute -bottom-6 -right-6 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl p-5 shadow-elegant hidden md:flex items-center gap-3.5 animate-float">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                <Trophy className="size-7 text-amber-500" />
              </div>
              <div>
                <div className="font-display font-extrabold text-base text-foreground">Top Performing</div>
                <div className="text-xs text-muted-foreground font-medium">Kabembe, Mukono District</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200} className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary">
              About Wellstar Bright
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              A holistic school built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">character & intellect.</span>
            </h2>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            Founded with a vision to nurture future-ready, principled leaders, Wellstar Bright Secondary School combines rigorous national curriculum standards with Christian values, practical innovation, and individual mentorship.
          </p>

          <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
            {[
              { icon: BookOpen, title: "O-Level & A-Level Curriculum" },
              { icon: Users, title: "Dedicated Faculty Mentorship" },
              { icon: Trophy, title: "Science & Innovation Labs" },
              { icon: HeartHandshake, title: "SDA Christian Moral Values" },
            ].map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/60 border border-border/50">
                <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-xs">
                  <Icon className="size-4" />
                </div>
                <div className="font-semibold text-xs sm:text-sm text-foreground">{title}</div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-7 rounded-xl shadow-md hover-lift-sm">
              <Link href="/about">Explore Our Full Story <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* PROGRAMMES */}
      <section className="relative overflow-hidden bg-secondary/40 py-20 md:py-24">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary">
                Curriculum & Pathways
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Empowering every passion & discipline.
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-xl border-border hover:bg-card">
              <Link href="/academics">View Academic Guide <ArrowRight className="ml-1.5 size-4" /></Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(({ icon: Icon, title, desc, href }, i) => (
              <AnimatedSection key={title} delay={i * 80} animation="fade-up">
                <Link
                  href={href}
                  className="group relative p-8 rounded-3xl bg-card border border-border/80 shadow-card hover-lift transition-all overflow-hidden flex flex-col justify-between h-full space-y-6"
                >
                  <div className="space-y-4">
                    <div className="size-13 rounded-2xl bg-primary/10 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xs">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                  <div className="pt-4 border-t border-border/50 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                    <span>Learn more</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>

      {/* TESTIMONIALS & SOCIAL PROOF */}
      <section className="relative overflow-hidden w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-20 md:py-24 bg-gradient-to-b from-transparent to-secondary/15">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary">
            Testimonials & Social Proof
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            What parents, alumni & students are saying
          </h2>
          <p className="text-sm text-muted-foreground">
            Hear from our community across Google, Facebook, Twitter, and WhatsApp about their experience at Wellstar Bright.
          </p>
        </div>

        <AnimatedSection>
          <div className="relative overflow-hidden w-full py-4 px-2">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeReviewIdx * (100 / cardsToShow)}%)` }}
            >
              {socialReviews.map((item) => {
                const isGoogle = item.platform === "google";
                const isFacebook = item.platform === "facebook";
                const isTwitter = item.platform === "twitter";
                const isWhatsapp = item.platform === "whatsapp";

                let avatarBg = "bg-primary/10 text-primary";
                if (isGoogle) avatarBg = "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400";
                if (isFacebook) avatarBg = "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400";
                if (isTwitter) avatarBg = "bg-slate-950/10 text-slate-950 dark:bg-white/10 dark:text-white";
                if (isWhatsapp) avatarBg = "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";

                return (
                  <div
                    key={item.id}
                    className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 flex"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                  >
                    <div className="w-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-soft hover-lift transition-all group">
                      <div className="space-y-4">
                        {/* Header: User Info & Platform Icon */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`size-11 rounded-2xl ${avatarBg} grid place-items-center font-display font-bold text-sm shrink-0 shadow-xs`}>
                              {item.avatar}
                            </div>
                            <div className="text-left min-w-0">
                              <h4 className="font-display font-bold text-sm sm:text-base text-foreground truncate">
                                {item.name}
                              </h4>
                              <p className="text-[11px] font-semibold text-muted-foreground truncate">
                                {item.role}
                              </p>
                            </div>
                          </div>
                          <div className="p-2 rounded-xl bg-secondary/50 border border-border/40 shrink-0">
                            {getPlatformIcon(item.platform)}
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="relative text-left">
                          {isWhatsapp ? (
                            /* WhatsApp Bubble Vibe */
                            <div className="p-4.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/40 text-xs sm:text-sm text-foreground relative">
                              <p className="leading-relaxed whitespace-pre-wrap font-medium">"{item.content}"</p>
                              <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                <span>WhatsApp Message</span>
                                <span className="text-[11px]">✓✓</span>
                              </div>
                            </div>
                          ) : isTwitter ? (
                            /* Twitter Post Vibe */
                            <div className="p-4.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/80 dark:border-slate-800/80 text-xs sm:text-sm text-foreground">
                              <p className="leading-relaxed">"{item.content}"</p>
                              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-sky-500 font-bold">
                                <span>Twitter Feed</span>
                                <span className="inline-block size-3 rounded-full bg-sky-500 text-white p-0.5 flex items-center justify-center text-[7px]">✓</span>
                              </div>
                            </div>
                          ) : (
                            /* Google/Facebook Rating Card Vibe */
                            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground text-left">
                              <div className="flex gap-0.5">
                                {Array.from({ length: item.rating }).map((_, j) => (
                                  <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <p className="leading-relaxed text-foreground/90 font-medium font-display font-semibold">"{item.content}"</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer: Date / Verification */}
                      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                        <span>{item.date}</span>
                        <span className="text-primary font-bold">Verified Review</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={prevReview}
              aria-label="Previous testimonial"
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPaused(true); setActiveReviewIdx(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeReviewIdx ? "w-8 bg-primary" : "w-2 bg-border"}`}
                  aria-label={`Reviews deck page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextReview}
              aria-label="Next testimonial"
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Google Ratings & Trust Badge */}
          <div className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-left animate-fade-up">
            <div className="flex items-center gap-4">
              {/* Google Brand Logo */}
              <div className="p-3 bg-card border rounded-2xl shadow-soft shrink-0">
                <svg viewBox="0 0 24 24" className="size-8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-2xl text-foreground">4.9</span>
                  <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
                  <div className="flex gap-0.5 ml-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  Google Verified Ratings
                </div>
              </div>
            </div>

            <div className="h-px md:h-12 w-full md:w-px bg-border/60 shrink-0" />

            <div className="text-center md:text-left flex-1 min-w-0">
              <div className="font-display font-bold text-base text-foreground flex items-center justify-center md:justify-start gap-1.5">
                Top Rated School in Mukono
                <span className="inline-block size-4.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-0.5 shrink-0 flex items-center justify-center">
                  <CheckCircle2 className="size-3.5" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                Based on <strong>148+ verified reviews</strong> from parents, alumni, and students for academic excellence and character development.
              </p>
            </div>

            <div className="h-px md:h-12 w-full md:w-px bg-border/60 shrink-0" />

            <a
              href="https://www.google.com/search?q=Wellstar+Bright+Secondary+School+Kabembe+Mukono"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold border border-border bg-card hover:bg-secondary text-foreground hover:text-primary transition-smooth shrink-0 shadow-xs active:scale-95"
            >
              <span>View Google Maps Listing</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </AnimatedSection>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32 text-white">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-300">
              Admissions Open 2026 / 2027
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to begin your journey at Wellstar Bright?
            </h2>
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              Join a vibrant school family dedicated to your academic, spiritual, and personal development. Applications for S.1 and S.5 are now open.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold px-8 rounded-xl shadow-md hover-lift-sm">
                <Link href="/apply">Apply Online Today <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl backdrop-blur-md">
                <Link href="/contact">Book Campus Tour</Link>
              </Button>
            </div>
          </div>
        </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>
    </SiteLayout>
  );
}
