"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Award, Heart, Lightbulb, Target, Users, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/site/PageHero";
import aboutImg from "@/assets/about-students.jpg";
import { SectionDivider } from "@/components/ui/SectionDivider";

const values = [
  { icon: Lightbulb, title: "Curiosity", desc: "We protect and amplify the wonder children are born with." },
  { icon: Heart, title: "Character", desc: "Kindness, integrity, and resilience are taught alongside calculus." },
  { icon: Users, title: "Community", desc: "Every student, parent, and teacher belongs and is seen." },
  { icon: Target, title: "Excellence", desc: "We hold high expectations and provide the support to meet them." },
];

const team = [
  {
    name: "Nshuti Medan",
    role: "Head of School / Director",
    initials: "NM",
    bio: "Nshuti has led Wellstar Bright since 2012. A former Makerere University Fellow, he has shaped our whole-child approach to education over the past decade.",
  },
  {
    name: "Sserwadda Ivan",
    role: "Director of Academics",
    initials: "SI",
    bio: "Ivan joined in 2015 from the Ministry of Education. He oversees curriculum design across all classes and leads our teacher development programme.",
  },
  {
    name: "Nagawa Christine",
    role: "Head of Admissions",
    initials: "NC",
    bio: "Christine ensures every family feels welcomed from their very first enquiry. She has been part of the Wellstar Bright team since the founding year.",
  },
  {
    name: "Kemigisha Fiona",
    role: "Director of Wellbeing",
    initials: "KF",
    bio: "Fiona leads our evidence-based wellbeing programme and oversees the counselling team, sport, and pastoral care across the school.",
  },
];

function TeamCard({ member }: { member: typeof team[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-center p-6 rounded-2xl bg-card border shadow-sm hover-lift">
      <div className="mx-auto size-24 rounded-full bg-primary/10 grid place-items-center text-primary font-display text-2xl font-bold">
        {member.initials}
      </div>
      <h3 className="mt-4 font-display font-semibold text-lg">{member.name}</h3>
      <p className="text-sm text-muted-foreground">{member.role}</p>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
        aria-expanded={open}
      >
        {open ? "Hide bio" : "Read bio"}
        {open ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
      </button>
      {open && (
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed animate-fade-in text-left border-t pt-3">
          {member.bio}
        </p>
      )}
    </div>
  );
}

const milestones = [
  { year: "2008", event: "Founded with 42 students across three classes." },
  { year: "2012", event: "Opened our dedicated Science & Arts wing." },
  { year: "2016", event: "First graduating class achieving 100% university admission." },
  { year: "2019", event: "Launched our full scholarship programme." },
  { year: "2022", event: "New 12-acre campus expansion completed." },
  { year: "2024", event: "Named a Top 10 independent school in the region." },
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        subtitle="About Us"
        title="Nurturing character,"
        accentTitle="inspiring minds."
        image={aboutImg}
        description="Since 2008, Wellstar Bright Secondary School has offered a dynamic learning environment where students discover their strengths, build lifelong friendships, and grow into compassionate global leaders."
      />

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 grid md:grid-cols-2 gap-12">
          <div className="p-8 md:p-12 rounded-3xl bg-secondary/40 border border-border/50">
            <h2 className="font-display text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              To ignite curiosity, cultivate character, and empower every learner to lead a life
              of purpose, contribution, and continuous growth in an ever-changing world.
            </p>
          </div>
          <div className="p-8 md:p-12 rounded-3xl bg-secondary/40 border border-border/50">
            <h2 className="font-display text-3xl font-bold tracking-tight">Our Vision</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              A community where every student is known, valued, and inspired to reach their
              highest potential — intellectually, creatively, and morally.
            </p>
          </div>
        </div>
      </section>

      {/* History & Journey */}
      <section className="relative overflow-hidden py-20 bg-secondary/20">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-primary mb-2">
              Our Journey
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              A brief history of Wellstar Bright
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From our humble beginnings with just 42 students to a thriving campus of over 1,200 learners, our journey has been defined by continuous growth, innovation, and an unwavering commitment to our core values.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Left Column: First 3 milestones */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-8">
              {milestones.slice(0, 3).map((m) => (
                <div key={m.year} className="group relative overflow-hidden p-8 rounded-3xl bg-card border shadow-sm hover-lift">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700 font-display text-8xl md:text-9xl font-bold -mt-6 -mr-6 pointer-events-none">
                    {m.year}
                  </div>
                  <div className="relative z-10">
                    <div className="text-xl font-extrabold text-primary mb-2">
                      {m.year}
                    </div>
                    <p className="text-lg text-foreground/90 font-medium leading-relaxed">
                      {m.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Last 3 milestones */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-8">
              {milestones.slice(3, 6).map((m) => (
                <div key={m.year} className="group relative overflow-hidden p-8 rounded-3xl bg-card border shadow-sm hover-lift">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700 font-display text-8xl md:text-9xl font-bold -mt-6 -mr-6 pointer-events-none">
                    {m.year}
                  </div>
                  <div className="relative z-10">
                    <div className="text-xl font-extrabold text-primary mb-2">
                      {m.year}
                    </div>
                    <p className="text-lg text-foreground/90 font-medium leading-relaxed">
                      {m.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-center">
            What we stand for
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-card border shadow-sm hover-lift">
                <div className="size-12 rounded-xl bg-primary/10 grid place-items-center">
                  <Icon className="size-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative overflow-hidden py-20 bg-secondary/30">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              School leadership
            </h2>
            <p className="mt-4 text-muted-foreground">
              Passionate educators and leaders committed to bringing out the best in every child.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32 text-white text-center">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20 max-w-xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Come and experience our community
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            Campus tours run every Wednesday and Friday during term time. We would love to meet you.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground border-0 shadow-sm">
              <Link href="/contact">Book a tour</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/apply">Apply now</Link>
            </Button>
          </div>
        </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>
    </SiteLayout>
  );
}
