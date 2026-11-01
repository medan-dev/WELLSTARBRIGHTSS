"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { submitApplication } from "../actions";
import { trackMetaEvent } from "@/components/analytics/MetaPixel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import applyHero from "@/assets/apply-hero.png";
import { SectionDivider } from "@/components/ui/SectionDivider";

const schema = z.object({
  studentName: z.string().trim().min(1, "Student name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  parentName: z.string().trim().min(1, "Parent name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  grade: z.string().min(1, "Please select a level"),
  previousSchool: z.string().trim().optional(),
  points: z.string().trim().optional(),
});

export default function ApplyPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      studentName: String(fd.get("studentName") || ""),
      dob: String(fd.get("dob") || ""),
      parentName: String(fd.get("parentName") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      grade,
      previousSchool: String(fd.get("previousSchool") || ""),
      points: String(fd.get("points") || ""),
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    await submitApplication(data);
    setSubmitting(false);
    setSubmitted(true);
    trackMetaEvent("Lead", {
      form: "online_admission",
      grade: data.grade,
      studentName: data.studentName,
    });
    toast.success("Application submitted successfully!");
  };

  return (
    <SiteLayout>
      <PageHero
        subtitle="Apply Now"
        title="Formal"
        accentTitle="Application Form"
        image={applyHero}
        description="Please fill in the applicant's details below to formally apply for a place at Wellstar Bright Secondary School. Our team will review your submission and contact you within 3-5 working days."
      />

      <section className="relative overflow-hidden py-20 bg-secondary/20">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20">
          <div className="rounded-3xl bg-card border shadow-lg p-8 md:p-12">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12 gap-4">
              <div className="size-16 rounded-full bg-emerald-500/10 grid place-items-center">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
              <h2 className="font-display text-2xl font-bold">Application Received!</h2>
              <p className="text-muted-foreground">
                Thank you for applying. Our admissions team will review your application and contact you for the next steps within 3-5 working days.
              </p>
              <Button onClick={() => { setSubmitted(false); setGrade(""); }} variant="outline" className="mt-4">
                Submit another application
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Section 1: Student Details */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold border-b pb-2">1. Student Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName">Full Name *</Label>
                    <Input id="studentName" name="studentName" required className="mt-1.5" placeholder="e.g. Kato Joseph" />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" name="dob" type="date" required className="mt-1.5" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Class/Level Applying For *</Label>
                    <Select value={grade} onValueChange={setGrade} required>
                      <SelectTrigger id="grade" className="mt-1.5">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Senior 1", "Senior 2", "Senior 3", "Senior 4", "Senior 5 (Arts)", "Senior 5 (Sciences)"].map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="previousSchool">Previous School (if any)</Label>
                    <Input id="previousSchool" name="previousSchool" className="mt-1.5" placeholder="Name of previous school" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="points">PLE / UCE Aggregate Points (if applicable)</Label>
                  <Input id="points" name="points" type="number" min={4} max={72} className="mt-1.5" placeholder="e.g. 4 (PLE) or 12 (UCE)" />
                  <p className="mt-1 text-xs text-muted-foreground">Typically required if applying for Senior 1 or Senior 5.</p>
                </div>
              </div>

              {/* Section 2: Parent/Guardian Details */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold border-b pb-2">2. Parent / Guardian Details</h3>
                <div>
                  <Label htmlFor="parentName">Full Name *</Label>
                  <Input id="parentName" name="parentName" required className="mt-1.5" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" required className="mt-1.5" placeholder="+256..." />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required className="mt-1.5" />
                  </div>
                </div>
              </div>

              {/* Section 3: Documents */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold border-b pb-2">3. Supporting Documents (Optional)</h3>
                <p className="text-sm text-muted-foreground">You can upload these now or bring them during the interview. (PDF or images)</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50 transition-smooth">
                    <UploadCloud className="size-6 text-muted-foreground mx-auto mb-2" />
                    <span className="text-sm font-medium">Previous Results / Report</span>
                    <Input type="file" className="hidden" />
                  </div>
                  <div className="border border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50 transition-smooth">
                    <UploadCloud className="size-6 text-muted-foreground mx-auto mb-2" />
                    <span className="text-sm font-medium">Birth Certificate</span>
                    <Input type="file" className="hidden" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={submitting} size="lg" className="w-full bg-primary text-primary-foreground border-0 shadow-sm text-base">
                  {submitting ? "Submitting Application…" : "Submit Formal Application"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>
    </SiteLayout>
  );
}



