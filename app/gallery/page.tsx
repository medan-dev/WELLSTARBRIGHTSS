"use client";

import { useState, useEffect, useMemo } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { X, ZoomIn, Search, Image as ImageIcon, ChevronLeft, ChevronRight, Sparkles, Filter, ArrowRight } from "lucide-react";
import Image from "next/image";
import galleryHero from "@/assets/gallery-3.jpg";
import { PageHero } from "@/components/site/PageHero";
import { getGalleryItems } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";

type Item = { id?: string; src: string; alt: string; caption: string; category: string };

const staticFallbackItems: Item[] = [
  {
    src: "/gallery/stem-lab.png",
    alt: "Secondary students in science laboratory",
    caption: "Senior Science Students conducting Chemistry Titration in Modern Science Lab",
    category: "STEM & Sciences"
  },
  {
    src: "/gallery/computer-lab.png",
    alt: "Students coding in ICT computer lab",
    caption: "Computer Studies & Coding Workshop in State-of-the-Art ICT Tech Hub",
    category: "STEM & Sciences"
  },
  {
    src: "/gallery/sports-field.png",
    alt: "Football match on school sports pitch",
    caption: "Inter-House Football Championship & Track Athletics Competition",
    category: "Sports"
  },
  {
    src: "/gallery/choir-music.png",
    alt: "School choir performing on stage",
    caption: "Annual Music, Dance & Drama (MDD) Festival and Choir Concert Performance",
    category: "Arts & Culture"
  },
  {
    src: "/gallery/library-study.png",
    alt: "Students studying in school library",
    caption: "Collaborative Study & Research Sessions at the School Main Library",
    category: "Campus Life"
  },
  {
    src: "/gallery/graduation-day.png",
    alt: "Graduating students in academic gowns",
    caption: "Senior 6 Valedictory & UNEB National Examination Excellence Celebration",
    category: "Events"
  },
  {
    src: "/gallery/about-students.jpg",
    alt: "Peer mentorship and group study",
    caption: "Student Peer Mentorship and Interactive Group Discussion in Classrooms",
    category: "Campus Life"
  },
  {
    src: "/gallery/gallery-1.jpg",
    alt: "Biology specimen microscopy",
    caption: "Hands-on Biology Specimen Examination and Microscopy Lab Sessions",
    category: "STEM & Sciences"
  },
  {
    src: "/gallery/gallery-2.jpg",
    alt: "Campus activity and group interaction",
    caption: "Annual Science Exhibition & Student Project Demonstrations",
    category: "Events"
  },
  {
    src: "/gallery/gallery-3.jpg",
    alt: "Student fellowship and worship",
    caption: "SDA Christian Fellowship, Youth Ministry & Chapel Praise Service",
    category: "Campus Life"
  },
  {
    src: "/gallery/gallery-4.jpg",
    alt: "Traditional dance performance",
    caption: "Ugandan Cultural Dance and Heritage Showcase by School Performing Troupe",
    category: "Arts & Culture"
  },
  {
    src: "/gallery/hero-campus.jpg",
    alt: "Wellstar Bright campus grounds",
    caption: "Panoramic View of the Main Academic Complex, Gardens & Campus Walkways",
    category: "Campus Life"
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>(staticFallbackItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleryItems().then((res) => {
      if (res && Array.isArray(res) && res.length > 0) {
        setItems(res as any);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    return ["All", "STEM & Sciences", "Campus Life", "Sports", "Arts & Culture", "Events"];
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = filter === "All" || item.category.toLowerCase() === filter.toLowerCase();
      const matchesSearch = searchQuery.trim() === "" || 
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [items, filter, searchQuery]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const nextItem = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevItem = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        subtitle="Campus Gallery"
        title="Moments of"
        accentTitle="Excellence & Discovery."
        image={galleryHero}
        description="Explore the vibrant life at Wellstar Bright Secondary School — from modern science laboratories and ICT tech hubs to sports championships, creative arts, and celebratory milestones."
      />

      {/* Gallery Filter & Search Control Bar */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 pt-10 pb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border/80 shadow-xs">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  filter.toLowerCase() === cat.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-xs scale-[1.02]"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-10 rounded-xl bg-background border-border/70 text-sm"
            />
          </div>
        </div>

        {/* Count Summary */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-medium px-2">
          <span>
            Showing <strong className="text-foreground">{filteredItems.length}</strong> photos {filter !== "All" && `in ${filter}`}
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="text-primary hover:underline font-semibold"
            >
              Clear search
            </button>
          )}
        </div>
      </section>

      {/* Photo Showcase Grid */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 pb-20">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-secondary/30 border border-border/60">
            <ImageIcon className="size-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-foreground">No photos found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your category filter or search keywords.
            </p>
            <Button 
              variant="outline" 
              onClick={() => { setFilter("All"); setSearchQuery(""); }} 
              className="mt-4 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, i) => (
              <AnimatedSection key={i} delay={i * 60} animation="fade-up">
                <div
                  onClick={() => setLightboxIndex(i)}
                  className="group relative overflow-hidden rounded-3xl bg-card border border-border/80 shadow-card hover-lift cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <div className="text-white">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                          {item.category}
                        </span>
                        <p className="text-xs sm:text-sm font-medium line-clamp-2 leading-snug">
                          {item.caption}
                        </p>
                      </div>
                    </div>

                    {/* Zoom Icon Button */}
                    <div className="absolute top-3.5 right-3.5 size-9 rounded-xl bg-black/60 backdrop-blur-md text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                      <ZoomIn className="size-4" />
                    </div>
                  </div>

                  {/* Card Footer Caption */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2 bg-card">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {item.category}
                      </span>
                      <h4 className="font-display font-bold text-sm text-foreground line-clamp-2 mt-1 leading-snug">
                        {item.caption}
                      </h4>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>

      {/* Campus Visit Banner */}
      <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-primary p-10 md:p-14 text-white shadow-elegant border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2 text-center md:text-left">
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-300">
              Experience Campus In Person
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              See the classrooms, labs & sports fields firsthand.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Book a campus tour with our admissions team and experience our learning atmosphere in Kabembe, Mukono.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5 shrink-0">
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-7 rounded-xl shadow-md">
              <Link href="/contact">Book Campus Tour <ArrowRight className="ml-1.5 size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl backdrop-blur-md">
              <Link href="/apply">Apply Online</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Modal */}
      {activeItem && lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close photo preview"
            className="absolute top-5 right-5 z-50 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
          >
            <X className="size-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevItem(); }}
            aria-label="Previous photo"
            className="absolute left-4 sm:left-6 z-50 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextItem(); }}
            aria-label="Next photo"
            className="absolute right-4 sm:right-6 z-50 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
          >
            <ChevronRight className="size-6" />
          </button>

          <div 
            className="max-w-5xl w-full flex flex-col items-center gap-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full max-h-[75vh] rounded-3xl overflow-hidden shadow-2xl bg-black/50 border border-white/10">
              <Image 
                src={activeItem.src} 
                alt={activeItem.alt} 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
            
            <div className="text-center text-white max-w-2xl px-4 space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                {activeItem.category}
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl leading-snug">
                {activeItem.caption}
              </h3>
              <p className="text-xs text-white/60">
                Photo {lightboxIndex + 1} of {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
