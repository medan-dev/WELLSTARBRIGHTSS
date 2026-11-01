"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";

type LoaderContextType = {
  triggerTransition: (callback?: () => void) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error("useLoader must be used within a LoaderProvider");
  return context;
};

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(true); // SSR initial render is true to avoid flashes
  const [showContent, setShowContent] = useState(false); // Hide children on initial render to prevent flashes
  const [fadeStatus, setFadeStatus] = useState<"in" | "out">("in");

  const triggerLoader = (isStartup: boolean, callback?: () => void) => {
    setProgress(0);
    setFadeStatus("in");
    setShouldRender(true);
    setLoading(true);
    setShowContent(false); // Unmount page children during loading phase

    const duration = isStartup ? 5500 : 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        
        // Mount page children in the background
        setShowContent(true);
        
        // Execute the navigation/routing callback
        if (callback) {
          callback();
        }
        
        // Start loader fade out overlay
        setFadeStatus("out");
        setTimeout(() => {
          setLoading(false);
          setShouldRender(false);
          if (isStartup) {
            sessionStorage.setItem("ns_first_load_done", "true");
            setIsFirstLoad(false);
          }
        }, 700); // match duration-700
      }
      setProgress(Math.floor(currentProgress));
    }, intervalTime);
  };

  const triggerTransition = (callback?: () => void) => {
    triggerLoader(false, callback);
  };

  // Check if first load in session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = sessionStorage.getItem("ns_first_load_done");
      if (done) {
        setIsFirstLoad(false);
        setShouldRender(false);
        setLoading(false);
        setShowContent(true); // Already done, render content immediately
      } else {
        setIsFirstLoad(true);
        triggerLoader(true);
      }
    }
  }, []);

  // Global anchor click listener to intercept navigation and delay it for the loader
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");
        
        if (
          href && 
          href.startsWith("/") && 
          !href.startsWith("#") && 
          targetAttr !== "_blank" &&
          !e.defaultPrevented &&
          !loading
        ) {
          e.preventDefault();
          triggerTransition(() => {
            router.push(href);
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true); // Use capture phase to intercept early
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [router, loading]);

  return (
    <LoaderContext.Provider value={{ triggerTransition }}>
      {showContent && children}
      {shouldRender && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black select-none transition-all duration-700 ease-out ${
            fadeStatus === "in" ? "opacity-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          {/* Background Animated Blobs */}
          <div className="absolute top-1/4 left-1/4 size-80 rounded-full bg-amber-500/10 blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-orange-600/5 blur-3xl animate-blob delay-500" />
          
          <div className="flex flex-col items-center max-w-sm px-6 text-center">
            {/* Animated Logo Container with slow rotating ring */}
            <div className="relative mb-8 flex items-center justify-center">
              <div className="absolute size-24 sm:size-28 border border-dashed border-amber-500/20 rounded-full animate-ring-rotate" />
              <div className="absolute size-28 sm:size-32 border border-dashed border-orange-500/10 rounded-full animate-ring-rotate [animation-direction:reverse] duration-12s" />
              
              <div className="relative size-16 sm:size-20 bg-slate-900/60 rounded-full p-2.5 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-logo-pulse shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Image
                  src={logo}
                  alt="Wellstar Bright School Logo"
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </div>

            {/* School Name Typography with shimmer and fade-in reveal */}
            <div className="animate-text-reveal space-y-1.5">
              <h1 className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 tracking-tight drop-shadow-md">
                Wellstar Bright
              </h1>
              <div className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-amber-300/80 uppercase">
                Secondary School • Mukono
              </div>
            </div>

            {/* Loading progress bar indicator */}
            <div className="mt-12 flex flex-col items-center gap-3 animate-fade-in delay-200 w-full">
              <div className="w-48 sm:w-56 h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="text-[10px] font-mono text-white/30 tracking-wider uppercase font-bold flex items-center gap-1.5">
                {isFirstLoad ? "Initializing Campus System" : "Transitioning"}
                <span className="text-amber-400 font-extrabold">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};
