"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import contactImg from "@/assets/contact-hero.png";
import { SectionDivider } from "@/components/ui/SectionDivider";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("Message received — we'll be in touch soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <SiteLayout>
      <PageHero
        subtitle="Contact Us"
        title="Get in touch with"
        accentTitle="Wellstar Bright."
        image={contactImg}
        description="Have questions about admissions, academic combinations, or student life? Reach out to us or visit our campus in Kabembe, Mukono."
      />

      <section className="relative overflow-hidden py-20 bg-secondary/20">
        <SectionDivider position="top" fillColor="fill-background" flipY={true} />
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-20 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Visit Us", value: "off Kayunga Road, Kabembe, Mukono District, Uganda" },
              { icon: Phone, title: "Call Us", value: "+256 772 589 430" },
              { icon: Mail, title: "Email Us", value: "info@wellstarbright.sc.ug" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex items-start gap-4 p-5 rounded-2xl bg-card border shadow-sm">
                <div className="size-12 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{title}</div>
                  <div className="mt-1 font-medium">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] border border-border">
            <iframe
              title="Wellstar Bright Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=32.75%2C0.35%2C32.90%2C0.45&layer=mapnik&marker=0.395%2C32.815"
              loading="lazy"
              className="size-full"
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl bg-card border shadow-lg p-8 md:p-10 space-y-5 h-fit">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <div>
            <Label htmlFor="name">Your name</Label>
            <Input id="name" name="name" maxLength={100} required className="mt-1.5" placeholder="e.g. Kato Joseph" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" maxLength={255} required className="mt-1.5" placeholder="your@email.com" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" maxLength={1000} rows={5} required className="mt-1.5" placeholder="How can we help you?" />
          </div>
          <Button type="submit" disabled={submitting} size="lg" className="w-full bg-primary text-primary-foreground border-0 shadow-sm">
            {submitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
        <SectionDivider position="bottom" fillColor="fill-background" />
      </section>
    </SiteLayout>
  );
}



