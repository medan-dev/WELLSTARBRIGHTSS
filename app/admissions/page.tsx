"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, FileText, MessageSquare, UserCheck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import admissionsHero from "@/assets/gallery-2.jpg";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { trackMetaEvent } from "@/components/analytics/MetaPixel";

const steps = [
  { icon: FileText, title: "Apply online", desc: "Complete our short enquiry form in under 5 minutes." },
  { icon: MessageSquare, title: "Family interview", desc: "A warm conversation with our admissions team." },
  { icon: UserCheck, title: "Student visit day", desc: "Your child spends a joyful day on campus with us." },
  { icon: CheckCircle2, title: "Offer & welcome", desc: "Receive your offer and join the Wellstar Bright family." },
];

const faqs = [
  { q: "What ages do you accept?", a: "We welcome students aged 11–19, from Senior 1 through Senior 6 (both O-Level and A-Level)." },
  { q: "Is financial aid available?", a: "Yes. We offer means-tested bursaries and merit scholarships covering up to 100% of fees. Apply alongside your enquiry." },
  { q: "Do you accept mid-year enrolments?", a: "We review mid-year applications on a case-by-case basis depending on year group capacity. Contact admissions to discuss." },
  { q: "How long does the process take?", a: "From enquiry to offer typically takes 2–4 weeks including the family interview and visit day." },
  { q: "Is there an assessment?", a: "There is no formal academic test — we use a conversation, a visit day, and school reports to understand each child holistically." },
];

const schema = z.object({
  parentName: z.string().trim().min(1, "Parent name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().optional(),
  childName: z.string().trim().min(1, "Child's name is required").max(100),
  grade: z.string().min(1, "Please select a year group"),
  message: z.string().trim().max(1000).optional(),
});

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left font-medium hover:text-primary transition-smooth"
        aria-expanded={open}
      >
        {q}
        <ChevronDown className={`size-4 shrink-0 ml-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-4 text-muted-foreground text-sm leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

export default function AdmissionsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      parentName: String(fd.get("parentName") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      childName: String(fd.get("childName") || ""),
      grade,
      message: String(fd.get("message") || ""),
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
    trackMetaEvent("Lead", {
      form: "admissions_enquiry",
      parentName: data.parentName,
      grade: data.grade,
    });
    toast.success("Application received! We'll be in touch within 2 working days.");
  };

  return (
    <SiteLayout>
      <PageHero
        subtitle="Admissions"
        title="Begin your"
        accentTitle="Wellstar Bright journey."
        image={admissionsHero}
        description="Our admissions process is warm, transparent, and built around your family. We follow each child's lead to ensure a joyful transition to our community."
      />

      {/* Steps */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative p-6 rounded-2xl bg-card border shadow-sm hover-lift">
              <div className="absolute -top-3 -right-3 size-8 rounded-full bg-primary grid place-items-center text-primary-foreground text-sm font-bold shadow-sm">
                {i + 1}
              </div>
              <div className="size-12 rounded-xl bg-primary/10 grid place-items-center">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + FAQ side by side */}
      <section className="relative overflow-hidden py-20 bg-secondary/20">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20 grid lg:grid-cols-2 gap-12 items-start">
        {/* Enquiry Form */}
        <div className="rounded-3xl bg-card border shadow-lg p-8 md:p-12">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <div className="size-16 rounded-full bg-emerald-500/10 grid place-items-center">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
              <h2 className="font-display text-2xl font-bold">Application submitted!</h2>
              <p className="text-muted-foreground">
                Thank you! Our admissions team will contact you within 2 working days to arrange
                your family interview.
              </p>
              <Button onClick={() => { setSubmitted(false); setGrade(""); }} variant="outline" className="mt-4">
                Submit another enquiry
              </Button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl font-bold">Enquiry form</h2>
              <p className="mt-2 text-muted-foreground">We typically respond within 2 working days.</p>
              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parentName">Parent / guardian name *</Label>
                    <Input id="parentName" name="parentName" maxLength={100} required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" maxLength={255} required className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" name="phone" type="tel" className="mt-1.5" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="childName">Child's name *</Label>
                    <Input id="childName" name="childName" maxLength={100} required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="grade">Year group *</Label>
                    <Select value={grade} onValueChange={setGrade} required>
                      <SelectTrigger id="grade" className="mt-1.5">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Senior 1–2 (Age 11–13)", "Senior 3–4 (Age 14–16)", "Senior 5–6 (A-Level)"].map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Anything we should know? (optional)</Label>
                  <Textarea id="message" name="message" maxLength={1000} rows={4} className="mt-1.5" placeholder="Any questions, special requirements, or additional context…" />
                </div>
                <Button type="submit" disabled={submitting} size="lg" className="w-full bg-primary text-primary-foreground border-0 shadow-sm">
                  {submitting ? "Sending…" : "Submit enquiry"}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-3xl font-bold">Frequently asked questions</h2>
          <p className="mt-2 text-muted-foreground">Everything you need to know before applying.</p>
          <div className="mt-8 rounded-2xl bg-card border shadow-sm p-6 divide-y divide-border">
            {faqs.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
          <div className="mt-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-sm font-medium">Still have questions?</p>
            <p suppressHydrationWarning className="mt-1 text-sm text-muted-foreground">
              Call us on <a href="tel:+256772589430" className="text-primary font-medium hover:underline">+256 772 589 430</a> or email{" "}
              <a href="mailto:admissions@wellstarbright.sc.ug" className="text-primary font-medium hover:underline">admissions@wellstarbright.sc.ug</a>
            </p>
          </div>
        </div>
      </div>
      <SectionDivider position="bottom" fillColor="fill-background" />
    </section>
    </SiteLayout>
  );
}



