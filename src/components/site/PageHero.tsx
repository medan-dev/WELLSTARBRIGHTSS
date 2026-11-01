import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Image from "next/image";
import defaultHeroImg from "@/assets/hero-campus.jpg";
import { SectionDivider } from "@/components/ui/SectionDivider";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  accentTitle?: string;
  className?: string;
  children?: React.ReactNode;
  image?: any;
}

export function PageHero({
  title,
  subtitle,
  description,
  accentTitle,
  className,
  children,
  image = defaultHeroImg,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden bg-slate-950 min-h-[560px] md:min-h-[640px] flex items-center pt-36 pb-24 md:pt-42 md:pb-28", className)}>
      {/* Background Media with High-Contrast Blocker Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src={image || defaultHeroImg} 
            alt="" 
            fill
            priority
            className="object-cover scale-105" 
          />
          {/* Side-fading scrim: dark on the left for text contrast, fading to transparent on the right for image visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
        </div>
        
        {/* Enhanced Ambient Glowing Mesh & Warm Sunlight Flare */}
        <div className="absolute -top-32 -left-32 size-[600px] bg-blue-500/35 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 size-[400px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/3 -right-32 size-[500px] bg-amber-400/25 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="max-w-3xl space-y-4">
          {subtitle && (
            <AnimatedSection animation="fade-up" delay={50}>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
                {subtitle}
              </p>
            </AnimatedSection>
          )}

          <AnimatedSection animation="reveal-up" delay={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] m-0">
              {title}
              {accentTitle && (
                <> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 font-extrabold">{accentTitle}</span></>
              )}
            </h1>
          </AnimatedSection>

          {description && (
            <AnimatedSection animation="fade-up" delay={200}>
              <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl leading-relaxed font-normal pt-1">
                {description}
              </p>
            </AnimatedSection>
          )}
          
          {children && (
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="mt-6 flex flex-wrap gap-4 items-center pt-2">
                {children}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* Curved Divider mapping to the background of the section below */}
      <SectionDivider position="bottom" fillColor="fill-background" />
    </section>
  );
}
