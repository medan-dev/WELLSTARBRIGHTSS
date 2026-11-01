"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSiteContent, updateSiteContent } from "../../../actions";
import { toast } from "sonner";

export default function CMSPage() {
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteContent().then(setContent);
  }, []);

  if (!content) return <div className="p-8 text-center text-muted-foreground">Loading CMS...</div>;

  const handleSave = async () => {
    setSaving(true);
    await updateSiteContent(content);
    setSaving(false);
    toast.success("Website content updated successfully!");
  };

  const updateStat = (index: number, field: string, value: any) => {
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...content.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setContent({ ...content, testimonials: newTestimonials });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <PageHeader title="Website Content Manager" subtitle="Manage public-facing website data in real time" />
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground shadow-sm px-6 h-10">
          <Save className="size-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* STATS SECTION */}
        <section className="p-6 rounded-2xl bg-card border shadow-sm">
          <h3 className="font-display text-xl font-semibold mb-4 text-foreground/90">Homepage Statistics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.stats.map((stat: any, i: number) => (
              <div key={i} className="p-4 border border-border/50 rounded-xl space-y-3 bg-secondary/20 hover:border-border transition-smooth">
                <div>
                  <Label>Label</Label>
                  <Input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Value</Label>
                  <Input type="number" value={stat.value} onChange={(e) => updateStat(i, "value", Number(e.target.value))} className="mt-1.5" />
                </div>
                <div>
                  <Label>Suffix (Optional)</Label>
                  <Input value={stat.suffix || ""} onChange={(e) => updateStat(i, "suffix", e.target.value)} className="mt-1.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="p-6 rounded-2xl bg-card border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold text-foreground/90">Testimonials</h3>
            <Button variant="outline" size="sm" onClick={() => setContent({ ...content, testimonials: [{ name: "New Name", role: "Role", quote: "Quote here...", rating: 5 }, ...content.testimonials] })}>
              <Plus className="size-4 mr-1" /> Add New
            </Button>
          </div>
          <div className="grid gap-6">
            {content.testimonials.map((t: any, i: number) => (
              <div key={i} className="p-5 border border-border/50 rounded-xl flex flex-col md:flex-row gap-5 bg-secondary/20 hover:border-border transition-smooth relative group">
                <div className="flex-1 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Author Name</Label>
                      <Input value={t.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Role / Relation</Label>
                      <Input value={t.role} onChange={(e) => updateTestimonial(i, "role", e.target.value)} className="mt-1.5" />
                    </div>
                  </div>
                  <div>
                    <Label>Quote</Label>
                    <textarea 
                      value={t.quote} 
                      onChange={(e) => updateTestimonial(i, "quote", e.target.value)} 
                      className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5 resize-y" 
                    />
                  </div>
                </div>
                <div className="flex md:flex-col justify-end pt-2 md:pt-0">
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 transition-smooth opacity-100 md:opacity-0 group-hover:opacity-100" onClick={() => {
                    const newT = content.testimonials.filter((_: any, idx: number) => idx !== i);
                    setContent({ ...content, testimonials: newT });
                  }}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

