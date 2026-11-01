"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, BookOpen, GraduationCap, ChevronDown, 
  CheckCircle2, Award, Microscope, Globe2 
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import academicsHero from "@/assets/gallery-1.jpg";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionDivider } from "@/components/ui/SectionDivider";

const stages = [
  {
    icon: BookOpen,
    name: "Lower Secondary (S.1–S.2)",
    range: "Form 1 – Form 2 • Ages 11–13",
    tag: "Competence-Based Curriculum",
    desc: "Introduction to core scientific concepts, language proficiency, and critical thinking under the new Ugandan competence-based curriculum.",
    subjects: ["Mathematics & English", "Physics & Chemistry", "Biology & Agriculture", "ICT & Kiswahili", "Physical Education", "Religious Education"],
    details: "Our S.1 and S.2 programs focus on foundational sciences, communication skills, and initial project-led competence evaluations. Students build practical skills in computer labs and school science laboratories, transitioning smoothly into secondary academics.",
  },
  {
    icon: BookOpen,
    name: "Lower Secondary (S.3–S.4)",
    range: "Form 3 – Form 4 • Ages 14–16",
    tag: "UNEB UCE Candidate Preparation",
    desc: "Advanced preparation for the Uganda Certificate of Education (UCE) UNEB national examinations with specialized elective pathways.",
    subjects: ["Core Sciences (Physics, Chem, Bio)", "Humanities & Geography", "Entrepreneurship & Commerce", "Fine Art & Vocational Tracks", "Literature in English", "Computer Studies"],
    details: "S.3 and S.4 students choose elective subjects alongside core mathematics and sciences. We emphasize laboratory experimentation, creative arts, and entrepreneurship projects. Expert candidate mentorship ensures outstanding performance in the national UNEB exams.",
  },
  {
    icon: GraduationCap,
    name: "Advanced Level (S.5–S.6)",
    range: "Senior 5 – Senior 6 • Ages 16–19",
    tag: "UNEB UACE University Pathways",
    desc: "Rigorous academic specialization across standard Science and Arts combinations for top university degree entry.",
    subjects: ["PCM & BCM Combinations", "HEG & LEG Combinations", "Divinity & Fine Art", "General Paper & Sub-Maths/ICT", "Economics & History", "Physics & Chemistry"],
    details: "At A-Level, students focus on their specialized combinations in preparation for the national UACE exams. Dedicated university counselling, career guidance, and leadership mentorship support students from day one.",
  },
];

function StageCard({ stage, index }: { stage: typeof stages[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = stage.icon;
  return (
    <AnimatedSection animation="fade-up" delay={index * 100}>
      <div className="grid lg:grid-cols-12 gap-8 p-8 md:p-12 rounded-3xl bg-card border border-border/80 shadow-card hover-lift transition-all">
        <div className="lg:col-span-4 space-y-4">
          <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center shadow-xs">
            <Icon className="size-7" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider uppercase text-primary mb-1">
              Stage {index + 1} • {stage.tag}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
              {stage.name}
            </h2>
            <div className="mt-1 text-xs text-muted-foreground font-semibold">{stage.range}</div>
          </div>
          
          <div className="pt-2">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 rounded-xl shadow-xs">
              <Link href="/apply">Apply for this stage</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-normal">
            {stage.desc}
          </p>

          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Curriculum Disciplines & Modules:
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {stage.subjects.map((s) => (
                <div key={s} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border/40 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
            >
              {expanded ? "Hide details" : "Read full curriculum details"}
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && (
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-fade-in p-4 rounded-2xl bg-secondary/40 border border-border/50">
                {stage.details}
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function AcademicsPage() {
  return (
    <SiteLayout>
      <PageHero
        subtitle="Academics"
        title="Learning without"
        accentTitle="limitations."
        image={academicsHero}
        description="Our curriculum is designed to spark curiosity, build practical skills, and prepare principled leaders for university and beyond under the Uganda National Examinations Board (UNEB)."
      />

      {/* Academic Highlights Strip */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-card flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Award className="size-6" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-foreground">UNEB Exam Center</div>
              <div className="text-xs text-muted-foreground">Certified O-Level & A-Level Center</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-card flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Microscope className="size-6" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-foreground">Practical STEM Labs</div>
              <div className="text-xs text-muted-foreground">Modern Physics, Chemistry & Biology</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-card flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <Globe2 className="size-6" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-foreground">University Pathways</div>
              <div className="text-xs text-muted-foreground">Science, Arts & Business Combinations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stages Section */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary mb-2">
            Educational Stages
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Comprehensive Secondary Pathways
          </h2>
        </div>

        {stages.map((stage, i) => (
          <StageCard key={stage.name} stage={stage} index={i} />
        ))}
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32 text-white text-center">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="max-w-2xl mx-auto space-y-4 relative z-20 px-6 sm:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to explore the right pathway?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Our academic guidance team will help you choose the ideal combination and stage for your student's career aspirations.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-8 rounded-xl shadow-md">
              <Link href="/apply">Start Your Application <ArrowRight className="ml-1.5 size-4" /></Link>
            </Button>
          </div>
        </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>
    </SiteLayout>
  );
}
