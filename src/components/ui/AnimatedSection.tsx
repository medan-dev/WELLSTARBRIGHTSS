"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fade-up" | "fade-in" | "slide-right" | "reveal-up" | "scale-in";
  delay?: number;
  threshold?: number;
}

export function AnimatedSection({ 
  children, 
  className, 
  animation = "reveal-up", 
  delay = 0,
  threshold = 0.05,
  ...props 
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not available, default to visible
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "100px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const animationClass = isVisible 
    ? `animate-${animation} opacity-100` 
    : "opacity-0 translate-y-3";

  return (
    <div 
      ref={ref} 
      className={cn("transition-all duration-700 ease-out", animationClass, className)} 
      style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}
